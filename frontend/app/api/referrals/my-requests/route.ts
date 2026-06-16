import { NextResponse } from 'next/server';

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

const myReferralRequests: ReferralRequest[] = [
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
  return NextResponse.json(myReferralRequests);
}
