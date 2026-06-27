import React, { useState, useRef, useEffect } from "react";
import { CandidateProfile, Education, WorkExperience, Project, Achievement } from "../types";
import { SAMPLE_PROFILE } from "../data";
import {
  User, BookOpen, Briefcase, Award, FolderGit2, Cpu, Save, RefreshCw,
  Sparkles, AlertCircle, Plus, Trash2, ArrowLeft, ArrowRight, LogOut, Search
} from "lucide-react";

// ── Skill suggestions dictionary ──────────────────────────────────────────────
const SKILL_SUGGESTIONS = [
  // Frontend
  "React","React.js","Next.js","Vue.js","Nuxt.js","Angular","Svelte","SvelteKit",
  "TypeScript","JavaScript","ES6+","HTML5","CSS3","Sass","SCSS",
  "Tailwind CSS","Bootstrap","Material UI","Chakra UI","Ant Design","Shadcn UI",
  "Redux","Redux Toolkit","Zustand","MobX","Recoil","Jotai",
  "React Query","SWR","Apollo Client","GraphQL","REST APIs",
  "Webpack","Vite","Rollup","Parcel","Babel","ESLint","Prettier",
  "Jest","React Testing Library","Cypress","Playwright","Vitest",
  "Web Components","PWA","WebSockets","WebRTC","Three.js","D3.js","Chart.js",
  // Backend
  "Node.js","Express.js","NestJS","Fastify","Hapi.js","Koa.js",
  "Python","Django","FastAPI","Flask","SQLAlchemy",
  "Java","Spring Boot","Spring Framework","Hibernate",
  "Go","Golang","Gin","Echo",
  "Rust","Actix","Axum",
  "PHP","Laravel","Symfony","WordPress",
  "Ruby","Ruby on Rails",
  "C#",".NET","ASP.NET","Entity Framework",
  // Databases
  "PostgreSQL","MySQL","SQLite","MongoDB","DynamoDB","Cassandra","Redis",
  "Elasticsearch","Firebase","Supabase","Prisma","TypeORM","Sequelize","Drizzle ORM",
  // DevOps / Cloud
  "AWS","Amazon Web Services","GCP","Google Cloud Platform","Azure","Microsoft Azure",
  "Docker","Kubernetes","Docker Compose","Helm","Terraform","Ansible","Pulumi",
  "CI/CD","GitHub Actions","Jenkins","CircleCI","GitLab CI","Travis CI",
  "Nginx","Apache","Linux","Bash","Shell Scripting",
  "Prometheus","Grafana","Datadog","Sentry",
  "Vercel","Netlify","Heroku","Railway","Render",
  "AWS S3","AWS EC2","AWS Lambda","AWS RDS","AWS ECS","AWS EKS","AWS CloudFront",
  // Mobile
  "React Native","Flutter","Swift","SwiftUI","Kotlin","Expo","Android Development","iOS Development",
  // Data / AI / ML
  "PyTorch","TensorFlow","Keras","Scikit-learn","Pandas","NumPy","Matplotlib",
  "Machine Learning","Deep Learning","Neural Networks","NLP","Computer Vision","OpenCV",
  "LangChain","OpenAI API","Hugging Face","Transformers",
  "Apache Spark","Kafka","Apache Airflow","Jupyter",
  "R","MATLAB",
  // Tools
  "Git","GitHub","GitLab","Bitbucket",
  "Jira","Confluence","Notion","Trello","Linear","Asana",
  "Figma","Adobe XD","Sketch","InVision",
  "Postman","Swagger","OpenAPI","gRPC",
  "VS Code","IntelliJ IDEA","PyCharm","WebStorm",
  "Agile","Scrum","Kanban","Microservices","OAuth","JWT",
  "Stripe","Twilio","SendGrid","Storybook","GraphQL API",
];

