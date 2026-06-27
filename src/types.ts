export interface PersonalDetails {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link: string;
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
}

export interface AIAnalysis {
  summary: string;
  matchScore: number;
  keyAdjustments: string[];
  jdKeywords: string[];
  isFallback?: boolean;
}

export interface CandidateProfile {
  personalDetails: PersonalDetails;
  education: Education[];
  workExperience: WorkExperience[];
  skills: string[];
  projects: Project[];
  achievements: Achievement[];
  aiAnalysis?: AIAnalysis;
}

export interface Resume {
  id: string;
  title: string;
  targetJobTitle?: string;
  targetCompany?: string;
  profile: CandidateProfile;
  template: string; // 'modern' | 'minimal' | 'tech' | 'executive'
  updatedAt: string;
}

export enum ApplicationStatus {
  Bookmarked = "Bookmarked",
  Applied = "Applied",
  Interview = "Interviewing",
  Offer = "Offer Received",
  Rejected = "Rejected"
}

export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  dateApplied: string;
  salary?: string;
  notes?: string;
  location?: string;
  jobUrl?: string;
  associatedResumeId?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  provider: string; // 'google' | 'email' | etc.
}
