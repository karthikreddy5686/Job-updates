import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

type ReferralListing = {
  id: string;
  company: string;
  role: string;
  referrer: string;
  location: string;
  status: string;
};

type ReferralRequest = {
  id: string;
  company: string;
  jobTitle: string;
  jobLink: string;
  message: string;
  resumeLink: string;
  status: 'pending' | 'accepted' | 'declined' | 'fulfilled';
  createdAt: string;
};

const referralListings: ReferralListing[] = [
  {
    id: 'referral-1',
    company: 'Loop Networks',
    role: 'Referral Engineer',
    referrer: 'Rahul Sharma',
    location: 'Remote',
    status: 'open',
  },
  {
    id: 'referral-2',
    company: 'BridgeWork',
    role: 'Referral Program Lead',
    referrer: 'Sarah Jenkins',
    location: 'Hybrid',
    status: 'open',
  },
  {
    id: 'referral-3',
    company: 'TalentBridge',
    role: 'Community Referral Specialist',
    referrer: 'Alex Rivera',
    location: 'Remote',
    status: 'open',
  },
];

const referralRequests: ReferralRequest[] = [
  {
    id: 'req-1',
    company: 'Loop Networks',
    jobTitle: 'Referral Engineer',
    jobLink: 'https://careers.loop.com/referral-engineer',
    message: 'Looking for a strong referral opportunity for this role.',
    resumeLink: 'https://example.com/resume.pdf',
    status: 'pending',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function GET() {
  const companiesHiring = [...new Set(referralListings.map((item) => item.company))];

  return NextResponse.json({
    referrals: referralListings,
    companiesHiring,
    source: 'mock',
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const company = String(body.company || '').trim();
  const jobTitle = String(body.jobTitle || '').trim();
  const jobLink = String(body.jobLink || '').trim();
  const message = String(body.message || '').trim();
  const resumeLink = String(body.resumeLink || '').trim();

  if (!company || !jobTitle || !jobLink) {
    return NextResponse.json(
      { error: 'Company, job title and job link are required' },
      { status: 400 },
    );
  }

  const newRequest: ReferralRequest = {
    id: `req-${Date.now()}`,
    company,
    jobTitle,
    jobLink,
    message,
    resumeLink,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  referralRequests.unshift(newRequest);

  return NextResponse.json(newRequest, { status: 201 });
}
