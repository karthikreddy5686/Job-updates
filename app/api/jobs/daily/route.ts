import { NextResponse } from 'next/server'
import { getJobs } from '@/lib/admin-storage'
import companyLogos from '@/data/company-logos.json'

export const dynamic = 'force-dynamic'

// ── Timeout fetch helper ──────────────────────
async function safeFetch(url: string, timeout = 10000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 JobUpdatePortal/1.0',
        'Accept': 'application/json',
      },
      next: { revalidate: 1800 }, // 30 min cache
    })
    clearTimeout(timer)
    if (!res.ok) return null
    return await res.json()
  } catch {
    clearTimeout(timer)
    return null
  }
}

// ── Timeout fetch with custom headers ─────────
async function safeFetchWithHeaders(url: string, headers: Record<string, string>, timeout = 10000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 JobUpdatePortal/1.0',
        'Accept': 'application/json',
        ...headers,
      },
      next: { revalidate: 1800 },
    })
    clearTimeout(timer)
    if (!res.ok) return null
    return await res.json()
  } catch {
    clearTimeout(timer)
    return null
  }
}

// ── Standard job interface ────────────────────
interface Job {
  id: string
  title: string
  company: string
  location: string
  jobType: string
  category: string
  salary?: string
  postedDate: string
  deadline?: string
  applyLink: string
  isNew: boolean
  source: string
  description?: string
  logo?: string
}

function isJobStrictlyRelated(title: string, category: string): boolean {
  if (!title) return false
  const t = title.toLowerCase()
  
  switch(category) {
    case 'civil':
      return ['civil', 'mech', 'autocad', 'design', 'construct', 'structur', 'manufactur', 'site', 'cad', 'hvac', 'piping', 'draft', 'production', 'quality', 'maintenance', 'auto'].some(k => t.includes(k))
    case 'core':
      return ['embed', 'vlsi', 'ece', 'eee', 'hardware', 'electronic', 'firmware', 'soc', 'circuit', 'fpga', 'semiconductor', 'electrical', 'instrumentation'].some(k => t.includes(k))
    case 'banking':
      return ['bank', 'financ', 'analyst', 'account', 'manager', 'relationship', 'loan', 'credit', 'wealth', 'audit', 'tax', 'insurance', 'clerk', 'po', 'investment', 'equity'].some(k => t.includes(k))
    case 'internships':
    case 'internship':
      return ['intern', 'trainee', 'fresher', 'apprentice'].some(k => t.includes(k))
    case 'cat-mba':
    case 'catmba':
      return ['mba', 'business', 'market', 'sales', 'manage', 'consult', 'hr', 'operation', 'strategy', 'executive', 'product', 'analyst', 'bde', 'bda'].some(k => t.includes(k))
    case 'mnc':
      // Prevent civil/core jobs from mixing into MNC unless they are software/IT/AI
      return ['software', 'develop', 'engineer', 'data', 'cloud', 'it ', 'tech', 'program', 'stack', 'backend', 'frontend', 'react', 'node', 'java', 'python', 'aws', 'azure', 'devops', 'qa', 'test', 'security', 'machine learning', 'artificial intelligence', 'ai', 'ml', 'nlp', 'computer vision', 'deep learning', 'information technology'].some(k => t.includes(k) || t.match(/\b(ai|ml|it)\b/i))
    default:
      return true
  }
}

function getCompanyLogo(company: string): string | undefined {
  if (!company) return undefined;
  const name = company.toLowerCase().trim();
  
  // 1. Try to find a match in the user's custom company-logos.json
  const customMatch = companyLogos.find(c => name.includes(c.company.toLowerCase()));
  if (customMatch && customMatch.logo) {
    return customMatch.logo;
  }

  // 2. Known exact domains for common MNCs & Banks to guarantee Clearbit finds them
  const knownDomains: Record<string, string> = {
    'google': 'google.com', 'microsoft': 'microsoft.com', 'amazon': 'amazon.com', 'meta': 'meta.com',
    'apple': 'apple.com', 'oracle': 'oracle.com', 'ibm': 'ibm.com', 'accenture': 'accenture.com',
    'tcs': 'tcs.com', 'tata consultancy': 'tcs.com', 'infosys': 'infosys.com', 'wipro': 'wipro.com',
    'cognizant': 'cognizant.com', 'hcl': 'hcltech.com', 'capgemini': 'capgemini.com', 'deloitte': 'deloitte.com',
    'pwc': 'pwc.com', 'kpmg': 'kpmg.com', 'ernst': 'ey.com', 'goldman': 'goldmansachs.com',
    'jpmorgan': 'jpmorganchase.com', 'morgan stanley': 'morganstanley.com', 'citibank': 'citi.com',
    'hsbc': 'hsbc.com', 'samsung': 'samsung.com', 'lg': 'lg.com', 'sony': 'sony.com', 'siemens': 'siemens.com',
    'bosch': 'bosch.com', 'salesforce': 'salesforce.com', 'sap': 'sap.com', 'adobe': 'adobe.com',
    'cisco': 'cisco.com', 'intel': 'intel.com', 'qualcomm': 'qualcomm.com', 'swiggy': 'swiggy.com',
    'zomato': 'zomato.com', 'flipkart': 'flipkart.com', 'myntra': 'myntra.com', 'paytm': 'paytm.com',
    'phonepe': 'phonepe.com', 'cred': 'cred.club', 'razorpay': 'razorpay.com', 'meesho': 'meesho.com',
    'ola': 'olaelectric.com', 'uber': 'uber.com', 'tata motors': 'tatamotors.com', 'mahindra': 'mahindra.com',
    'reliance': 'ril.com', 'jio': 'jio.com', 'airtel': 'airtel.in', 'vodafone': 'myvi.in',
    'letsintern': 'letsintern.com', 'internshala': 'internshala.com', 'unstop': 'unstop.com',
    'henry schein': 'henryschein.com',
    'iim ahmedabad': 'iima.ac.in', 'iim bangalore': 'iimb.ac.in', 'iim calcutta': 'iimcal.ac.in',
    'sbi': 'sbi.co.in', 'state bank of india': 'sbi.co.in', 'hdfc': 'hdfcbank.com', 'icici': 'icicibank.com',
    'axis bank': 'axisbank.com', 'kotak': 'kotak.com',
    'upsc': 'upsc.gov.in', 'ssc': 'ssc.nic.in', 'rrb': 'indianrailways.gov.in', 'ibps': 'ibps.in',
    'isro': 'isro.gov.in', 'drdo': 'drdo.gov.in', 'rbi': 'rbi.org.in', 'ongc': 'ongcindia.com',
    'lic': 'licindia.in', 'barc': 'barc.gov.in', 'dmrc': 'delhimetrorail.com', 'iaf': 'indianairforce.nic.in',
    'nabard': 'nabard.org'
  };

  for (const [key, domain] of Object.entries(knownDomains)) {
    if (name.includes(key)) return `https://logo.clearbit.com/${domain}`;
  }

  // 3. Fallback to guessing the domain based on the first word of the company name
  const cleanName = name.replace(/[^a-z0-9]/g, '');
  if (cleanName.length > 2) {
    return `https://logo.clearbit.com/${cleanName}.com`;
  }
  
  return undefined;
}

