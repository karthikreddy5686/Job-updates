'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { jobCapabilities } from '@/data/jobCapabilities';
import type { JobNotification, JobNotificationCategory } from '@/types';

const STORAGE_KEY = 'job_update_notifications_state';
const POLL_INTERVAL = 24 * 60 * 60 * 1000;

type NotificationCategory = JobNotificationCategory;

interface NotificationStoreState {
  subscribedCategories: NotificationCategory[];
  counts: Record<NotificationCategory, number>;
  lastUpdated: Record<NotificationCategory, string>;
  alertsByCategory: Record<NotificationCategory, JobNotification[]>;
}

interface UseJobNotificationsResult {
  subscribedCategories: NotificationCategory[];
  notificationCounts: Record<NotificationCategory, number>;
  lastUpdated: Record<NotificationCategory, string>;
  unreadCount: number;
  recentAlerts: (JobNotification & { categoryLabel: string })[];
  toastMessage: string | null;
  toggleSubscription: (category: NotificationCategory) => void;
  markAllAsRead: () => void;
}

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  internships: 'Internships',
  mnc: 'MNC Jobs',
  banking: 'Banking Jobs',
  government: 'Government Jobs',
  startup: 'Startup Roles',
  'cat-mba': 'CAT / MBA Paths',
  recommendations: 'Recommendations',
  deadlines: 'Deadline Alerts',
  'resume-match': 'Resume Match',
  'saved-roles': 'Saved Roles',
  referral: 'Referral Hub',
  'application-tracker': 'Application Tracker',
};

const categories = jobCapabilities.map((capability) => capability.apiCategory || (capability.id as NotificationCategory)) as NotificationCategory[];

const buildEmptyAlerts = (): Record<NotificationCategory, JobNotification[]> => {
  return categories.reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {} as Record<NotificationCategory, JobNotification[]>);
};

const buildDefaultCounts = (): Record<NotificationCategory, number> => {
  return categories.reduce((acc, category) => {
    acc[category] = 0;
    return acc;
  }, {} as Record<NotificationCategory, number>);
};

const defaultState: NotificationStoreState = {
  subscribedCategories: [],
  counts: buildDefaultCounts(),
  lastUpdated: categories.reduce((acc, category) => {
    acc[category] = '';
    return acc;
  }, {} as Record<NotificationCategory, string>),
  alertsByCategory: buildEmptyAlerts(),
};

const normalizeCategory = (value: unknown): NotificationCategory | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  switch (normalized) {
    case 'internships':
    case 'internship':
      return 'internships';
    case 'mnc':
      return 'mnc';
    case 'banking':
      return 'banking';
    case 'government':
      return 'government';
    case 'startup':
    case 'startups':
      return 'startup';
    case 'cat-mba':
    case 'cat':
    case 'mba':
      return 'cat-mba';
    case 'recommendations':
    case 'recommendation':
      return 'recommendations';
    case 'deadlines':
    case 'deadline-alerts':
    case 'alerts':
      return 'deadlines';
    case 'resume-match':
    case 'resume_match':
      return 'resume-match';
    case 'saved-roles':
    case 'saved':
      return 'saved-roles';
    case 'referral':
    case 'referrals':
      return 'referral';
    case 'application-tracker':
    case 'tracker':
      return 'application-tracker';
    default:
      return undefined;
  }
};

const loadState = (): NotificationStoreState => {
  if (typeof window === 'undefined') return defaultState;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<NotificationStoreState>;

    return {
      subscribedCategories: Array.isArray(parsed.subscribedCategories)
        ? parsed.subscribedCategories.filter((value): value is NotificationCategory => normalizeCategory(value) !== undefined)
        : [],
      counts: { ...buildDefaultCounts(), ...(parsed.counts || {}) },
      lastUpdated: { ...defaultState.lastUpdated, ...(parsed.lastUpdated || {}) },
      alertsByCategory: { ...buildEmptyAlerts(), ...(parsed.alertsByCategory || {}) },
    };
  } catch (error) {
    console.error('Failed to load notification state:', error);
    return defaultState;
  }
};

const persistState = (state: NotificationStoreState) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('jobUpdateNotificationsChanged', { detail: state }));
  } catch (error) {
    console.error('Failed to persist notification state:', error);
  }
};

const formatJobTitle = (notification: JobNotification) => `${notification.title} at ${notification.company}`;

const buildBrowserNotification = (message: string) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification('JobUpdate Alerts', { body: message });
  } else if (Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('JobUpdate Alerts', { body: message });
      }
    });
  }
};

