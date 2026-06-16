export type Question = {
  id: string;
  text: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  section?: string;
  type?: 'coding' | 'multiple-choice' | string;
  initialCode?: string;
  testCases?: Array<{ input: string; expectedOutput: string }>;
};

export interface MockTest {
  id: string;
  title: string;
  company: string;
  category: 'Tech' | 'Management' | 'General';
  logoUrl: string;
  durationMinutes: number;
  questions: Question[];
}

import mockTestsJson from './mockTestsData.json';
export const mockTestsData: MockTest[] = mockTestsJson as MockTest[];