function makeJob(
  id: string,
  title: string,
  company: string,
  location: string,
  jobType: string,
  category: string,
  applyLink: string,
  source: string,
  salary?: string,
  postedDate?: string,
  description?: string,
): Job {
  if (!applyLink || !applyLink.startsWith('http')) return null as any
  if (!isJobStrictlyRelated(title, category)) return null as any
  
  const posted = postedDate || new Date().toISOString()
  const daysDiff = Math.floor(
    (Date.now() - new Date(posted).getTime()) / 86400000
  )
  return {
    id: id || `${source}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
    title: title?.trim() || '',
    company: company?.trim() || '',
    location: location?.trim() || 'India',
    jobType,
    category,
    salary,
    postedDate: posted,
    applyLink: applyLink.trim(),
    isNew: daysDiff <= 1,
    source,
    description,
    logo: getCompanyLogo(company),
  }
}

// ── India location filter ─────────────────────
const INDIA_KEYWORDS = [
  'india', 'indian', 'mumbai', 'delhi', 'bangalore', 
  'bengaluru', 'hyderabad', 'chennai', 'pune', 'kolkata',
  'noida', 'gurugram', 'gurgaon', 'ahmedabad', 'jaipur',
  'remote', 'work from home', 'wfh', 'pan india',
  'anywhere', 'global', 'worldwide', 'asia',
]

// Only exclude clearly non-India European cities
const EXCLUDE_KEYWORDS = [
  'hamburg', 'berlin', 'munich', 'frankfurt', 'cologne',
  'paris', 'amsterdam', 'london', 'madrid', 'rome',
  'toronto', 'vancouver', 'sydney', 'melbourne',
  'new york', 'san francisco', 'chicago', 'texas',
  'germany', 'france', 'netherlands', 'spain',
  'italy', 'austria', 'switzerland', 'belgium',
  'poland', 'ukraine', 'czech', 'hungary',
]

function isIndiaRelevant(location: string, title: string): boolean {
  if (!location && !title) return false
  const loc = (location || '').toLowerCase()
  const tit = (title || '').toLowerCase()
  const combined = `${loc} ${tit}`

  // Exclude European locations
  if (EXCLUDE_KEYWORDS.some(kw => loc.includes(kw))) return false

  // Include if India-related
  if (INDIA_KEYWORDS.some(kw => combined.includes(kw))) return true

  // If location is empty or generic, include it
  if (!location || location.toLowerCase() === 'remote') return true

  return false
}

function dedupe(jobs: Job[]): Job[] {
  const seenIds = new Set<string>()
  const seenKeys = new Set<string>()
  return jobs.filter(j => {
    if (!j || !j.id || !j.applyLink || !j.title || !j.company) return false
    const key = `${j.title.toLowerCase().slice(0,30)}-${j.company.toLowerCase().slice(0,20)}`
    if (seenIds.has(j.id) || seenKeys.has(key)) return false
    seenIds.add(j.id)
    seenKeys.add(key)
    return true
  })
}

// ════════════════════════════════════════════
// INDIA-SPECIFIC JOB SOURCES
// ════════════════════════════════════════════

// SOURCE 1: Remotive — India remote jobs
async function fetchRemotiveIndia(
  search: string, 
  category: string
): Promise<Job[]> {
  const jobs: Job[] = []
  const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(search)}&limit=60`
  const data = await safeFetch(url)
  if (!data?.jobs) return []
  
  data.jobs.forEach((j: any) => {
    const loc = j.candidate_required_location || ''
    // Only include if India/worldwide/remote
    if (
      loc.toLowerCase().includes('india') ||
      loc.toLowerCase().includes('worldwide') ||
      loc.toLowerCase().includes('anywhere') ||
      loc === '' ||
      loc.toLowerCase().includes('remote') ||
      loc.toLowerCase().includes('asia')
    ) {
      const job = makeJob(
        `remotive-${j.id}`,
        j.title,
        j.company_name,
        loc || 'Remote, India',
        j.job_type || 'full-time',
        category,
        j.url,
        'Remotive',
        j.salary,
        j.publication_date,
        j.description?.slice(0, 200),
      )
      if (job) jobs.push(job)
    }
  })
  return jobs
}

// SOURCE 2: Jobicy — India jobs
async function fetchJobicyIndia(
  tag: string,
  category: string
): Promise<Job[]> {
  const jobs: Job[] = []
  // Jobicy supports geo filter
  const urls = [
    `https://jobicy.com/api/v2/remote-jobs?count=40&tag=${tag}&geo=india`,
    `https://jobicy.com/api/v2/remote-jobs?count=40&tag=${tag}`,
  ]

  for (const url of urls) {
    const data = await safeFetch(url)
    if (!data?.jobs) continue
    data.jobs.forEach((j: any) => {
      const loc = (j.jobGeo || '').toLowerCase()
      if (
        loc.includes('india') || 
        loc.includes('remote') || 
        loc.includes('anywhere') ||
        loc === '' ||
        !loc
      ) {
        const job = makeJob(
          `jobicy-${tag}-${j.id}`,
          j.jobTitle,
          j.companyName,
          j.jobGeo || 'Remote, India',
          j.jobType || 'full-time',
          category,
          j.url,
          'Jobicy',
          j.annualSalaryMin
            ? `$${j.annualSalaryMin}–$${j.annualSalaryMax}/yr`
            : undefined,
          j.pubDate,
        )
        if (job) jobs.push(job)
      }
    })
  }
  return jobs
}

// SOURCE 3: The Muse — India offices
async function fetchMuseIndia(
  category: string,
  level?: string
): Promise<Job[]> {
  const jobs: Job[] = []
  const levelParam = level ? `&level=${encodeURIComponent(level)}` : ''
  const url = `https://www.themuse.com/api/public/jobs?location=India${levelParam}&page=1&descending=true`
  const data = await safeFetch(url)
  if (!data?.results) return []

  data.results.slice(0, 40).forEach((j: any) => {
    const loc = j.locations?.map((l: any) => l.name).join(', ') || 'India'
    const job = makeJob(
      `muse-${j.id}`,
      j.name,
      j.company?.name || 'Company',
      loc,
      'full-time',
      category,
      j.refs?.landing_page || '',
      'The Muse',
      undefined,
      j.publication_date,
    )
    if (job) jobs.push(job)
  })
  return jobs
}

// SOURCE 4: Adzuna India API (FREE — no key needed for basic)
async function fetchAdzunaIndia(
  keywords: string,
  category: string
): Promise<Job[]> {
  const jobs: Job[] = []
  // Adzuna India endpoint
  const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?` +
    `app_id=&app_key=&` +
    `results_per_page=20&` +
    `what=${encodeURIComponent(keywords)}&` +
    `content-type=application/json`
  
  // Note: Use without API key first, falls back gracefully
  const data = await safeFetch(url)
  if (!data?.results) return []

  data.results.forEach((j: any) => {
    const job = makeJob(
      `adzuna-${j.id}`,
      j.title,
      j.company?.display_name || 'Company',
      j.location?.display_name || 'India',
      j.contract_time || 'full-time',
      category,
      j.redirect_url,
      'Adzuna',
      j.salary_min
        ? `₹${Math.round(j.salary_min/100000)}–${Math.round(j.salary_max/100000)} LPA`
        : undefined,
      j.created,
      j.description?.slice(0, 200),
    )
    if (job) jobs.push(job)
  })
  return jobs
}

// SOURCE 5: LinkedIn Jobs RSS (public, no auth)
async function fetchLinkedInRSS(
  keywords: string,
  category: string
): Promise<Job[]> {
  const jobs: Job[] = []
  // LinkedIn public job search RSS
  const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&location=India&f_TPR=r86400&format=json`
  // This won't work directly but we use their public feed
  // Instead use a working alternative:
  return jobs
}

// SOURCE 7: JSearch API (RapidAPI Free Tier — 500 req/month)
async function fetchJSearch(query: string, category: string): Promise<Job[]> {
  const apiKey = process.env.RAPIDAPI_KEY
  if (!apiKey) return []

  const jobs: Job[] = []
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query + ' in India')}&page=1&num_pages=1&country=in&date_posted=today`

  const data = await safeFetchWithHeaders(url, {
    'x-rapidapi-key': apiKey,
    'x-rapidapi-host': 'jsearch.p.rapidapi.com',
  })

  if (!data?.data) return []

  data.data.forEach((j: any) => {
    const location = [j.job_city, j.job_state, j.job_country === 'IN' ? 'India' : j.job_country]
      .filter(Boolean).join(', ') || 'India'

    const empType = (j.job_employment_type || 'FULLTIME').toLowerCase()
    const jobType = empType.includes('intern') ? 'internship' :
                    empType.includes('contract') ? 'contract' :
                    empType.includes('part') ? 'part-time' : 'full-time'

    let salary: string | undefined
    if (j.job_min_salary && j.job_max_salary) {
      salary = `₹${Math.round(j.job_min_salary / 100000)}–${Math.round(j.job_max_salary / 100000)} LPA`
    }

    const job = makeJob(
      `jsearch-${j.job_id || Date.now() + Math.random()}`,
      j.job_title,
      j.employer_name || 'Company',
      location,
      jobType,
      category,
      j.job_apply_link || '',
      'JSearch',
      salary,
      j.job_posted_at_datetime_utc,
      j.job_description?.slice(0, 200),
    )
    if (job) jobs.push(job)
  })

  return jobs
}

// SOURCE 8: RemoteOK (Free, No Auth Needed)
async function fetchRemoteOK(tag: string, category: string): Promise<Job[]> {
  const jobs: Job[] = []
  const url = `https://remoteok.com/api?tag=${encodeURIComponent(tag)}`

  const data = await safeFetch(url, 8000)
  if (!Array.isArray(data)) return []

  // First element is legal notice, skip it
  data.slice(1, 40).forEach((j: any) => {
    if (!j.id || !j.url) return
    const loc = (j.location || '').toLowerCase()
    // Skip clearly non-India locations
    if (loc && EXCLUDE_KEYWORDS.some(kw => loc.includes(kw))) return

    const job = makeJob(
      `remoteok-${j.id}`,
      j.position,
      j.company || 'Company',
      j.location || 'Remote',
      'full-time',
      category,
      j.url,
      'RemoteOK',
      j.salary_min ? `$${j.salary_min}–$${j.salary_max}/yr` : undefined,
      j.date,
      j.description?.replace(/<[^>]+>/g, '').slice(0, 200),
    )
    if (job) jobs.push(job)
  })

  return jobs
}