export function useJobNotifications({ refreshOnMount = true, poll = true } = {}): UseJobNotificationsResult {
  const [state, setState] = useState<NotificationStoreState>(defaultState);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const stateRef = useRef<NotificationStoreState>(defaultState);

  const setAndPersistState = useCallback((nextState: NotificationStoreState) => {
    stateRef.current = nextState;
    setState(nextState);
    persistState(nextState);
  }, []);

  const unreadCount = useMemo(() => {
    return state.subscribedCategories.reduce((sum, category) => sum + (state.counts[category] || 0), 0);
  }, [state.counts, state.subscribedCategories]);

  const recentAlerts = useMemo(() => {
    return Object.entries(state.alertsByCategory)
      .flatMap(([category, alerts]) => {
        const categoryLabel = CATEGORY_LABELS[category as NotificationCategory] || category;
        return alerts.map((alert) => ({ ...alert, categoryLabel }));
      })
      .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
      .slice(0, 5);
  }, [state.alertsByCategory]);

  const markAllAsRead = useCallback(() => {
    const updatedAlerts = Object.fromEntries(
      Object.entries(stateRef.current.alertsByCategory).map(([category, alerts]) => {
        return [category, alerts.map((job) => ({ ...job, isNew: false }))];
      })
    ) as Record<NotificationCategory, JobNotification[]>;

    const nextCounts = categories.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {} as Record<NotificationCategory, number>);

    const nextState = {
      ...stateRef.current,
      counts: nextCounts,
      alertsByCategory: updatedAlerts,
    };

    setAndPersistState(nextState);
  }, [setAndPersistState]);

  const toggleSubscription = useCallback(
    (category: NotificationCategory) => {
      const nextSubscriptions = stateRef.current.subscribedCategories.includes(category)
        ? stateRef.current.subscribedCategories.filter((item) => item !== category)
        : [...stateRef.current.subscribedCategories, category];

      const nextState = { ...stateRef.current, subscribedCategories: nextSubscriptions };
      setAndPersistState(nextState);
    },
    [setAndPersistState]
  );

  const refreshAllNotifications = useCallback(async () => {
    const previousState = stateRef.current;
    const previousTotal = previousState.subscribedCategories.reduce((sum, category) => sum + (previousState.counts[category] || 0), 0);

    const categoryResults = await Promise.all(
      categories.map(async (category) => {
        try {
          const response = await fetch(`/api/jobs/notifications?category=${encodeURIComponent(category)}`);
          if (!response.ok) {
            return { category, jobs: [] as JobNotification[] };
          }
          const body = (await response.json()) as { jobs: JobNotification[] };
          return { category, jobs: body.jobs || [] };
        } catch (error) {
          console.error('Notification fetch failed for', category, error);
          return { category, jobs: [] as JobNotification[] };
        }
      })
    );

    const nextAlertsByCategory = { ...previousState.alertsByCategory };
    const nextCounts = { ...previousState.counts };
    const nextLastUpdated = { ...previousState.lastUpdated };
    let subscribedNewCount = 0;

    categoryResults.forEach(({ category, jobs }) => {
      nextAlertsByCategory[category] = jobs;
      nextCounts[category] = jobs.filter((job) => job.isNew).length;
      nextLastUpdated[category] = new Date().toISOString();
      if (previousState.subscribedCategories.includes(category)) {
        subscribedNewCount += nextCounts[category];
      }
    });

    const nextState = {
      ...previousState,
      alertsByCategory: nextAlertsByCategory,
      counts: nextCounts,
      lastUpdated: nextLastUpdated,
    };

    setAndPersistState(nextState);

    if (subscribedNewCount > previousTotal && previousState.subscribedCategories.length) {
      const message = `${subscribedNewCount} new job alert${subscribedNewCount > 1 ? 's' : ''} are available in your subscribed categories.`;
      setToastMessage(message);
      buildBrowserNotification(message);
      window.setTimeout(() => setToastMessage(null), 4200);
    }
  }, [setAndPersistState]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedState = loadState();
    stateRef.current = storedState;
    setState(storedState);

    if (refreshOnMount) {
      refreshAllNotifications();
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setState(loadState());
      }
    };

    const handleCustom = () => setState(loadState());

    window.addEventListener('storage', handleStorage);
    window.addEventListener('jobUpdateNotificationsChanged', handleCustom as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('jobUpdateNotificationsChanged', handleCustom as EventListener);
    };
  }, [refreshAllNotifications, refreshOnMount]);

  useEffect(() => {
    if (!poll || typeof window === 'undefined') return;
    const interval = window.setInterval(() => {
      refreshAllNotifications();
    }, POLL_INTERVAL);
    return () => {
      window.clearInterval(interval);
    };
  }, [poll, refreshAllNotifications]);

  return {
    subscribedCategories: state.subscribedCategories,
    notificationCounts: state.counts,
    lastUpdated: state.lastUpdated,
    unreadCount,
    recentAlerts,
    toastMessage,
    toggleSubscription,
    markAllAsRead,
  };
}
