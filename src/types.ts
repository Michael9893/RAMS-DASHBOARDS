export type Language = 'en' | 'fil' | 'ceb';

export interface SearchResult {
  id: string;
  title: Record<Language, string>;
  url: string;
  snippet: Record<Language, string>;
  category: 'all' | 'programs' | 'requirements' | 'eligibility' | 'news';
  tags: string[];
  faqs?: {
    question: Record<Language, string>;
    answer: Record<Language, string>;
  }[];
}

export interface DswdProgram {
  id: string;
  name: Record<Language, string>;
  acronym: string;
  tagline: Record<Language, string>;
  description: Record<Language, string>;
  benefits: Record<Language, string[]>;
  eligibility: Record<Language, string[]>;
  requirements: Record<Language, string[]>;
  steps: Record<Language, string[]>;
  color: string;
  tags?: string[];
}

export interface SearchQueryDetails {
  query: string;
  voiceActive?: boolean;
  lensActive?: boolean;
}

export interface Application {
  id: string;
  programId: string;
  programName: string;
  applicantName: string;
  age: number;
  location: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Disbursed';
  date: string;
  referenceCode: string;
}