// ── Helper: Fetch from all new live sources ───
async function fetchNewSources(query: string, category: string, remoteOKTag?: string): Promise<Job[]> {
  const promises: Promise<Job[]>[] = [
    fetchJSearch(query, category),
  ]
  if (remoteOKTag) {
    promises.push(fetchRemoteOK(remoteOKTag, category))
  }
  const results = await Promise.allSettled(promises)
  return results.flatMap(r => r.status === 'fulfilled' ? r.value : [])
}

// SOURCE 6: GOVT JOBS — India specific sources
async function fetchIndiaGovtJobs(): Promise<Job[]> {
  const permanentGovtJobs: Job[] = [
    makeJob(
      'upsc-cse-2026',
      'UPSC Civil Services Examination 2026 (IAS/IPS)',
      'Union Public Service Commission (UPSC)',
      'New Delhi / Pan India',
      'full-time',
      'government',
      'https://upsc.gov.in/examinations/active-examinations',
      'UPSC Official',
      '₹56,100–₹2,50,000/month',
      new Date().toISOString(),
      'Recruitment of Indian Administrative Service (IAS), Indian Police Service (IPS), and other premium civil services.'
    ),
    makeJob(
      'ssc-cgl-2026',
      'SSC CGL 2026 — Combined Graduate Level Recruitment',
      'Staff Selection Commission (SSC)',
      'Pan India',
      'full-time',
      'government',
      'https://ssc.gov.in/Portal/Notices',
      'SSC Official',
      '₹25,500–₹1,51,100/month',
      new Date().toISOString(),
      'Recruitment for Group B & C posts across various ministries, departments, and organizations of Government of India.'
    ),
    makeJob(
      'ibps-po-2026',
      'IBPS PO CRP PO/MT-XIV — Probationary Officer',
      'Institute of Banking Personnel Selection (IBPS)',
      'Pan India',
      'full-time',
      'government',
      'https://www.ibps.in/crp-po-mt-xiv/',
      'IBPS Official',
      '₹36,000–₹63,840/month',
      new Date().toISOString(),
      'National-level examination for recruitment of Probationary Officers (PO) and Management Trainees in Public Sector Banks.'
    ),
    makeJob(
      'rrb-ntpc-2026',
      'RRB NTPC 2026 — Railway Non-Technical Popular Categories',
      'Railway Recruitment Board (RRB)',
      'Pan India',
      'full-time',
      'government',
      'https://indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,1,304,366,554',
      'RRB Official',
      '₹19,900–₹35,400/month',
      new Date().toISOString(),
      'Recruitment for prestigious positions like Station Master, Goods Guard, Junior Clerk, and Commercial Apprentice in Indian Railways.'
    ),
    makeJob(
      'isro-scientist-2026',
      'ISRO Scientist / Engineer (Electronics/Mechanical/CS)',
      'Indian Space Research Organisation (ISRO)',
      'Bangalore / Sriharikota / Ahmedabad',
      'full-time',
      'government',
      'https://www.isro.gov.in/Careers.html',
      'ISRO Official',
      '₹56,100–₹1,77,500/month',
      new Date().toISOString(),
      'Opportunity for young engineering graduates to join space missions as Scientist/Engineer SC.'
    ),
    makeJob(
      'drdo-scientist-b-2026',
      'DRDO Scientist \'B\' Recruitment (RAC)',
      'Defence Research and Development Organisation (DRDO)',
      'New Delhi / Pune / Bangalore',
      'full-time',
      'government',
      'https://rac.gov.in/index.php?lang=en&id=0',
      'DRDO RAC Portal',
      '₹56,100–₹1,77,500/month',
      new Date().toISOString(),
      'Direct recruitment for Scientists in Defence Research & Development Organisation (DRDO) and DST.'
    ),
    makeJob(
      'rbi-grade-b-2026',
      'RBI Grade B Officer Recruitment 2026',
      'Reserve Bank of India (RBI)',
      'Pan India',
      'full-time',
      'government',
      'https://opportunities.rbi.org.in/',
      'RBI Official',
      '₹55,200–₹1,16,684/month',
      new Date().toISOString(),
      'Premium officer level position in RBI, managing macroeconomic policymaking and financial regulation.'
    ),
    makeJob(
      'sbi-po-2026',
      'SBI PO 2026 — Probationary Officer Recruitment',
      'State Bank of India (SBI)',
      'Pan India',
      'full-time',
      'government',
      'https://bank.sbi/web/careers/current-openings',
      'SBI Careers',
      '₹41,960–₹63,840/month',
      new Date().toISOString(),
      'Recruitment of Probationary Officers in State Bank of India, managing retail and corporate banking systems.'
    ),
    makeJob(
      'ongc-gt-2026',
      'ONGC Graduate Trainee through GATE 2026',
      'Oil and Natural Gas Corporation (ONGC)',
      'Dehradun / Mumbai / Kakinada',
      'full-time',
      'government',
      'https://ongcindia.com/web/ongc/careers',
      'ONGC Official',
      '₹60,000–₹1,80,000/month',
      new Date().toISOString(),
      'Engineering and geosciences professionals recruitment based on GATE scores in India\'s premier energy Maharatna.'
    ),
    makeJob(
      'lic-aao-2026',
      'LIC AAO 2026 — Assistant Administrative Officer',
      'Life Insurance Corporation of India (LIC)',
      'Pan India',
      'full-time',
      'government',
      'https://licindia.in/Bottom-Links/Careers',
      'LIC Official',
      '₹53,600–₹1,02,090/month',
      new Date().toISOString(),
      'Recruitment of Assistant Administrative Officer (Generalist) across central, zonal and branch offices.'
    ),
    makeJob(
      'barc-so-2026',
      'BARC Scientific Officer Recruitment (OCES/DGFS)',
      'Bhabha Atomic Research Centre (BARC)',
      'Mumbai / Kalpakkam',
      'full-time',
      'government',
      'https://www.barconlineexam.com/',
      'BARC Exam Portal',
      '₹56,100–₹1,77,500/month',
      new Date().toISOString(),
      'Recruitment of Scientific Officers for the Department of Atomic Energy (DAE) engineering/science graduates.'
    ),
    makeJob(
      'dmrc-engineer-2026',
      'DMRC Section Engineer & Station Controller',
      'Delhi Metro Rail Corporation (DMRC)',
      'New Delhi / NCR',
      'full-time',
      'government',
      'https://www.delhimetrorail.com/career',
      'DMRC Careers',
      '₹40,000–₹1,25,000/month',
      new Date().toISOString(),
      'Recruitment for operations and maintenance roles across Delhi Metro sections.'
    ),
    makeJob(
      'afcat-iaf-2026',
      'IAF AFCAT 01/2026 — Air Force Common Admission Test',
      'Indian Air Force (IAF)',
      'Pan India',
      'full-time',
      'government',
      'https://afcat.cdac.in/afcatreg/',
      'IAF Official',
      '₹56,100–₹1,10,700/month',
      new Date().toISOString(),
      'Commissioning of officers in flying and ground duty (technical/non-technical) branches.'
    ),
    makeJob(
      'nabard-grade-a-2026',
      'NABARD Grade A Officer (Assistant Manager)',
      'National Bank for Agriculture and Rural Development',
      'Pan India',
      'full-time',
      'government',
      'https://www.nabard.org/careers.aspx?cid=26&id=24',
      'NABARD Official',
      '₹44,500–₹89,150/month',
      new Date().toISOString(),
      'Assistant Manager recruitment in rural development banking division.'
    )
  ].filter(Boolean) as Job[]

  return permanentGovtJobs
}

