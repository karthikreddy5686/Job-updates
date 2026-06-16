const fs = require('fs');

const topMNCs = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Adobe', 'Oracle', 'IBM', 'Cisco',
  'Intel', 'SAP', 'Salesforce', 'VMware', 'Intuit', 'Uber', 'Airbnb', 'Atlassian', 'LinkedIn', 'Zoom',
  'Stripe', 'PayPal', 'Dropbox', 'Spotify', 'Snap', 'Pinterest', 'Palantir', 'Snowflake', 'Databricks', 'ServiceNow',
  'Workday', 'HP', 'Dell', 'TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant', 'Capgemini',
  'Accenture', 'Deloitte', 'EY', 'PwC', 'KPMG', 'Goldman Sachs', 'JPMorgan', 'Morgan Stanley', 'Barclays', 'Citibank'
];

const categories = ['Tech', 'Management', 'General'];

const baseQuestions = [
  {
    text: "Which of the following sorting algorithms has the best average-case time complexity?",
    options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
    correctAnswer: 2,
    explanation: "Merge Sort has an average-case time complexity of O(n log n), which is optimal for comparison sorts."
  },
  {
    text: "What does ACID stand for in the context of database transactions?",
    options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Completeness, Isolation, Durability", "Atomicity, Concurrency, Isolation, Durability", "Association, Consistency, Isolation, Dependency"],
    correctAnswer: 0,
    explanation: "ACID properties ensure reliable processing of database transactions."
  },
  {
    text: "In React, which hook is used to perform side effects?",
    options: ["useState", "useEffect", "useMemo", "useContext"],
    correctAnswer: 1,
    explanation: "useEffect is specifically designed to handle side effects in React functional components."
  },
  {
    text: "What is the primary purpose of a load balancer?",
    options: ["To encrypt web traffic", "To distribute incoming network traffic across multiple servers", "To store session data", "To mitigate SQL injection attacks"],
    correctAnswer: 1,
    explanation: "Load balancers distribute traffic across multiple servers to ensure high availability and reliability."
  },
  {
    text: "Which of the following is NOT a fundamental principle of Object-Oriented Programming?",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Compilation"],
    correctAnswer: 3,
    explanation: "Compilation is a process of translating code, not an OOP principle like Encapsulation, Inheritance, or Polymorphism."
  }
];

const data = topMNCs.map((company, index) => {
  const domain = company.toLowerCase().replace(/ /g, '') + '.com';
  const category = categories[index % 3];
  
  // Pick 3 random questions from baseQuestions
  const questions = [
    baseQuestions[index % 5],
    baseQuestions[(index + 1) % 5],
    baseQuestions[(index + 2) % 5]
  ].map((q, qIndex) => ({
    id: `q${qIndex + 1}`,
    ...q
  }));

  let title = 'Software Engineer';
  if (category === 'Management') title = 'Business Analyst';
  if (category === 'General') title = 'Aptitude Test';

  return {
    id: `${company.toLowerCase().replace(/ /g, '-')}-${title.toLowerCase().replace(/ /g, '-')}`,
    title,
    company,
    category,
    logoUrl: `https://logo.clearbit.com/${domain}`,
    durationMinutes: 15,
    questions
  };
});

const fileContent = `export type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
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

export const mockTestsData: MockTest[] = ${JSON.stringify(data, null, 2)};
`;

fs.writeFileSync('C:/Job updates/data/mockTestsData.ts', fileContent);
console.log('Successfully generated 50 MNCs mock data!');
