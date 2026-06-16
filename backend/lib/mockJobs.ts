export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedAt: string;
  remote: boolean;
  experience: string;
  tags: string[];
  description: string;
  applyLink?: string;
  responsibilities: string[];
  requirements: string[];
  about: string;
}

export const jobs: Job[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    company: 'Nova Tech',
    location: 'Remote',
    type: 'Full-time',
    salary: '$110k - $140k',
    postedAt: '2 days ago',
    remote: true,
    experience: '3+ years',
    tags: ['JavaScript', 'React', 'Node.js'],
    description:
      'Build customer-facing features and help scale the platform that serves millions of users every month.',
    applyLink: 'https://example.com/apply/software-engineer',
    responsibilities: [
      'Develop and maintain front-end applications with React.',
      'Collaborate with product and design to ship high-quality user experiences.',
      'Write clean, testable code and participate in code reviews.',
    ],
    requirements: [
      '3+ years of experience in web development.',
      'Strong knowledge of React and TypeScript.',
      'Experience with REST APIs or GraphQL.',
    ],
    about:
      'Nova Tech builds high-growth SaaS products for remote-first teams. Our engineering culture values ownership, clarity, and relentless iteration.',
  },
  {
    id: 'product-designer',
    title: 'Product Designer',
    company: 'Pulse Creative',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$95k - $115k',
    postedAt: '1 week ago',
    remote: false,
    experience: '4+ years',
    tags: ['Figma', 'UX', 'Collaboration'],
    description:
      'Design polished product experiences for enterprise customers and collaborate with product teams to ship intuitive solutions.',
    applyLink: 'https://example.com/apply/product-designer',
    responsibilities: [
      'Lead research and prototyping efforts for new product features.',
      'Create wireframes, high-fidelity visuals, and interaction models.',
      'Partner with engineering to deliver pixel-perfect launches.',
    ],
    requirements: [
      '4+ years of product design experience.',
      'Strong portfolio of SaaS or B2B design work.',
      'Excellent communication and presentation skills.',
    ],
    about:
      'Pulse Creative is a digital studio focused on designing thoughtful user journeys across web and mobile products.',
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    company: 'Bright Insights',
    location: 'Austin, TX',
    type: 'Contract',
    salary: '$80k - $100k',
    postedAt: '3 days ago',
    remote: false,
    experience: '2+ years',
    tags: ['SQL', 'Analytics', 'Dashboard'],
    description:
      'Analyze growth metrics and build dashboards that help teams make better product and marketing decisions.',
    applyLink: 'https://example.com/apply/data-analyst',
    responsibilities: [
      'Build reports and dashboards for cross-functional stakeholders.',
      'Identify trends and surface actionable insights.',
      'Maintain data quality across analytics systems.',
    ],
    requirements: [
      'Strong SQL skills and experience with analytics tools.',
      'Comfort working with product and marketing teams.',
      'Prior experience with reporting in a fast-paced organization.',
    ],
    about:
      'Bright Insights provides analytics and intelligence for teams that need better visibility into customer behavior.',
  },
  {
    id: 'growth-marketing-manager',
    title: 'Growth Marketing Manager',
    company: 'Spark Lane',
    location: 'Remote',
    type: 'Full-time',
    salary: '$98k - $125k',
    postedAt: '5 days ago',
    remote: true,
    experience: '5+ years',
    tags: ['Growth', 'Paid Media', 'Retention'],
    description:
      'Lead growth campaigns across paid acquisition, email, and retention programs to drive revenue and engagement.',
    applyLink: 'https://example.com/apply/growth-marketing-manager',
    responsibilities: [
      'Plan and execute acquisition campaigns across search and social channels.',
      'Optimize onboarding funnels and lifecycle communications.',
      'Collaborate with analytics to measure ROI and lift.',
    ],
    requirements: [
      '5+ years of performance marketing experience.',
      'Strong data-driven mindset and experimentation skills.',
      'Experience with growth tools and customer lifecycle frameworks.',
    ],
    about:
      'Spark Lane helps fast-moving startups build repeatable growth systems and optimized acquisition funnels.',
  },
  {
    id: 'back-end-engineer',
    title: 'Back-end Engineer',
    company: 'Scale Labs',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $145k',
    postedAt: '2 weeks ago',
    remote: false,
    experience: '5+ years',
    tags: ['Node.js', 'APIs', 'Cloud'],
    description:
      'Build resilient server-side systems, APIs, and integrations that power our core product platforms.',
    applyLink: 'https://example.com/apply/back-end-engineer',
    responsibilities: [
      'Design scalable back-end services and API contracts.',
      'Maintain infrastructure and optimize performance.',
      'Collaborate closely with front-end and product teams.',
    ],
    requirements: [
      'Strong experience with Node.js and server-side architecture.',
      'Knowledge of cloud infrastructure and containerized deployments.',
      'Experience working with REST or GraphQL APIs.',
    ],
    about:
      'Scale Labs builds mission-critical infrastructure for businesses that need high-performance backend systems.',
  },
  {
    id: 'customer-success-specialist',
    title: 'Customer Success Specialist',
    company: 'Lattice Path',
    location: 'Chicago, IL',
    type: 'Part-time',
    salary: '$55k - $70k',
    postedAt: '4 days ago',
    remote: false,
    experience: '1+ years',
    tags: ['Support', 'CRM', 'Retention'],
    description:
      'Support customers through onboarding and product adoption, helping them get the most value from our software.',
    applyLink: 'https://example.com/apply/customer-success-specialist',
    responsibilities: [
      'Guide customers through successful onboarding experiences.',
      'Track customer health and proactively solve issues.',
      'Work with product teams to capture feedback and improve workflows.',
    ],
    requirements: [
      'Excellent communication and customer empathy skills.',
      'Experience with CRM or help desk tools.',
      'A collaborative attitude and strong problem-solving skills.',
    ],
    about:
      'Lattice Path delivers customer success programs to ensure customer retention and product adoption.',
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    company: 'Cloud Harbor',
    location: 'Remote',
    type: 'Contract',
    salary: '$115k - $135k',
    postedAt: '1 day ago',
    remote: true,
    experience: '4+ years',
    tags: ['AWS', 'CI/CD', 'Kubernetes'],
    description:
      'Help build and operate cloud infrastructure, automation pipelines, and deployment systems for mission-critical applications.',
    applyLink: 'https://example.com/apply/devops-engineer',
    responsibilities: [
      'Build and maintain CI/CD pipelines and infrastructure automation.',
      'Monitor system reliability and optimize deployments.',
      'Collaborate with engineering teams to improve development workflows.',
    ],
    requirements: [
      'Strong experience with cloud platforms and infrastructure tooling.',
      'Familiarity with container orchestration and deployment automation.',
      'Experience managing reliability and observability systems.',
    ],
    about:
      'Cloud Harbor powers modern engineering teams with reliable cloud infrastructure and deployment tooling.',
  },
];