// ── Category Fetchers ───────────────────────────
async function fetchInternships(): Promise<Job[]> {
  const [r1, r2, j1, j2, m1] = await Promise.allSettled([
    fetchRemotiveIndia('intern', 'internship'),
    fetchRemotiveIndia('internship remote', 'internship'),
    fetchJobicyIndia('intern', 'internship'),
    fetchJobicyIndia('internship', 'internship'),
    fetchMuseIndia('internship', 'Internship'),
  ])

  const all = [
    ...(r1.status === 'fulfilled' ? r1.value : []),
    ...(r2.status === 'fulfilled' ? r2.value : []),
    ...(j1.status === 'fulfilled' ? j1.value : []),
    ...(j2.status === 'fulfilled' ? j2.value : []),
    ...(m1.status === 'fulfilled' ? m1.value : []),
  ].map(j => ({
    ...j,
    category: 'internship',
    location: j.location || 'India',
  }))

  // Add reliable Indian internship portals
  const fallback: Job[] = [
    makeJob('internshala-2026', 'Software Development Intern',
      'Various Companies via Internshala', 'Remote / Pan India',
      'internship', 'internship',
      'https://internshala.com/internships/computer-science-internship/',
      'Internshala', '₹5,000–₹25,000/month',
      new Date().toISOString(),
      'Multiple software internship opportunities'),
    makeJob('letsintern-2026', 'Marketing & Business Intern',
      'Various Companies via LetsIntern', 'Remote / Pan India',
      'internship', 'internship',
      'https://www.letsintern.com/internships/',
      'LetsIntern', '₹3,000–₹15,000/month',
      new Date().toISOString(),
      'Marketing, business and operations internships'),
    makeJob('unstop-intern-2026', 'Tech & Non-Tech Internships',
      'Various via Unstop', 'Remote / Pan India',
      'internship', 'internship',
      'https://unstop.com/internships',
      'Unstop', 'Stipend Varies',
      new Date().toISOString(),
      'Tech, design, marketing internship opportunities'),
  ].filter(Boolean) as Job[]

  const freshJobs = await fetchNewSources('internship', 'internship', 'intern')
  return dedupe([...all, ...fallback, ...freshJobs]).slice(0, 60)
}

