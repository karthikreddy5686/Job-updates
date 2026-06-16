export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'candidate';
  dateJoined: string;
  status: 'active' | 'suspended' | 'pending';
  profileCompletion: number;
}

export interface AdminRecruiter {
  id: string;
  name: string;
  company: string;
  email: string;
  activeJobs: number;
  status: 'approved' | 'pending' | 'suspended';
  dateJoined: string;
}

export interface AdminJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  applicants: number;
  status: 'active' | 'pending' | 'closed';
  postedAt: string;
}

export interface AdminReport {
  id: string;
  type: 'Job Listing' | 'User Profile' | 'Recruiter Spam' | 'Technical Bug';
  reporterName: string;
  targetItem: string;
  description: string;
  date: string;
  status: 'Open' | 'In Review' | 'Resolved';
}

export const mockUsers: AdminUser[] = [
  { id: 'usr_1', name: 'Jordan Kim', email: 'jordan.kim@example.com', role: 'candidate', dateJoined: '2026-01-15', status: 'active', profileCompletion: 78 },
  { id: 'usr_2', name: 'Emma Watson', email: 'emma.w@example.com', role: 'candidate', dateJoined: '2026-02-10', status: 'active', profileCompletion: 95 },
  { id: 'usr_3', name: 'Liam Neeson', email: 'liam.n@example.com', role: 'candidate', dateJoined: '2026-03-01', status: 'pending', profileCompletion: 45 },
  { id: 'usr_4', name: 'Sophia Loren', email: 'sophia.l@example.com', role: 'candidate', dateJoined: '2026-03-12', status: 'active', profileCompletion: 88 },
  { id: 'usr_5', name: 'Lucas Hedges', email: 'lucas.h@example.com', role: 'candidate', dateJoined: '2026-04-05', status: 'suspended', profileCompletion: 10 },
  { id: 'usr_6', name: 'Mia Thermopolis', email: 'mia.t@example.com', role: 'candidate', dateJoined: '2026-04-18', status: 'active', profileCompletion: 60 },
  { id: 'usr_7', name: 'Oliver Twist', email: 'oliver.t@example.com', role: 'candidate', dateJoined: '2026-04-20', status: 'pending', profileCompletion: 25 },
  { id: 'usr_8', name: 'Ava DuVernay', email: 'ava.d@example.com', role: 'candidate', dateJoined: '2026-05-02', status: 'active', profileCompletion: 100 },
  { id: 'usr_9', name: 'Noah Centineo', email: 'noah.c@example.com', role: 'candidate', dateJoined: '2026-05-10', status: 'active', profileCompletion: 82 },
  { id: 'usr_10', name: 'Isabella Swan', email: 'bella.s@example.com', role: 'candidate', dateJoined: '2026-05-12', status: 'suspended', profileCompletion: 90 },
  { id: 'usr_11', name: 'Ethan Hunt', email: 'ethan.h@example.com', role: 'candidate', dateJoined: '2026-05-14', status: 'active', profileCompletion: 85 },
  { id: 'usr_12', name: 'Charlotte Bronte', email: 'charlotte.b@example.com', role: 'candidate', dateJoined: '2026-05-15', status: 'active', profileCompletion: 70 },
  { id: 'usr_13', name: 'Daniel Craig', email: 'daniel.c@example.com', role: 'candidate', dateJoined: '2026-05-18', status: 'pending', profileCompletion: 30 },
  { id: 'usr_14', name: 'Grace Kelly', email: 'grace.k@example.com', role: 'candidate', dateJoined: '2026-05-19', status: 'active', profileCompletion: 92 },
  { id: 'usr_15', name: 'William Shakespeare', email: 'will.s@example.com', role: 'candidate', dateJoined: '2026-05-20', status: 'active', profileCompletion: 80 }
];

export const mockRecruiters: AdminRecruiter[] = [
  { id: 'rec_1', name: 'Sarah Connor', company: 'Cyberdyne Systems', email: 's.connor@cyberdyne.com', activeJobs: 3, status: 'approved', dateJoined: '2026-01-20' },
  { id: 'rec_2', name: 'Bruce Wayne', company: 'Wayne Enterprises', email: 'bruce@waynecorp.com', activeJobs: 8, status: 'approved', dateJoined: '2026-02-14' },
  { id: 'rec_3', name: 'Lex Luthor', company: 'LexCorp', email: 'lex@lexcorp.com', activeJobs: 0, status: 'suspended', dateJoined: '2026-03-05' },
  { id: 'rec_4', name: 'Tony Stark', company: 'Stark Industries', email: 'tony@stark.com', activeJobs: 12, status: 'approved', dateJoined: '2026-03-25' },
  { id: 'rec_5', name: 'Peter Parker', company: 'Daily Bugle', email: 'peter.p@bugle.com', activeJobs: 1, status: 'pending', dateJoined: '2026-04-10' },
  { id: 'rec_6', name: 'Clark Kent', company: 'Daily Planet', email: 'clark@dailyplanet.com', activeJobs: 2, status: 'approved', dateJoined: '2026-04-22' },
  { id: 'rec_7', name: 'Diana Prince', company: 'Themyscira Exports', email: 'diana@themyscira.com', activeJobs: 4, status: 'approved', dateJoined: '2026-05-01' },
  { id: 'rec_8', name: 'Barry Allen', company: 'S.T.A.R. Labs', email: 'barry@starlabs.com', activeJobs: 0, status: 'pending', dateJoined: '2026-05-15' },
  { id: 'rec_9', name: 'Hal Jordan', company: 'Ferris Aircraft', email: 'hal.j@ferris.com', activeJobs: 3, status: 'approved', dateJoined: '2026-05-18' },
  { id: 'rec_10', name: 'Arthur Curry', company: 'Atlantis Marine', email: 'arthur@atlantismarine.com', activeJobs: 1, status: 'suspended', dateJoined: '2026-05-20' }
];

