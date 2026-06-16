export type DailyCategory = 'internship' | 'mnc' | 'government' | 'banking' | 'startup' | 'cat-mba' | 'core' | 'civil';

export type DailyJobType = 'remote' | 'hybrid' | 'onsite' | 'internship' | 'full-time';

export type DateRangeOption = 'today' | 'this-week' | 'this-month';

export type JobTypeFilter = 'all' | DailyJobType;

export type SortOption = 'newest-first' | 'deadline-soon';

export interface DailyJob {
  id: string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  jobType: DailyJobType;
  category: DailyCategory;
  salary?: string;
  postedDate: string;
  deadline?: string;
  applyLink: string;
  isNew: boolean;
  source: string;
}