async function fetchMNCJobs(): Promise<Job[]> {
  const MNC_INDIA = [
    'google', 'microsoft', 'amazon', 'meta', 'apple',
    'oracle', 'ibm', 'accenture', 'tcs', 'infosys',
    'wipro', 'cognizant', 'hcl', 'capgemini', 'deloitte',
    'pwc', 'kpmg', 'ernst', 'goldman', 'jpmorgan',
    'morgan stanley', 'citibank', 'hsbc', 'samsung',
    'lg', 'sony', 'siemens', 'bosch', 'salesforce',
    'sap', 'adobe', 'cisco', 'intel', 'qualcomm',
  ]

  const [r1, r2, r3, r4, r5, j1, m1] = await Promise.allSettled([
    fetchRemotiveIndia('software engineer', 'mnc'),
    fetchRemotiveIndia('data analyst', 'mnc'),
    fetchRemotiveIndia('machine learning', 'mnc'),
    fetchRemotiveIndia('artificial intelligence', 'mnc'),
    fetchRemotiveIndia('information technology', 'mnc'),
    fetchJobicyIndia('software', 'mnc'),
    fetchMuseIndia('mnc'),
  ])

  const apiJobs = [
    ...(r1.status === 'fulfilled' ? r1.value : []),
    ...(r2.status === 'fulfilled' ? r2.value : []),
    ...(r3.status === 'fulfilled' ? r3.value : []),
    ...(r4.status === 'fulfilled' ? r4.value : []),
    ...(r5.status === 'fulfilled' ? r5.value : []),
    ...(j1.status === 'fulfilled' ? j1.value : []),
    ...(m1.status === 'fulfilled' ? m1.value : []),
  ].filter(j => {
    const co = j.company.toLowerCase()
    return MNC_INDIA.some(mnc => co.includes(mnc)) ||
      isIndiaRelevant(j.location, j.title)
  }).map(j => ({ ...j, category: 'mnc' }))

  // Reliable MNC India job portal links
  const fallback: Job[] = [
    makeJob('tcs-careers-2026', 'TCS — Multiple Roles (Freshers & Experienced)',
      'Tata Consultancy Services', 'Pan India',
      'full-time', 'mnc',
      'https://www.tcs.com/careers',
      'TCS Careers', '₹3.5–35 LPA',
      new Date().toISOString(),
      'Technology, consulting and business roles at TCS'),
    makeJob('infosys-careers-2026', 'Infosys — Technology & Consulting Roles',
      'Infosys Limited', 'Bangalore / Pan India',
      'full-time', 'mnc',
      'https://www.infosys.com/careers/apply.html',
      'Infosys Careers', '₹3.6–30 LPA',
      new Date().toISOString(),
      'Engineering, consulting and digital roles'),
    makeJob('wipro-careers-2026', 'Wipro — IT & Business Roles',
      'Wipro Limited', 'Hyderabad / Pan India',
      'full-time', 'mnc',
      'https://careers.wipro.com/',
      'Wipro Careers', '₹3.5–25 LPA',
      new Date().toISOString(),
      'Technology and business process roles'),
    makeJob('accenture-india-2026', 'Accenture India — Technology Analyst',
      'Accenture', 'Bangalore / Mumbai / Delhi',
      'full-time', 'mnc',
      'https://www.accenture.com/in-en/careers',
      'Accenture Careers', '₹4–45 LPA',
      new Date().toISOString(),
      'Technology, consulting and operations roles'),
    makeJob('cognizant-india-2026', 'Cognizant — Multiple Technology Roles',
      'Cognizant Technology Solutions', 'Chennai / Pune / Hyderabad',
      'full-time', 'mnc',
      'https://careers.cognizant.com/global/en',
      'Cognizant Careers', '₹3.5–20 LPA',
      new Date().toISOString(),
      'Digital, technology and consulting opportunities'),
    makeJob('hcl-india-2026', 'HCL Technologies — IT Roles',
      'HCL Technologies', 'Noida / Pan India',
      'full-time', 'mnc',
      'https://www.hcltech.com/careers',
      'HCL Careers', '₹3–28 LPA',
      new Date().toISOString(),
      'Technology and engineering roles across India'),
    makeJob('google-india-2026', 'Google India — Software & Business Roles',
      'Google India', 'Bangalore / Hyderabad / Mumbai',
      'full-time', 'mnc',
      'https://careers.google.com/locations/india/',
      'Google Careers', '₹25–80 LPA',
      new Date().toISOString(),
      'Engineering, product and business roles at Google India'),
    makeJob('microsoft-india-2026', 'Microsoft India — Engineering Roles',
      'Microsoft India', 'Hyderabad / Bangalore / Noida',
      'full-time', 'mnc',
      'https://careers.microsoft.com/us/en/search-results?lc=India',
      'Microsoft Careers', '₹20–70 LPA',
      new Date().toISOString(),
      'Software engineering and product management roles'),
  ].filter(Boolean) as Job[]

  return dedupe([...apiJobs, ...fallback]).slice(0, 60)
}

