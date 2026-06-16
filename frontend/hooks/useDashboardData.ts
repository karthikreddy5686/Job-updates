'use client';

import { useEffect, useState } from 'react';

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'recruiter' | 'admin';
};

export interface DashboardJob {
  id: string;
  title: string;
  company: string;
  location: string;
  status: string;
  interviewTime?: string;
}

export interface DashboardSummary {
  applicationsThisWeek: number;
  interviewInvites: number;
  savedJobs: number;
  profileViews: number;
  nextInterview: {
    title: string;
    company: string;
    time: string;
  } | null;
}

export interface DashboardActivity {
  applied: number;
  screening: number;
  interview: number;
  offers: number;
}

export interface DashboardData {
  loading: boolean;
  error: string | null;
  summary: DashboardSummary;
  applications: DashboardJob[];
  savedJobs: DashboardJob[];
  recommendations: DashboardJob[];
  profileCompletion: number;
  profileTasks: { name: string; done: boolean }[];
  activity: DashboardActivity;
}

const initialSummary: DashboardSummary = {
  applicationsThisWeek: 0,
  interviewInvites: 0,
  savedJobs: 0,
  profileViews: 0,
  nextInterview: null,
};

const initialState: DashboardData = {
  loading: false,
  error: null,
  summary: initialSummary,
  applications: [],
  savedJobs: [],
  recommendations: [],
  profileCompletion: 0,
  profileTasks: [],
  activity: { applied: 0, screening: 0, interview: 0, offers: 0 },
};

const buildActivity = (applications: DashboardJob[]): DashboardActivity => ({
  applied: applications.filter((job) => job.status === 'Applied').length,
  screening: applications.filter((job) => job.status === 'Screening').length,
  interview: applications.filter((job) => job.status === 'Interview').length,
  offers: applications.filter((job) => job.status === 'Offer').length,
});

const buildProfileTasks = (user: AuthUser | null) => [
  { name: 'Basic profile', done: Boolean(user?.name && user?.email) },
  { name: 'Preferred role', done: Boolean(user?.role) },
  { name: 'Resume', done: false },
  { name: 'Skills', done: false },
  { name: 'Bio', done: false },
];

const getProgressValue = (completed: number, total: number) => {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

const mapStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'applied':
      return 'Applied';
    case 'screening':
      return 'Screening';
    case 'interview':
      return 'Interview';
    case 'offer':
    case 'offered':
      return 'Offer';
    default:
      return status;
  }
};

const fetchDashboardSummary = async (user: AuthUser) => {
  const response = await fetch('/api/dashboard/summary', {
    headers: {
      'x-user-id': user.id,
    },
  });

  if (!response.ok) {
    throw new Error('Unable to load dashboard summary');
  }

  return (await response.json()) as {
    summary: DashboardSummary;
    applications: DashboardJob[];
    savedJobs: DashboardJob[];
    recommendations: DashboardJob[];
  };
};

export function useDashboardData(user: AuthUser | null): DashboardData {
  const [data, setData] = useState<DashboardData>(initialState);

  useEffect(() => {
    let active = true;

    if (!user) {
      setData((current) => ({
        ...current,
        loading: false,
        error: null,
        profileTasks: buildProfileTasks(null),
        profileCompletion: 0,
      }));
      return;
    }

    const loadDashboard = async () => {
      setData((current) => ({ ...current, loading: true, error: null }));

      try {
        const apiData = await fetchDashboardSummary(user);
        if (!active) return;

        const profileTasks = buildProfileTasks(user);
        const profileCompletion = getProgressValue(
          profileTasks.filter((item) => item.done).length,
          profileTasks.length,
        );

        setData({
          loading: false,
          error: null,
          summary: apiData.summary,
          applications: apiData.applications.map((job) => ({ ...job, status: mapStatus(job.status) })),
          savedJobs: apiData.savedJobs,
          recommendations: apiData.recommendations,
          profileCompletion,
          profileTasks,
          activity: buildActivity(apiData.applications.map((job) => ({ ...job, status: mapStatus(job.status) }))),
        });
      } catch (error) {
        if (!active) return;

        setData((current) => ({
          ...current,
          loading: false,
          error: error instanceof Error ? error.message : 'Unable to load dashboard data',
        }));
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, [user]);

  return data;
}