// ── Skills Tab sub-component ──────────────────────────────────────────────────
function SkillsTab({ skills, onAdd, onRemove }: {
  skills: string[];
  onAdd: (s: string) => void;
  onRemove: (s: string) => void;
}) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = input.trim().length > 0
    ? SKILL_SUGGESTIONS.filter(s =>
        s.toLowerCase().includes(input.toLowerCase()) && !skills.includes(s)
      ).slice(0, 6)
    : [];

  const showManual = input.trim().length > 0 && !SKILL_SUGGESTIONS.some(
    s => s.toLowerCase() === input.trim().toLowerCase()
  ) && !skills.includes(input.trim());

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pick = (skill: string) => {
    onAdd(skill);
    setInput("");
    setOpen(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filtered.length > 0) { pick(filtered[0]); }
      else if (input.trim()) { pick(input.trim()); }
    }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Cpu className="text-indigo-500 w-5 h-5" />
        Key Skills & Core Tech Stack
      </h3>

      <div className="rounded-2xl p-5 space-y-4" style={{ background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)", border: "1px solid #e0e7ff" }}>
        {/* Search input with suggestions */}
        <div ref={wrapperRef} className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-indigo-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Type a skill (e.g. Kube → Kubernetes, Rea → React)..."
              value={input}
              onChange={e => { setInput(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKey}
              className="w-full bg-white border border-indigo-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 transition shadow-sm"
            />
            {input && (
              <button
                type="button"
                onClick={() => { setInput(""); setOpen(false); }}
                className="absolute right-3.5 text-slate-300 hover:text-slate-500 text-lg leading-none cursor-pointer"
              >×</button>
            )}
          </div>

          {/* Dropdown */}
          {open && (filtered.length > 0 || showManual) && (
            <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-indigo-100 overflow-hidden">
              {filtered.map(s => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={() => pick(s)}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition flex items-center gap-2 border-b border-slate-50 last:border-0 cursor-pointer"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  {s}
                </button>
              ))}
              {showManual && (
                <button
                  type="button"
                  onMouseDown={() => pick(input.trim())}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold transition flex items-center gap-2 cursor-pointer border-t border-indigo-50"
                  style={{ color: "#6366f1", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "linear-gradient(135deg, #f5f3ff, #eef2ff)" }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add &ldquo;{input.trim()}&rdquo; as custom skill
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-[11px] text-indigo-400">Press <kbd className="bg-white border border-indigo-200 px-1.5 py-0.5 rounded text-[10px] font-mono text-indigo-500">Enter</kbd> to add top suggestion, or click from the list. Click any chip below to remove it.</p>

        {skills.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-indigo-200 rounded-xl text-indigo-300 text-sm bg-white/60">
            Start typing above to add skills to your profile.
          </div>
        ) : (
          <div>
            <span className="block text-indigo-400 text-[10px] font-bold mb-2.5 uppercase tracking-widest">Current Skill Set ({skills.length})</span>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => onRemove(skill)}
                  className="text-indigo-600 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-medium hover:text-red-500 hover:bg-red-50"
                  style={{ background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", border: "1px solid #c7d2fe" }}
                  title="Click to remove"
                >
                  {skill}
                  <span className="text-[10px] opacity-60">×</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProfileSetupProps {
  initialProfile?: CandidateProfile | null;
  onSave: (profile: CandidateProfile) => void;
  onCancel?: () => void;
  onLogout?: () => void;
  isFirstTime?: boolean;
}

export default function ProfileSetup({
  initialProfile,
  onSave,
  onCancel,
  onLogout,
  isFirstTime = false,
}: ProfileSetupProps) {
  // Use SAMPLE_PROFILE as a fallback starter or load initialProfile
  const [profile, setProfile] = useState<CandidateProfile>(() => {
    if (initialProfile && initialProfile.personalDetails?.name) {
      return initialProfile;
    }
    // Return a neat clean structure by default
    return {
      personalDetails: { name: "", email: "", phone: "", location: "", linkedin: "", website: "" },
      education: [],
      workExperience: [],
      skills: [],
      projects: [],
      achievements: []
    };
  });

  const [activeTab, setActiveTab] = useState<"personal" | "education" | "work" | "skills" | "projects" | "achievements">("personal");
  const [skillInput, setSkillInput] = useState("");

  const loadSamplePreset = () => {
    if (confirm("This will populate the form with a premium pre-filled Sample Developer Profile. Proceed?")) {
      setProfile(structuredClone(SAMPLE_PROFILE));
    }
  };

  const handlePersonalChange = (field: keyof typeof profile.personalDetails, value: string) => {
    setProfile(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value
      }
    }));
  };

  // Education Helpers
  const addEducation = () => {
    const newEdu: Education = { school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", grade: "", description: "" };
    setProfile(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setProfile(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const removeEducation = (index: number) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Work Helpers
  const addWork = () => {
    const newWork: WorkExperience = { company: "", position: "", startDate: "", endDate: "", location: "", description: "" };
    setProfile(prev => ({ ...prev, workExperience: [...prev.workExperience, newWork] }));
  };

  const updateWork = (index: number, field: keyof WorkExperience, value: string) => {
    setProfile(prev => {
      const updated = [...prev.workExperience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, workExperience: updated };
    });
  };

  const removeWork = (index: number) => {
    setProfile(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  // Skills Helpers
  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Projects Helpers
  const addProject = () => {
    const newProj: Project = { title: "", description: "", technologies: [], link: "" };
    setProfile(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    setProfile(prev => {
      const updated = [...prev.projects];
      if (field === "technologies") {
        updated[index] = { ...updated[index], technologies: typeof value === "string" ? value.split(",").map((s: string) => s.trim()) : value };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, projects: updated };
    });
  };

  const removeProject = (index: number) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Achievements Helpers
  const addAchievement = () => {
    const newAch: Achievement = { title: "", description: "", date: "" };
    setProfile(prev => ({ ...prev, achievements: [...prev.achievements, newAch] }));
  };

  const updateAchievement = (index: number, field: keyof Achievement, value: string) => {
    setProfile(prev => {
      const updated = [...prev.achievements];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, achievements: updated };
    });
  };

  const removeAchievement = (index: number) => {
    setProfile(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  // Submission
  const handleSaveAll = () => {
    if (!profile.personalDetails.name || !profile.personalDetails.email) {
      alert("Name and Email are mandatory fields under Personal Details.");
      setActiveTab("personal");
      return;
    }
    onSave(profile);
  };

  // Navigation tabs
  const tabs = [
    { id: "personal", label: "Personal Details", icon: User },
    { id: "education", label: "Education", icon: BookOpen },
    { id: "work", label: "Work Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Cpu },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "achievements", label: "Achievements", icon: Award }
  ] as const;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)" }}>

      {/* Header */}
      <div className="sticky top-0 z-10 shadow-lg" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center gap-4">
          <div className="min-w-0 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg" style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa)" }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {isFirstTime ? "Build Your Master Profile" : "Edit Master Profile"}
              </h1>
              <p className="text-[10px] text-indigo-300 hidden sm:block">
                Your profile is the AI's source of truth for generating tailored resumes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isFirstTime && (
              <button
                type="button"
                onClick={loadSamplePreset}
                className="text-indigo-200 hover:text-white text-xs font-medium px-3 py-2 rounded-lg border border-indigo-700 hover:border-indigo-400 transition items-center gap-1.5 cursor-pointer hidden md:flex bg-indigo-900/40 hover:bg-indigo-800/60"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Fill Sample Data
              </button>
            )}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-indigo-200 hover:text-white text-xs px-3 py-2 rounded-lg border border-indigo-700 hover:border-indigo-400 transition cursor-pointer hidden sm:block bg-indigo-900/40 hover:bg-indigo-800/60"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveAll}
              className="text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer shadow-lg"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save Master Profile</span>
              <span className="sm:hidden">Save</span>
            </button>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="text-indigo-300 hover:text-red-300 text-xs px-3 py-2 rounded-lg border border-indigo-700 hover:border-red-700 transition flex items-center gap-1.5 cursor-pointer bg-indigo-900/40"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:items-start">

          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 lg:self-start space-y-4">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-indigo-100">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3.5 text-sm transition border-b border-slate-100 last:border-0 cursor-pointer ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 font-medium"
                    }`}
                    style={isActive ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", fontFamily: "'Plus Jakarta Sans', sans-serif" } : { fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-indigo-400"}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl p-4 text-xs space-y-1" style={{ background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", border: "1px solid #c7d2fe" }}>
              <div className="flex items-center gap-2 font-bold text-indigo-700 mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                Pro Tip
              </div>
              <p className="text-indigo-600 leading-relaxed">Fill all sections thoroughly — richer details give AI more context for higher ATS scores.</p>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-md border border-indigo-50 p-6 md:p-8 min-h-[600px]">
            
            {/* Tab 1: Personal Details */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <User className="text-blue-600 w-5 h-5" />
                  Personal Details
                </h3>
                <div className="p-5 rounded-2xl space-y-4" style={{ background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)", border: "1px solid #e0e7ff" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-indigo-500 text-[10px] font-bold mb-1.5 uppercase tracking-widest">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Alex Rivera"
                      value={profile.personalDetails.name}
                      onChange={(e) => handlePersonalChange("name", e.target.value)}
                      className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-indigo-500 text-[10px] font-bold mb-1.5 uppercase tracking-widest">Email Address *</label>
                    <input
                      type="email"
                      placeholder="alex.rivera@example.com"
                      value={profile.personalDetails.email}
                      onChange={(e) => handlePersonalChange("email", e.target.value)}
                      className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-indigo-500 text-[10px] font-bold mb-1.5 uppercase tracking-widest">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={profile.personalDetails.phone}
                      onChange={(e) => handlePersonalChange("phone", e.target.value)}
                      className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-indigo-500 text-[10px] font-bold mb-1.5 uppercase tracking-widest">Location (City, State)</label>
                    <input
                      type="text"
                      placeholder="Austin, TX"
                      value={profile.personalDetails.location}
                      onChange={(e) => handlePersonalChange("location", e.target.value)}
                      className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-indigo-500 text-[10px] font-bold mb-1.5 uppercase tracking-widest">LinkedIn Link</label>
                    <input
                      type="text"
                      placeholder="linkedin.com/in/username"
                      value={profile.personalDetails.linkedin}
                      onChange={(e) => handlePersonalChange("linkedin", e.target.value)}
                      className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-indigo-500 text-[10px] font-bold mb-1.5 uppercase tracking-widest">Personal Portfolio Link</label>
                    <input
                      type="text"
                      placeholder="myportfolio.dev"
                      value={profile.personalDetails.website}
                      onChange={(e) => handlePersonalChange("website", e.target.value)}
                      className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                    />
                  </div>
                </div>
                </div>
              </div>
            )}

            {/* Tab 2: Education */}
            {activeTab === "education" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <BookOpen className="text-blue-600 w-5 h-5" />
                    Academic Education
                  </h3>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer text-indigo-600 hover:text-white" style={{ background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", border: "1px solid #c7d2fe" }} onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderColor: "transparent" })} onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", borderColor: "#c7d2fe" })}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add School
                  </button>
                </div>

                <div className="rounded-2xl p-5 space-y-4" style={{ background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)", border: "1px solid #e0e7ff" }}>
                {profile.education.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-indigo-200 rounded-2xl text-indigo-300 bg-white/60">
                    No education records added yet. Click &quot;Add School&quot; to get started.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {profile.education.map((edu, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 relative space-y-4 shadow-sm">
                        <button
                          type="button"
                          onClick={() => removeEducation(idx)}
                          className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1 rounded-md transition cursor-pointer"
                          title="Remove Education"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="font-bold text-xs uppercase w-fit px-2.5 py-1 rounded-lg text-blue-700" style={{ background: "linear-gradient(135deg, #dbeafe, #ede9fe)", border: "1px solid #bfdbfe" }}>
                          School Record #{idx + 1}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Institution Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Stanford University"
                              value={edu.school}
                              onChange={(e) => updateEducation(idx, "school", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Degree (e.g., BS, MS, PhD)</label>
                            <input
                              type="text"
                              placeholder="Bachelor of Science"
                              value={edu.degree}
                              onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Field of Study</label>
                            <input
                              type="text"
                              placeholder="Computer Science"
                              value={edu.fieldOfStudy}
                              onChange={(e) => updateEducation(idx, "fieldOfStudy", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Start Date</label>
                              <input
                                type="month"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(idx, "startDate", e.target.value)}
                                className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">End Date / Expected</label>
                              <input
                                type="month"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(idx, "endDate", e.target.value)}
                                className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Grade GPA / Percentile</label>
                            <input
                              type="text"
                              placeholder="3.8 GPA"
                              value={edu.grade}
                              onChange={(e) => updateEducation(idx, "grade", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Notable Accomplishments / Honors</label>
                            <textarea
                              placeholder="Summa Cum Laude, Dean's List..."
                              value={edu.description}
                              onChange={(e) => updateEducation(idx, "description", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm min-h-[50px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </div>
            )}

            {/* Tab 3: Work Experience */}
            {activeTab === "work" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <Briefcase className="text-blue-600 w-5 h-5" />
                    Employment Experience
                  </h3>
                  <button
                    type="button"
                    onClick={addWork}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer text-indigo-600 hover:text-white" style={{ background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", border: "1px solid #c7d2fe" }} onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderColor: "transparent" })} onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", borderColor: "#c7d2fe" })}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Job
                  </button>
                </div>

                <div className="rounded-2xl p-5 space-y-4" style={{ background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)", border: "1px solid #e0e7ff" }}>
                {profile.workExperience.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-indigo-200 rounded-2xl text-indigo-300 bg-white/60">
                    No historical work experience added yet. Click &quot;Add Job&quot; to define your track record.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {profile.workExperience.map((work, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 relative space-y-4 shadow-sm">
                        <button
                          type="button"
                          onClick={() => removeWork(idx)}
                          className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1 rounded-md transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="font-bold text-xs uppercase w-fit px-2.5 py-1 rounded-lg text-emerald-700" style={{ background: "linear-gradient(135deg, #d1fae5, #ecfdf5)", border: "1px solid #6ee7b7" }}>
                          Employment Record #{idx + 1}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Company Name</label>
                            <input
                              type="text"
                              required
                              placeholder="Innovate Tech Corp"
                              value={work.company}
                              onChange={(e) => updateWork(idx, "company", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Role / Position</label>
                            <input
                              type="text"
                              required
                              placeholder="Associate Software Engineer"
                              value={work.position}
                              onChange={(e) => updateWork(idx, "position", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Location</label>
                            <input
                              type="text"
                              placeholder="San Francisco, CA or Remote"
                              value={work.location}
                              onChange={(e) => updateWork(idx, "location", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Start Date</label>
                              <input
                                type="month"
                                value={work.startDate}
                                onChange={(e) => updateWork(idx, "startDate", e.target.value)}
                                className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">End Date / Present</label>
                              <input
                                type="text"
                                placeholder="Present or month-year"
                                value={work.endDate}
                                onChange={(e) => updateWork(idx, "endDate", e.target.value)}
                                className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                              />
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-slate-400 text-xs font-semibold mb-1 uppercase flex justify-between">
                              <span>Responsibilities & Key Metrics (bullet points)</span>
                              <span className="text-slate-500 lowercase normal-case">One bullet per line</span>
                            </label>
                            <textarea
                              required
                              placeholder="e.g. Worked with React/TypeScript on the core analytics table, reducing queries by 30%.&#10;Launched key server pipelines."
                              value={work.description}
                              onChange={(e) => updateWork(idx, "description", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm min-h-[90px] font-sans"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </div>
            )}

            {/* Tab 4: Skills */}
            {activeTab === "skills" && (
              <SkillsTab
                skills={profile.skills}
                onAdd={(s) => setProfile(prev => ({ ...prev, skills: prev.skills.includes(s) ? prev.skills : [...prev.skills, s] }))}
                onRemove={removeSkill}
              />
            )}

            {/* Tab 5: Projects */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <FolderGit2 className="text-blue-600 w-5 h-5" />
                    Personal Projects
                  </h3>
                  <button
                    type="button"
                    onClick={addProject}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer text-indigo-600 hover:text-white" style={{ background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", border: "1px solid #c7d2fe" }} onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderColor: "transparent" })} onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", borderColor: "#c7d2fe" })}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>

                <div className="rounded-2xl p-5 space-y-4" style={{ background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)", border: "1px solid #e0e7ff" }}>
                {profile.projects.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-indigo-200 rounded-2xl text-indigo-300 bg-white/60">
                    No individual project portfolios detailed yet. Click &quot;Add Project&quot; to represent practical builds.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {profile.projects.map((proj, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 relative space-y-4 shadow-sm">
                        <button
                          type="button"
                          onClick={() => removeProject(idx)}
                          className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1 rounded-md transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="font-bold text-xs uppercase w-fit px-2.5 py-1 rounded-lg text-purple-700" style={{ background: "linear-gradient(135deg, #ede9fe, #fae8ff)", border: "1px solid #c4b5fd" }}>
                          Project Record #{idx + 1}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Project Title</label>
                            <input
                              type="text"
                              placeholder="Collaborative Task Canvas"
                              value={proj.title}
                              onChange={(e) => updateProject(idx, "title", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Project/Demo Link</label>
                            <input
                              type="text"
                              placeholder="github.com/profile/repo"
                              value={proj.link}
                              onChange={(e) => updateProject(idx, "link", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Technologies Used (comma separated)</label>
                            <input
                              type="text"
                              placeholder="React, TypeScript, Tailwind CSS, WebSockets"
                              value={proj.technologies.join(", ")}
                              onChange={(e) => updateProject(idx, "technologies", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Brief Description</label>
                            <textarea
                              placeholder="Explain what has been accomplished, key challenges resolved..."
                              value={proj.description}
                              onChange={(e) => updateProject(idx, "description", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm min-h-[60px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </div>
            )}

            {/* Tab 6: Achievements */}
            {activeTab === "achievements" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <Award className="text-blue-600 w-5 h-5" />
                    Achievements & Honors
                  </h3>
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer text-indigo-600 hover:text-white" style={{ background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", border: "1px solid #c7d2fe" }} onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderColor: "transparent" })} onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", borderColor: "#c7d2fe" })}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Distinction
                  </button>
                </div>

                <div className="rounded-2xl p-5 space-y-4" style={{ background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)", border: "1px solid #e0e7ff" }}>
                {profile.achievements.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-indigo-200 rounded-2xl text-indigo-300 bg-white/60">
                    No custom honors specified yet. Click &quot;Add Distinction&quot; to state academic or professional accolades.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {profile.achievements.map((ach, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 relative space-y-4 shadow-sm">
                        <button
                          type="button"
                          onClick={() => removeAchievement(idx)}
                          className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1 rounded-md transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Title / Accolade Name</label>
                            <input
                              type="text"
                              placeholder="CalHacks 2022 Finalist"
                              value={ach.title}
                              onChange={(e) => updateAchievement(idx, "title", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Date Received</label>
                            <input
                              type="text"
                              placeholder="October 2022"
                              value={ach.date}
                              onChange={(e) => updateAchievement(idx, "date", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-indigo-500 text-[10px] font-bold mb-1 uppercase tracking-widest">Accolade Context / Brief Details</label>
                            <textarea
                              placeholder="e.g. Secured Top 10 placing out of 350 entries..."
                              value={ach.description}
                              onChange={(e) => updateAchievement(idx, "description", e.target.value)}
                              className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition shadow-sm min-h-[50px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </div>
            )}

            {/* Stepper Buttons inside Content area */}
            <div className="flex justify-between items-center pt-6 border-t border-indigo-100 mt-8">
              <button
                type="button"
                disabled={activeTab === "personal"}
                onClick={() => {
                  const idx = tabs.findIndex(t => t.id === activeTab);
                  if (idx > 0) setActiveTab(tabs[idx - 1].id as any);
                }}
                className="bg-white hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 hover:text-indigo-600 border border-indigo-100 text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-1 cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              
              <button
                type="button"
                className="text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ml-auto shadow-lg" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                onClick={() => {
                  const idx = tabs.findIndex(t => t.id === activeTab);
                  if (idx < tabs.length - 1) {
                    setActiveTab(tabs[idx + 1].id as any);
                  } else {
                    handleSaveAll();
                  }
                }}
              >
                {activeTab === "achievements" ? "Complete & Save" : "Next Section"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