async function fetchBankingJobs(): Promise<Job[]> {
  const [r1, r2, j1] = await Promise.allSettled([
    fetchRemotiveIndia('fintech', 'banking'),
    fetchRemotiveIndia('banking finance', 'banking'),
    fetchJobicyIndia('finance', 'banking'),
  ])

  const apiJobs = [
    ...(r1.status === 'fulfilled' ? r1.value : []),
    ...(r2.status === 'fulfilled' ? r2.value : []),
    ...(j1.status === 'fulfilled' ? j1.value : []),
  ].map(j => ({ ...j, category: 'banking' }))

  const fallback: Job[] = [
    makeJob('sbi-po-2026', 'SBI PO 2026 — Probationary Officer',
      'State Bank of India', 'Pan India',
      'full-time', 'banking',
      'https://bank.sbi/web/careers/current-openings',
      'SBI Official', '₹27,620–₹63,840/month',
      new Date().toISOString(),
      'SBI Probationary Officer recruitment 2026'),
    makeJob('ibps-clerk-2026', 'IBPS Clerk 2026 — Bank Clerk Recruitment',
      'IBPS', 'Pan India', 'full-time', 'banking',
      'https://www.ibps.in/crp-clerks-xiv/',
      'IBPS Official', '₹11,765–₹31,540/month',
      new Date().toISOString(),
      'IBPS CRP Clerk recruitment for Public Sector Banks'),
    makeJob('rbi-grade-b-2026', 'RBI Grade B Officer 2026',
      'Reserve Bank of India', 'Pan India',
      'full-time', 'banking',
      'https://opportunities.rbi.org.in/',
      'RBI Official', '₹35,150–₹62,400/month',
      new Date().toISOString(),
      'RBI Grade B Officer — General, DEPR, DSIM'),
    makeJob('hdfc-bank-2026', 'HDFC Bank — Multiple Banking Roles',
      'HDFC Bank', 'Pan India', 'full-time', 'banking',
      'https://www.hdfcbank.com/personal/about-us/careers',
      'HDFC Bank Careers', '₹3–15 LPA',
      new Date().toISOString(),
      'Relationship manager, analyst and operations roles'),
    makeJob('icici-bank-2026', 'ICICI Bank — Retail & Corporate Banking',
      'ICICI Bank', 'Pan India', 'full-time', 'banking',
      'https://www.icicicareers.com/',
      'ICICI Careers', '₹3.5–18 LPA',
      new Date().toISOString(),
      'Banking, finance and technology roles at ICICI'),
    makeJob('axis-bank-2026', 'Axis Bank — Relationship & Operations Roles',
      'Axis Bank', 'Pan India', 'full-time', 'banking',
      'https://www.axisbank.com/about-us/careers',
      'Axis Bank Careers', '₹3–14 LPA',
      new Date().toISOString(),
      'Sales, operations and technology roles'),
    makeJob('kotak-bank-2026', 'Kotak Mahindra Bank — Banking Roles',
      'Kotak Mahindra Bank', 'Mumbai / Pan India',
      'full-time', 'banking',
      'https://www.kotak.com/en/careers.html',
      'Kotak Careers', '₹3.5–20 LPA',
      new Date().toISOString(),
      'Retail banking, wealth management and IT roles'),
    makeJob('fintech-india-2026', 'Fintech India — Various Roles',
      'Razorpay / Paytm / PhonePe / CRED',
      'Bangalore / Delhi / Hyderabad',
      'full-time', 'banking',
      'https://razorpay.com/jobs/',
      'Fintech Careers', '₹6–40 LPA',
      new Date().toISOString(),
      'Product, engineering and operations roles at leading fintechs'),
  ].filter(Boolean) as Job[]

  return dedupe([...apiJobs, ...fallback]).slice(0, 50)
}

async function fetchGovernmentJobs(): Promise<Job[]> {
  const [hardcoded, fresh] = await Promise.allSettled([
    fetchIndiaGovtJobs(),
    fetchJSearch('government jobs sarkari naukri recruitment', 'government'),
  ])
  return dedupe([
    ...(hardcoded.status === 'fulfilled' ? hardcoded.value : []),
    ...(fresh.status === 'fulfilled' ? fresh.value : []),
  ]).slice(0, 50)
}

async function fetchStartupJobs(): Promise<Job[]> {
  const [r1, r2, j1, j2] = await Promise.allSettled([
    fetchRemotiveIndia('startup remote', 'startup'),
    fetchRemotiveIndia('early stage company', 'startup'),
    fetchJobicyIndia('startup', 'startup'),
    fetchJobicyIndia('tech', 'startup'),
  ])

  const apiJobs = [
    ...(r1.status === 'fulfilled' ? r1.value : []),
    ...(r2.status === 'fulfilled' ? r2.value : []),
    ...(j1.status === 'fulfilled' ? j1.value : []),
    ...(j2.status === 'fulfilled' ? j2.value : []),
  ].map(j => ({ ...j, category: 'startup' }))

  const fallback: Job[] = [
    makeJob('zepto-2026', 'Zepto — Product & Engineering Roles',
      'Zepto', 'Mumbai / Remote', 'full-time', 'startup',
      'https://www.zepto.team/careers',
      'Zepto Careers', '₹8–50 LPA',
      new Date().toISOString(),
      'Fast-growing quick commerce startup hiring engineers, PMs'),
    makeJob('groww-2026', 'Groww — Fintech Startup Roles',
      'Groww', 'Bangalore / Remote', 'full-time', 'startup',
      'https://groww.in/p/careers',
      'Groww Careers', '₹10–60 LPA',
      new Date().toISOString(),
      'Technology, product and finance roles at India leading fintech'),
    makeJob('meesho-2026', 'Meesho — Tech & Business Roles',
      'Meesho', 'Bangalore / Remote', 'full-time', 'startup',
      'https://meesho.io/careers',
      'Meesho Careers', '₹8–45 LPA',
      new Date().toISOString(),
      'Engineering, product and business roles'),
    makeJob('cred-2026', 'CRED — Product & Engineering',
      'CRED', 'Bangalore / Remote', 'full-time', 'startup',
      'https://cred.club/careers',
      'CRED Careers', '₹15–80 LPA',
      new Date().toISOString(),
      'Product, design and engineering at premium fintech'),
    makeJob('razorpay-2026', 'Razorpay — Engineering & Business',
      'Razorpay', 'Bangalore / Remote', 'full-time', 'startup',
      'https://razorpay.com/jobs/',
      'Razorpay Careers', '₹12–70 LPA',
      new Date().toISOString(),
      'Software engineering, product and go-to-market roles'),
    makeJob('swiggy-2026', 'Swiggy — Tech & Operations',
      'Swiggy', 'Bangalore / Pan India', 'full-time', 'startup',
      'https://careers.swiggy.com/',
      'Swiggy Careers', '₹8–50 LPA',
      new Date().toISOString(),
      'Engineering, supply chain and business roles'),
    makeJob('ola-2026', 'Ola — Engineering & Product',
      'Ola Cabs / Ola Electric', 'Bangalore / Remote',
      'full-time', 'startup',
      'https://www.olacabs.com/careers',
      'Ola Careers', '₹8–55 LPA',
      new Date().toISOString(),
      'Tech and business roles at Ola and Ola Electric'),
    makeJob('nykaa-2026', 'Nykaa — E-commerce & Tech',
      'Nykaa', 'Mumbai / Delhi / Remote', 'full-time', 'startup',
      'https://www.nykaa.com/careers',
      'Nykaa Careers', '₹5–35 LPA',
      new Date().toISOString(),
      'Technology, product and marketing roles'),
  ].filter(Boolean) as Job[]

  return dedupe([...apiJobs, ...fallback]).slice(0, 60)
}

