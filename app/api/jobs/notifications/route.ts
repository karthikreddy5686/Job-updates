import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import type { JobNotification, JobNotificationCategory } from '@/types';

type CategoryAlias = JobNotificationCategory;

const normalizeCategory = (value: string | null): CategoryAlias | null => {
  if (!value) return null;
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
      return null;
  }
};

const buildTimestamp = (offsetHours: number) => {
  const date = new Date(Date.now() - offsetHours * 60 * 60 * 1000);
  return date.toISOString();
};

const buildDeadline = (daysAhead: number) => {
  const deadline = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
  return deadline.toISOString().split('T')[0];
};

const makeJob = (
  category: CategoryAlias,
  id: string,
  title: string,
  company: string,
  jobType: JobNotification['jobType'],
  daysUntilDeadline = 7,
  newJob = true,
  location = 'Remote'
): JobNotification => ({
  id: `${category}-${id}`,
  category,
  title,
  company,
  location,
  jobType,
  postedDate: buildTimestamp(Math.floor(Math.random() * 6)),
  deadline: buildDeadline(daysUntilDeadline),
  isNew: newJob,
  applyLink: `https://jobupdate.example.com/apply/${category}/${id}`,
});

const mockData: Record<CategoryAlias, JobNotification[]> = {
  internships: [
    makeJob('internships', 'ux-2026', 'UX Intern', 'StudioBloom', 'remote', 14),
    makeJob('internships', 'data-2026', 'Data Science Intern', 'Pulse AI', 'hybrid', 10),
    makeJob('internships', 'marketing-2026', 'Marketing Intern', 'FitByte', 'onsite', 8),
  ],
  mnc: [
    makeJob('mnc', 'cloud-2026', 'Cloud Engineer', 'Kronos Systems', 'hybrid', 9),
    makeJob('mnc', 'product-2026', 'Product Manager', 'GlobeTech', 'onsite', 12),
    makeJob('mnc', 'qa-2026', 'QA Analyst', 'TeraSoft', 'remote', 11),
  ],
  banking: [
    makeJob('banking', 'relationship-2026', 'Banking Relationship Officer', 'Axis Bank', 'onsite', 7),
    makeJob('banking', 'risk-2026', 'Risk Analyst', 'Standard Chartered', 'hybrid', 13),
    makeJob('banking', 'operations-2026', 'Operations Executive', 'SBI', 'onsite', 5),
  ],
  government: [
    makeJob('government', 'rrb-ntpc-2026', 'RRB NTPC 2026 — Railway Non-Technical Popular Categories', 'Railway Recruitment Board (RRB)', 'onsite', 30, true, 'Pan India'),
    makeJob('government', 'ssc-cgl-2026', 'SSC CGL 2026 — Combined Graduate Level Recruitment', 'Staff Selection Commission (SSC)', 'onsite', 25, true, 'Pan India'),
    makeJob('government', 'upsc-cse-2026', 'UPSC Civil Services Examination 2026 (IAS/IPS)', 'Union Public Service Commission (UPSC)', 'onsite', 15, true, 'Pan India'),
    makeJob('government', 'ibps-po-2026', 'IBPS PO CRP PO/MT-XIV — Probationary Officer', 'Institute of Banking Personnel Selection (IBPS)', 'onsite', 20, true, 'Pan India'),
    makeJob('government', 'isro-scientist-2026', 'ISRO Scientist / Engineer (Electronics/Mechanical/CS)', 'Indian Space Research Organisation (ISRO)', 'onsite', 12, true, 'Bangalore / Sriharikota / Ahmedabad'),
    makeJob('government', 'drdo-scientist-b-2026', 'DRDO Scientist \'B\' Recruitment (RAC)', 'Defence Research and Development Organisation (DRDO)', 'onsite', 18, true, 'New Delhi / Pune / Bangalore'),
    makeJob('government', 'rbi-grade-b-2026', 'RBI Grade B Officer Recruitment 2026', 'Reserve Bank of India (RBI)', 'onsite', 10, true, 'Pan India'),
    makeJob('government', 'sbi-po-2026', 'SBI PO 2026 — Probationary Officer Recruitment', 'State Bank of India (SBI)', 'onsite', 8, true, 'Pan India'),
    makeJob('government', 'ongc-gt-2026', 'ONGC Graduate Trainee through GATE 2026', 'Oil and Natural Gas Corporation (ONGC)', 'onsite', 22, true, 'Pan India'),
    makeJob('government', 'lic-aao-2026', 'LIC AAO 2026 — Assistant Administrative Officer', 'Life Insurance Corporation of India (LIC)', 'onsite', 14, true, 'Pan India'),
    makeJob('government', 'barc-so-2026', 'BARC Scientific Officer Recruitment (OCES/DGFS)', 'Bhabha Atomic Research Centre (BARC)', 'onsite', 16, true, 'Mumbai / Kalpakkam'),
    makeJob('government', 'dmrc-engineer-2026', 'DMRC Section Engineer & Station Controller', 'Delhi Metro Rail Corporation (DMRC)', 'onsite', 7, true, 'New Delhi / NCR'),
    makeJob('government', 'afcat-iaf-2026', 'IAF AFCAT 01/2026 — Air Force Common Admission Test', 'Indian Air Force (IAF)', 'onsite', 5, true, 'Pan India'),
    makeJob('government', 'nabard-grade-a-2026', 'NABARD Grade A Officer (Assistant Manager)', 'National Bank for Agriculture and Rural Development', 'onsite', 6, true, 'Pan India'),
  ],
  startup: [
    makeJob('startup', 'growth-2026', 'Growth Marketing Lead', 'LaunchPad', 'remote', 11),
    makeJob('startup', 'frontend-2026', 'Frontend Engineer', 'SparkLabs', 'hybrid', 9),
    makeJob('startup', 'customer-2026', 'Customer Success', 'Waveform', 'remote', 16),
  ],
  'cat-mba': [
    makeJob('cat-mba', 'prep-2026', 'CAT Prep Mentor', 'MBA Catalyst', 'onsite', 20),
    makeJob('cat-mba', 'admissions-2026', 'Admissions Analyst', 'B-School Hub', 'hybrid', 22),
    makeJob('cat-mba', 'career-2026', 'Career Coach', 'FuturePaths', 'remote', 18),
  ],
  recommendations: [
    makeJob('recommendations', 'matching-2026', 'AI Role Specialist', 'NextShift', 'remote', 15),
    makeJob('recommendations', 'insights-2026', 'Talent Insights Lead', 'CareerMinds', 'hybrid', 12),
    makeJob('recommendations', 'data-2026', 'Recommendation Engine Analyst', 'SmartHire', 'remote', 10),
  ],
  deadlines: [
    makeJob('deadlines', 'govt-2026', 'Exam Filing Coordinator', 'GovTrack', 'onsite', 5),
    makeJob('deadlines', 'mba-2026', 'MBA Application Advisor', 'EduLink', 'remote', 7),
    makeJob('deadlines', 'intern-2026', 'Internship Alert Manager', 'FreshStart', 'hybrid', 6),
  ],
  'resume-match': [
    makeJob('resume-match', 'match-2026', 'Resume Optimization Specialist', 'TalentFit', 'remote', 9),
    makeJob('resume-match', 'analysis-2026', 'Profile Match Analyst', 'HireFlow', 'hybrid', 10),
    makeJob('resume-match', 'review-2026', 'Resume Review Lead', 'JobSync', 'remote', 12),
  ],
  'saved-roles': [
    makeJob('saved-roles', 'saved-2026', 'Top Pick Role', 'TalentNest', 'hybrid', 13),
    makeJob('saved-roles', 'saved-2026-2', 'Saved Opportunity', 'BrightEdge', 'onsite', 14),
    makeJob('saved-roles', 'saved-2026-3', 'Watchlist Role', 'InnovateX', 'remote', 16),
  ],
  referral: [
    makeJob('referral', 'referral-2026', 'Referral Engineer', 'Loop Networks', 'remote', 9),
    makeJob('referral', 'referral-2026-2', 'Referral Program Lead', 'BridgeWork', 'hybrid', 11),
    makeJob('referral', 'referral-2026-3', 'Community Referral Specialist', 'TalentBridge', 'remote', 12),
  ],
  'application-tracker': [
    makeJob('application-tracker', 'tracker-2026', 'Application Coordinator', 'Trackly', 'hybrid', 14),
    makeJob('application-tracker', 'tracker-2026-2', 'Application Specialist', 'CrossPath', 'onsite', 13),
    makeJob('application-tracker', 'tracker-2026-3', 'Application Workflow Lead', 'PathFinder', 'remote', 15),
  ],
};

export async function GET(request: Request) {
  const category = normalizeCategory(new URL(request.url).searchParams.get('category'));
  if (!category) {
    return NextResponse.json(
      { error: 'Please provide a valid category parameter.' },
      { status: 400 }
    );
  }

  const jobs = mockData[category] || [];
  return NextResponse.json({ jobs, timestamp: new Date().toISOString() });
}
