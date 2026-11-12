import { getSyncedJobs, saveSyncedJobs, purgeExpiredJobs, AdminJob } from './admin-storage';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '1ed323a3c5mshbbd9b22a4145450p1dd372jsnaf71a8bbc448';

interface SyncCategoryConfig {
  category: string;
  query: string;
}

const CATEGORY_CONFIGS: SyncCategoryConfig[] = [
  { category: 'internships', query: 'internship in India' },
  { category: 'mnc', query: 'software engineer in India' },
  { category: 'banking', query: 'banking finance analyst in India' },
  { category: 'government', query: 'government jobs recruitment in India' },
  { category: 'startup', query: 'startup software engineer in India' },
  { category: 'cat-mba', query: 'management trainee MBA in India' },
  { category: 'core', query: 'embedded engineer in India' },
  { category: 'civil', query: 'civil engineer in India' },
];

async function safeFetchWithTimeout(url: string, headers: Record<string, string>, timeout = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { headers, signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    clearTimeout(timer);
    return null;
  }
}

async function fetchJSearchCategory(query: string, category: string): Promise<AdminJob[]> {
  const headers = {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': 'jsearch.p.rapidapi.com',
    'User-Agent': 'Mozilla/5.0 JobUpdatePortal/1.0',
    'Accept': 'application/json',
  };

  const results: AdminJob[] = [];
  const now = Date.now();

  const urls = [
    `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(query)}&num_pages=1&country=in&date_posted=today`,
    `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(query)}&num_pages=1&country=in&date_posted=3days`,
    `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(query)}&num_pages=1&country=in&date_posted=all`,
  ];

  for (const url of urls) {
    try {
      const json = await safeFetchWithTimeout(url, headers, 10000);
      const list = json?.data?.jobs || (Array.isArray(json?.data) ? json.data : []);
      if (!Array.isArray(list) || list.length === 0) continue;

      for (const item of list) {
        if (!item.job_title || !item.job_apply_link) continue;

        // Check if deadline has ended / expired
        const deadline = item.job_offer_expiration_datetime_utc || '';
        if (deadline) {
          const deadlineTime = new Date(deadline).getTime();
          if (!isNaN(deadlineTime) && deadlineTime < now) {
            continue; // Expired job, skip it
          }
        }

        const location = [item.job_city, item.job_state, item.job_country === 'IN' ? 'India' : item.job_country]
          .filter(Boolean).join(', ') || 'India';

        const empType = (item.job_employment_type || 'FULLTIME').toLowerCase();
        const jobType = empType.includes('intern') ? 'internship' :
                        empType.includes('contract') ? 'contract' :
                        empType.includes('part') ? 'part-time' : 'full-time';

        let salary = '';
        if (item.job_min_salary && item.job_max_salary) {
          salary = `₹${Math.round(item.job_min_salary / 100000)}–${Math.round(item.job_max_salary / 100000)} LPA`;
        }

        let directApplyLink = item.job_apply_link || '';
        if (Array.isArray(item.apply_options) && item.apply_options.length > 0) {
          const direct = item.apply_options.find((opt: any) => opt.is_direct && opt.apply_link);
          if (direct?.apply_link) {
            directApplyLink = direct.apply_link;
          } else if (!directApplyLink && item.apply_options[0]?.apply_link) {
            directApplyLink = item.apply_options[0].apply_link;
          }
        }

        results.push({
          id: `jsearch-${item.job_id || Math.random().toString(36).slice(2, 9)}`,
          title: item.job_title.trim(),
          company: item.employer_name?.trim() || 'Company',
          logo: item.employer_logo || '',
          location,
          jobType,
          category,
          salary,
          applyLink: directApplyLink,
          deadline,
          description: item.job_description?.slice(0, 300) || '',
          isActive: true,
          isPinned: false,
          isFeatured: false,
          createdAt: item.job_posted_at_datetime_utc || new Date().toISOString(),
          source: 'JSearch Live',
        });
      }

      if (results.length > 0) break;
    } catch (err) {
      console.error(`[JobSync] Error fetching for query "${query}":`, err);
    }
  }

  return results;
}

export async function syncJobsAndPurgeExpired() {
  const syncStartTime = new Date().toISOString();
  console.log(`[JobSync] Starting scheduled job sync at ${syncStartTime}...`);

  // Step 1: Purge already expired jobs from DB / Cloudflare R2
  const purgeResult = await purgeExpiredJobs();
  console.log(`[JobSync] Purged expired jobs: ${purgeResult.removedAdmin} admin jobs, ${purgeResult.removedSynced} synced jobs.`);

  // Step 2: Fetch current active jobs for each category concurrently
  const existingSynced = await getSyncedJobs();
  const existingMap = new Map<string, AdminJob>();
  for (const j of existingSynced) {
    existingMap.set(j.id, j);
  }

  const categoryStats: Record<string, number> = {};
  let totalNewAdded = 0;

  const results = await Promise.allSettled(
    CATEGORY_CONFIGS.map(async (cfg) => {
      const freshJobs = await fetchJSearchCategory(cfg.query, cfg.category);
      return { category: cfg.category, freshJobs };
    })
  );

  for (const res of results) {
    if (res.status === 'fulfilled') {
      const { category, freshJobs } = res.value;
      let addedForCategory = 0;
      for (const fj of freshJobs) {
        if (!existingMap.has(fj.id)) {
          existingMap.set(fj.id, fj);
          totalNewAdded++;
          addedForCategory++;
        }
      }
      categoryStats[category] = addedForCategory;
    }
  }

  // Step 3: Filter all active jobs to ensure NO expired job is saved
  const now = Date.now();
  const updatedJobList = Array.from(existingMap.values()).filter(j => {
    if (!j.deadline) return true;
    const d = new Date(j.deadline).getTime();
    return isNaN(d) || d >= now;
  });

  // Keep most recent 500 jobs across categories
  updatedJobList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const trimmed = updatedJobList.slice(0, 500);

  await saveSyncedJobs(trimmed);

  const syncEndTime = new Date().toISOString();
  console.log(`[JobSync] Job sync completed at ${syncEndTime}. Total active jobs stored: ${trimmed.length}.`);

  return {
    success: true,
    syncStartTime,
    syncEndTime,
    totalActiveJobs: trimmed.length,
    totalNewAdded,
    purgedExpiredAdminJobs: purgeResult.removedAdmin,
    purgedExpiredSyncedJobs: purgeResult.removedSynced,
    categoryStats,
  };
}