async function fetchCATMBAJobs(): Promise<Job[]> {
  const [r1, r2, j1] = await Promise.allSettled([
    fetchRemotiveIndia('management trainee', 'cat-mba'),
    fetchRemotiveIndia('business analyst', 'cat-mba'),
    fetchJobicyIndia('management', 'cat-mba'),
  ])

  const apiJobs = [
    ...(r1.status === 'fulfilled' ? r1.value : []),
    ...(r2.status === 'fulfilled' ? r2.value : []),
    ...(j1.status === 'fulfilled' ? j1.value : []),
  ].map(j => ({ ...j, category: 'cat-mba' }))

  const fallback: Job[] = [
    makeJob('iima-2026', 'IIM Ahmedabad — PGP MBA Admissions 2026',
      'IIM Ahmedabad', 'Ahmedabad', 'full-time', 'cat-mba',
      'https://www.iima.ac.in/admissions/pgp/how-to-apply',
      'IIM Ahmedabad', 'CAT Score Required',
      new Date().toISOString(),
      'PGP MBA program admissions via CAT 2024'),
    makeJob('hul-mt-2026', 'HUL — Management Trainee Program 2026',
      'Hindustan Unilever Limited', 'Mumbai / Pan India',
      'full-time', 'cat-mba',
      'https://www.hul.co.in/planet-and-society/futures/careers/',
      'HUL Careers', '₹18–25 LPA',
      new Date().toISOString(),
      'Leadership management trainee program for MBA graduates'),
    makeJob('itc-mt-2026', 'ITC — Management Trainee 2026',
      'ITC Limited', 'Kolkata / Pan India', 'full-time', 'cat-mba',
      'https://www.itcportal.com/about-itc/careers/',
      'ITC Careers', '₹15–22 LPA',
      new Date().toISOString(),
      'MT program across FMCG, hotels and agri-business'),
    makeJob('mckinsey-india-2026', 'McKinsey & Company — Business Analyst India',
      'McKinsey & Company', 'Mumbai / Delhi / Bangalore',
      'full-time', 'cat-mba',
      'https://www.mckinsey.com/careers/search-jobs?locations=India',
      'McKinsey Careers', '₹25–50 LPA',
      new Date().toISOString(),
      'Business analyst and associate roles for MBA graduates'),
    makeJob('bcg-india-2026', 'BCG India — Consultant & Associate',
      'Boston Consulting Group', 'Mumbai / Delhi',
      'full-time', 'cat-mba',
      'https://careers.bcg.com/locations/india',
      'BCG Careers', '₹28–55 LPA',
      new Date().toISOString(),
      'Consulting roles for MBA and undergrad graduates'),
    makeJob('amazon-india-mba-2026', 'Amazon India — MBA Roles',
      'Amazon India', 'Bangalore / Hyderabad / Delhi',
      'full-time', 'cat-mba',
      'https://www.amazon.jobs/en/locations/india',
      'Amazon Careers', '₹20–60 LPA',
      new Date().toISOString(),
      'Product, operations and business roles for MBAs'),
  ].filter(Boolean) as Job[]

  const freshJobs = await fetchNewSources('MBA management trainee business analyst', 'cat-mba')
  return dedupe([...apiJobs, ...fallback, ...freshJobs]).slice(0, 60)
}

async function fetchCoreJobs(): Promise<Job[]> {
  const [r1, j1] = await Promise.allSettled([
    fetchRemotiveIndia('embedded systems', 'core'),
    fetchJobicyIndia('hardware', 'core'),
  ])

  const apiJobs = [
    ...(r1.status === 'fulfilled' ? r1.value : []),
    ...(j1.status === 'fulfilled' ? j1.value : []),
  ].map(j => ({ ...j, category: 'core' }))

  const fallback: Job[] = [
    makeJob('core-isro-2026', 'ISRO Scientist/Engineer 2026 (ECE/EEE)',
      'ISRO', 'Bangalore / Pan India', 'full-time', 'core',
      'https://www.isro.gov.in/Careers.html',
      'ISRO Careers', '₹56,100 - ₹1,77,500/month',
      new Date().toISOString(),
      'Scientist/Engineer SC positions for Electronics & Communication'),
    makeJob('core-intel-2026', 'Intel — VLSI Design Engineer',
      'Intel', 'Bangalore / Hyderabad', 'full-time', 'core',
      'https://jobs.intel.com/',
      'Intel Careers', '₹15–30 LPA',
      new Date().toISOString(),
      'Hardware engineering and VLSI design roles'),
    makeJob('core-ti-2026', 'Texas Instruments — Embedded Software Engineer',
      'Texas Instruments', 'Bangalore', 'full-time', 'core',
      'https://careers.ti.com/',
      'TI Careers', '₹12–25 LPA',
      new Date().toISOString(),
      'Embedded systems software and firmware development'),
    makeJob('core-bhel-2026', 'BHEL — Engineer Trainee (Electrical)',
      'Bharat Heavy Electricals Limited', 'Pan India', 'full-time', 'core',
      'https://careers.bhel.in/',
      'BHEL Careers', '₹50,000 - ₹1,60,000/month',
      new Date().toISOString(),
      'Engineer Trainee roles for EEE graduates through GATE'),
    makeJob('core-qualcomm-2026', 'Qualcomm — Hardware Engineer (SoC Design)',
      'Qualcomm', 'Hyderabad / Bangalore', 'full-time', 'core',
      'https://careers.qualcomm.com/',
      'Qualcomm Careers', '₹18–35 LPA',
      new Date().toISOString(),
      'SoC design, verification, and hardware engineering'),
  ].filter(Boolean) as Job[]

  const freshJobs = await fetchNewSources('embedded systems VLSI ECE EEE hardware electronics', 'core')
  return dedupe([...apiJobs, ...fallback, ...freshJobs]).slice(0, 60)
}