export const mockJobs: AdminJob[] = [
  { id: 'job_1', title: 'Senior Product Designer', company: 'TechCraft', location: 'Remote', type: 'Full-time', applicants: 86, status: 'active', postedAt: '2 days ago' },
  { id: 'job_2', title: 'Frontend Engineer', company: 'Scale Labs', location: 'San Francisco, CA', type: 'Full-time', applicants: 142, status: 'active', postedAt: '5 days ago' },
  { id: 'job_3', title: 'Growth Marketing Manager', company: 'Pulse Creative', location: 'New York, NY', type: 'Full-time', applicants: 45, status: 'active', postedAt: '1 week ago' },
  { id: 'job_4', title: 'Lead UX Researcher', company: 'Nova Studio', location: 'Remote', type: 'Full-time', applicants: 12, status: 'active', postedAt: '3 days ago' },
  { id: 'job_5', title: 'Backend Engineer', company: 'ForgeAI', location: 'Remote', type: 'Full-time', applicants: 28, status: 'active', postedAt: '4 days ago' },
  { id: 'job_6', title: 'Data Analyst', company: 'Nimble', location: 'Austin, TX', type: 'Contract', applicants: 19, status: 'active', postedAt: '1 day ago' },
  { id: 'job_7', title: 'DevOps Engineer', company: 'Cloud Harbor', location: 'Remote', type: 'Contract', applicants: 8, status: 'pending', postedAt: '12 hours ago' },
  { id: 'job_8', title: 'Recruiting Specialist', company: 'Altitude Health', location: 'New York, NY', type: 'Full-time', applicants: 32, status: 'active', postedAt: '6 days ago' },
  { id: 'job_9', title: 'Mobile App Developer (React Native)', company: 'Appify', location: 'Remote', type: 'Full-time', applicants: 51, status: 'pending', postedAt: '1 day ago' },
  { id: 'job_10', title: 'AI Engineering Intern', company: 'DeepMind Labs', location: 'London, UK', type: 'Internship', applicants: 250, status: 'active', postedAt: '3 days ago' },
  { id: 'job_11', title: 'Technical Copywriter', company: 'WordFlow', location: 'Remote', type: 'Part-time', applicants: 14, status: 'closed', postedAt: '2 weeks ago' },
  { id: 'job_12', title: 'HR Manager', company: 'Apex Group', location: 'Seattle, WA', type: 'Full-time', applicants: 41, status: 'closed', postedAt: '3 weeks ago' }
];

export const mockReports: AdminReport[] = [
  { id: 'rep_1', type: 'Job Listing', reporterName: 'Emma Watson', targetItem: 'AI Engineering Intern (DeepMind Labs)', description: 'Job listing description uses incorrect copyright and links to unverified websites.', date: '2026-05-18', status: 'Open' },
  { id: 'rep_2', type: 'Recruiter Spam', reporterName: 'Jordan Kim', targetItem: 'Lex Luthor (LexCorp)', description: 'Sending duplicate aggressive messages asking for security codes in candidate portals.', date: '2026-05-19', status: 'In Review' },
  { id: 'rep_3', type: 'Technical Bug', reporterName: 'Sarah Connor', targetItem: 'Resume Uploader', description: 'Failing to upload PDFs larger than 2MB with a cryptic error instead of user-friendly alert.', date: '2026-05-19', status: 'Open' },
  { id: 'rep_4', type: 'User Profile', reporterName: 'Tony Stark', targetItem: 'Lucas Hedges', description: 'Suspected bots account posting irrelevant links under background checks responses.', date: '2026-05-17', status: 'Resolved' },
  { id: 'rep_5', type: 'Job Listing', reporterName: 'Sophia Loren', targetItem: 'Technical Copywriter (WordFlow)', description: 'Listing expired but still redirecting traffic to dead external applications links.', date: '2026-05-15', status: 'Resolved' }
];

export const mockAnalyticsHistory = {
  signups: [
    { month: 'Jan', candidates: 120, recruiters: 15 },
    { month: 'Feb', candidates: 190, recruiters: 24 },
    { month: 'Mar', candidates: 250, recruiters: 30 },
    { month: 'Apr', candidates: 340, recruiters: 42 },
    { month: 'May', candidates: 410, recruiters: 55 }
  ],
  applicationsPerCategory: [
    { category: 'Engineering', count: 642, color: 'bg-primary-500' },
    { category: 'Design', count: 328, color: 'bg-accent-500' },
    { category: 'Marketing', count: 184, color: 'bg-emerald-500' },
    { category: 'Data Science', count: 215, color: 'bg-amber-500' },
    { category: 'HR & Admin', count: 98, color: 'bg-purple-500' }
  ]
};
