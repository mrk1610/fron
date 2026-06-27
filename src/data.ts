import { CandidateProfile } from "./types";

export const SAMPLE_PROFILE: CandidateProfile = {
  personalDetails: {
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexrivera-dev",
    website: "alexrivera.io"
  },
  education: [
    {
      school: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2019-09",
      endDate: "2023-05",
      grade: "3.8 GPA",
      description: "Specialized in Software Engineering and Human-Computer Interaction. Teaching assistant for Introductory Data Structures."
    }
  ],
  workExperience: [
    {
      company: "Innovate Tech Corp",
      position: "Associate Software Engineer",
      startDate: "2023-06",
      endDate: "Present",
      location: "San Francisco, CA",
      description: "- Engineered reactive frontend components using React and TypeScript, increasing dashboard loading performance by 25%.\n- Collaborated in a 6-person Agile team to construct RESTful microservices backends using Node.js and Express.\n- Wrote comprehensive unit and integration tests using Jest, boosting codebase coverage and reducing regressions by 15%."
    },
    {
      company: "ByteSized Solutions",
      position: "Software Engineering Intern",
      startDate: "2022-06",
      endDate: "2022-09",
      location: "Remote",
      description: "- Designed and deployed an automated customer notification pipeline using AWS Lambda and Python, cutting notification delays by over 45%.\n- Refactored stale custom CSS components to responsive Tailwind utility configurations, modernizing layout aesthetics."
    }
  ],
  skills: [
    "React",
    "TypeScript",
    "JavaScript (ES6+)",
    "Node.js",
    "Tailwind CSS",
    "RESTful APIs",
    "Git & GitHub",
    "AWS",
    "Python",
    "Jest"
  ],
  projects: [
    {
      title: "Collaborative Task Canvas",
      description: "Built a drag-and-drop kanban platform enabling fast status modifications and direct collaborative notes updates with webhooks.",
      technologies: ["React", "Custom Context API", "Vite", "Tailwind CSS"],
      link: "github.com/alexrivera/canvas-tasks"
    },
    {
      title: "Serverless Metrics Dashboard",
      description: "Created clean analytical dashboards showcasing database metrics, server responsiveness, and API latency charts.",
      technologies: ["Node.js", "Chart.js", "AWS CloudWatch"],
      link: "github.com/alexrivera/aws-dashboard"
    }
  ],
  achievements: [
    {
      title: "CalHacks 2022 Finalist",
      description: "Secured Top 10 placing out of 350+ entries by designing a live text summarizer overlay for classrooms.",
      date: "2022-10"
    },
    {
      title: "Dean's Honor List",
      description: "Awarded all 4 years at UC Berkeley for maintaining a high continuous academic GPA.",
      date: "2023-05"
    }
  ],
  aiAnalysis: {
    summary: "Dynamic Associate Software Engineer with proven skills in high-performance frontend frameworks, microservices engineering, and cloud deployment pipelines.",
    matchScore: 90,
    keyAdjustments: ["Matched default standards to standard developer profile"],
    jdKeywords: ["React", "TypeScript", "Microservices"]
  }
};