async function fetchCivilJobs(): Promise<Job[]> {
  const [r1, j1] = await Promise.allSettled([
    fetchRemotiveIndia('civil engineering mechanical autocad', 'civil'),
    fetchJobicyIndia('construction manufacturing mechanical', 'civil'),
  ])

  const apiJobs = [
    ...(r1.status === 'fulfilled' ? r1.value : []),
    ...(j1.status === 'fulfilled' ? j1.value : []),
  ].map(j => ({ ...j, category: 'civil' }))

  const fallback: Job[] = [
    makeJob('civil-lnt-2026', 'L&T — Site Engineer (Civil & Mechanical)',
      'Larsen & Toubro', 'Mumbai / Pune', 'full-time', 'civil',
      'https://www.lntecc.com/careers/',
      'L&T Careers', '₹4–8 LPA',
      new Date().toISOString(),
      'Site execution, structural engineering and heavy machinery installation'),
    makeJob('civil-rites-2026', 'RITES — Graduate Engineer Trainee (Civil/Mech)',
      'RITES Ltd.', 'Pan India', 'full-time', 'civil',
      'https://rites.com/vacancies',
      'RITES Careers', '₹40,000 - ₹1,40,000/month',
      new Date().toISOString(),
      'Civil/Mech engineers for infrastructure and railway projects'),
    makeJob('mech-tata-motors-2026', 'Tata Motors — Design Engineer (AutoCAD)',
      'Tata Motors', 'Pune', 'full-time', 'civil',
      'https://careers.tatamotors.com/',
      'Tata Motors Careers', '₹6–12 LPA',
      new Date().toISOString(),
      'Mechanical design, AutoCAD, and automotive component engineering'),
    makeJob('mech-drdo-2026', 'DRDO — Scientist B (Mechanical)',
      'DRDO', 'Pan India', 'full-time', 'civil',
      'https://rac.gov.in/',
      'DRDO RAC', '₹56,100 - ₹1,77,500/month',
      new Date().toISOString(),
      'Government mechanical engineering positions through GATE 2026'),
  ].filter(Boolean) as Job[]

  const freshJobs = await fetchNewSources('civil mechanical engineering construction structural autocad design manufacturing', 'civil')
  return dedupe([...apiJobs, ...fallback, ...freshJobs]).slice(0, 60)
}

// ════════════════════════════════════════════
// MAIN ROUTE HANDLER
// ════════════════════════════════════════════

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || 'all'

  try {
    let jobs: Job[] = []

    const fetchers: Record<string, () => Promise<Job[]>> = {
      internship: fetchInternships,
      internships: fetchInternships,
      mnc: fetchMNCJobs,
      banking: fetchBankingJobs,
      government: fetchGovernmentJobs,
      govt: fetchGovernmentJobs,
      startup: fetchStartupJobs,
      'cat-mba': fetchCATMBAJobs,
      catmba: fetchCATMBAJobs,
      core: fetchCoreJobs,
      civil: fetchCivilJobs,
    }

    if (category === 'all') {
      const results = await Promise.allSettled([
        fetchInternships(),
        fetchMNCJobs(),
        fetchBankingJobs(),
        fetchGovernmentJobs(),
        fetchStartupJobs(),
        fetchCATMBAJobs(),
        fetchCoreJobs(),
        fetchCivilJobs(),
      ])
      jobs = results.flatMap(r =>
        r.status === 'fulfilled' ? r.value : []
      )
    } else {
      const fetcher = fetchers[category]
      if (fetcher) {
        jobs = await fetcher()
      }
    }

    // Load admin posted jobs
    let adminJobsList: Job[] = []
    try {
      const rawAdminJobs = await getJobs() || []
      adminJobsList = rawAdminJobs
        .filter(aj => aj && aj.isActive)
        .map(aj => {
          const daysDiff = Math.floor(
            (Date.now() - new Date(aj.createdAt).getTime()) / 86400000
          )
          return {
            id: aj.id,
            title: aj.title,
            company: aj.company,
            logo: aj.logo || '',
            location: aj.location || 'India',
            jobType: aj.jobType || 'full-time',
            category: aj.category,
            salary: aj.salary || undefined,
            postedDate: aj.createdAt || new Date().toISOString(),
            deadline: aj.deadline || undefined,
            applyLink: aj.applyLink,
            isNew: daysDiff <= 1,
            source: 'Admin',
            description: aj.description,
          }
        })
    } catch (err) {
      console.error('Failed to load admin jobs in daily feed:', err)
    }

    // Filter admin jobs for the requested category
    let categoryAdminJobs: Job[] = []
    if (category === 'all') {
      categoryAdminJobs = adminJobsList
    } else {
      const normalizedRequest = category.toLowerCase()
      categoryAdminJobs = adminJobsList.filter(aj => {
        const ajCat = aj.category.toLowerCase()
        if (normalizedRequest === 'government' || normalizedRequest === 'govt') {
          return ajCat === 'government' || ajCat === 'govt'
        }
        if (normalizedRequest === 'internships' || normalizedRequest === 'internship') {
          return ajCat === 'internship' || ajCat === 'internships'
        }
        if (normalizedRequest === 'cat-mba' || normalizedRequest === 'catmba') {
          return ajCat === 'cat-mba' || ajCat === 'catmba'
        }
        return ajCat === normalizedRequest
      })
    }

    const combinedJobs = dedupe([...categoryAdminJobs, ...jobs])

    // Inject custom logos and filter hidden jobs
    let logosDict: Record<string, string> = {}
    let hiddenJobs: Set<string> = new Set()
    try {
      const { getCompanyLogos, getHiddenJobs } = await import('@/lib/admin-storage')
      const logos = await getCompanyLogos()
      for (const l of logos) {
        if (l.company && l.company.trim()) {
          logosDict[l.company.toLowerCase().trim()] = l.logo
        }
      }
      hiddenJobs = new Set(await getHiddenJobs())
    } catch {}

    const today = new Date().toDateString()
    const validJobs = combinedJobs
      .filter(j => j && j.applyLink && j.applyLink.startsWith('http'))
      .filter(j => !hiddenJobs.has(j.id))
      .map(j => {
        const jComp = j.company.toLowerCase()
        const matchedKey = Object.keys(logosDict).find(k => jComp.includes(k) || k === jComp)
        
        if (matchedKey) {
          return { ...j, logo: logosDict[matchedKey] }
        }
        return j
      })

    return NextResponse.json({
      jobs: validJobs,
      total: validJobs.length,
      newToday: validJobs.filter(
        j => new Date(j.postedDate).toDateString() === today
      ).length,
      fetchedAt: new Date().toISOString(),
      category,
    })

  } catch (error) {
    console.error('Job fetch error:', error)
    return NextResponse.json(
      { jobs: [], total: 0, newToday: 0, error: 'Fetch failed' },
      { status: 500 }
    )
  }
}
