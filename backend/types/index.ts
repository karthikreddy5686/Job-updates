export type ThemeMode = 'light' | 'dark';

export type JobNotificationCategory =
  | 'internships'
  | 'mnc'
  | 'banking'
  | 'government'
  | 'startup'
  | 'cat-mba'
  | 'recommendations'
  | 'deadlines'
  | 'resume-match'
  | 'saved-roles'
  | 'referral'
  | 'application-tracker';

export interface JobNotification {
  id: string;
  category: JobNotificationCategory;
  title: string;
  company: string;
  location: string;
  jobType: 'remote' | 'hybrid' | 'onsite' | 'full-time' | 'part-time';
  postedDate: string;
  deadline: string;
  isNew: boolean;
  applyLink: string;
}

export interface NavLinkItem {
  label: string;
  href: string;
}
