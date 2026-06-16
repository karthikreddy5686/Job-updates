import type { CompanyProfile } from '../../types/home';

export const companies: CompanyProfile[] = [
  { name: 'Nova Labs', type: 'AI Studio', location: 'Global', openings: '24 roles' },
  { name: 'Pulse Creative', type: 'Design Agency', location: 'New York, NY', openings: '18 roles' },
  { name: 'Scale Labs', type: 'Platform Company', location: 'Austin, TX', openings: '12 roles' },
  { name: 'Crest Studio', type: 'Product Team', location: 'Remote', openings: '16 roles' },
];

// Default fallback for empty/loading states
export const defaultCompanies: CompanyProfile[] = [];
