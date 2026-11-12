import { syncJobsAndPurgeExpired } from './job-sync-service';

// Target hours: 6 AM, 9 AM, 12 PM, 3 PM, 6 PM IST
const SCHEDULE_HOURS = [6, 9, 12, 15, 18];

declare global {
  // Prevent duplicate intervals during Next.js hot module reloads
  var __jobSchedulerTimer: NodeJS.Timeout | null | undefined;
  var __lastJobSyncKey: string | undefined;
}

export function initJobScheduler() {
  if (global.__jobSchedulerTimer) {
    return;
  }

  console.log('[JobScheduler] Initializing automated job sync (Daily at 6 AM, 9 AM, 12 PM, 3 PM, 6 PM IST)...');

  // Check every 60 seconds
  global.__jobSchedulerTimer = setInterval(async () => {
    try {
      const now = new Date();
      // Format to IST (Asia/Kolkata)
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const parts = formatter.formatToParts(now);
      const year = parts.find(p => p.type === 'year')?.value || '';
      const month = parts.find(p => p.type === 'month')?.value || '';
      const day = parts.find(p => p.type === 'day')?.value || '';
      const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
      const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);

      const slotKey = `${year}-${month}-${day}T${hour}`;

      // Check if current hour is one of 6, 9, 12, 15, 18, and within the first 2 minutes
      if (SCHEDULE_HOURS.includes(hour) && minute <= 2) {
        if (global.__lastJobSyncKey !== slotKey) {
          global.__lastJobSyncKey = slotKey;
          console.log(`[JobScheduler] Triggering scheduled job sync for slot: ${slotKey} (${hour}:00 IST)`);
          await syncJobsAndPurgeExpired();
        }
      }
    } catch (err) {
      console.error('[JobScheduler] Error during scheduled check:', err);
    }
  }, 60 * 1000);
}

