import type { DailyCategory } from '@/types/jobs';

const MNC_COMPANIES = [
  'google',
  'microsoft',
  'amazon',
  'apple',
  'ibm',
  'oracle',
  'accenture',
  'deloitte',
  'infosys',
  'tcs',
  'wipro',
  'capgemini',
  'cisco',
  'huawei',
  'samsung',
  'jpmorgan',
  'barclays',
  'goldman',
  'morgan stanley',
  'mastercard',
  'visa',
  'ernst & young',
  'kpmg',
  'adp',
  'pepsi',
  'procter',
  'unilever',
];

const STARTUP_SIGNALS = [
  'startup',
  'angel',
  'wellfound',
  'seed',
  'series a',
  'series b',
  'series c',
  'early-stage',
  'early stage',
  'founder',
  'bootstrapped',
  'y combinator',
];

const textFor = (title: string, company: string, description: string | undefined, tags: string[] | undefined, source: string) => {
  return [title, company, description, ...(tags || []), source].join(' ').toLowerCase();
};

export function classifyDailyCategory(
  title: string,
  company: string,
  description?: string,
  tags?: string[],
  source?: string,
): DailyCategory | undefined {
  const normalizedSource = source?.toLowerCase() ?? '';
  const text = textFor(title, company, description, tags, normalizedSource);

  if (/(intern\b|trainee|apprentice)/.test(text)) {
    return 'internship';
  }

  if (/(govt|psu|upsc|ssc|railway|municipal|ministry|public sector|state government|central government)/.test(text)) {
    return 'government';
  }

  if (/(mba|cat|management trainee|business analyst|strategy|consulting|consultant)/.test(text)) {
    return 'cat-mba';
  }

  if (/(bank|ibps|sbi|rbi|finance|nbfc|insurance|loan|credit union|mortgage|investment banking)/.test(text)) {
    return 'banking';
  }

  if (STARTUP_SIGNALS.some((signal) => text.includes(signal))) {
    return 'startup';
  }

  if (MNC_COMPANIES.some((companyName) => text.includes(companyName))) {
    return 'mnc';
  }

  if (normalizedSource.includes('angel') || normalizedSource.includes('wellfound')) {
    return 'startup';
  }

  return undefined;
}
