import { useState, useEffect, useRef } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import * as db from "./lib/db";
import { User, CandidateProfile, Resume, JobApplication } from "./types";
import AuthScreen from "./components/AuthScreen";
import ProfileSetup from "./components/ProfileSetup";
import ResumeBuilder from "./components/ResumeBuilder";
import TrackerBoard from "./components/TrackerBoard";
import ResumeTemplates from "./components/ResumeTemplates";
import AtsPresets from "./components/AtsPresets";
import ResumeTemplatesGallery from "./components/ResumeTemplatesGallery";
import UserSettings from "./components/UserSettings";
import {
  Sparkles, Plus, LogOut, Briefcase, Award, FileText, CheckCircle2,
  MapPin, LayoutDashboard, Database, Layers, Trash2, Settings, RefreshCw
} from "lucide-react";

function mapUser(u: SupabaseUser): User {
  return {
    id: u.id,
    email: u.email || "",
    name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0].toUpperCase() || "User",
    provider: u.app_metadata?.provider || "email",
  };
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const [masterProfile, setMasterProfile] = useState<CandidateProfile | null>(null);
  const [isSettingUpProfile, setIsSettingUpProfile] = useState(false);

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const [activeTab, setActiveTab] = useState<"dashboard" | "gallery" | "generate" | "tracker">("dashboard");
  const [selectedResumeForPreview, setSelectedResumeForPreview] = useState<Resume | null>(null);

  const [selectedJobPreset, setSelectedJobPreset] = useState<string>("");
  const [selectedPromptPreset, setSelectedPromptPreset] = useState<string>("");
  const [selectedGalleryTemplateId, setSelectedGalleryTemplateId] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Bug #11: track current user ID in a ref so onAuthStateChange can detect re-auth vs new sign-in
  const currentUserIdRef = useRef<string | null>(null);
  useEffect(() => {
    currentUserIdRef.current = user?.id ?? null;
  }, [user]);

  const loadUserData = async (userId: string) => {
    const [profile, userResumes, userApps] = await Promise.all([
      db.fetchProfile(userId),
      db.fetchResumes(userId),
      db.fetchApplications(userId),
    ]);
    setMasterProfile(profile);
    setResumes(userResumes);
    setApplications(userApps);
  };

  // ── Browser back/forward support ─────────────────────────────────────────
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const state = e.state as Record<string, string> | null;
      if (!state) return;
      if (state.view === "profile-setup") {
        setIsSettingUpProfile(true);
        setSelectedResumeForPreview(null);
      } else if (state.tab) {
        setIsSettingUpProfile(false);
        setActiveTab(state.tab as typeof activeTab);
        setSelectedResumeForPreview(null);
      } else if (state.view === "resume-preview") {
        // nothing — preview is driven by selectedResumeForPreview which we don't persist
        setSelectedResumeForPreview(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Push a history entry whenever the visible "page" changes
  useEffect(() => {
    if (isSettingUpProfile) {
      window.history.pushState({ view: "profile-setup" }, "", "?view=profile-setup");
    }
  }, [isSettingUpProfile]);

  useEffect(() => {
    if (!isSettingUpProfile && !isInitializing) {
      window.history.pushState({ tab: activeTab }, "", `?tab=${activeTab}`);
    }
  }, [activeTab, isSettingUpProfile, isInitializing]);

  useEffect(() => {
    if (selectedResumeForPreview) {
      window.history.pushState({ view: "resume-preview", tab: "dashboard" }, "", "?tab=dashboard&preview=1");
    }
  }, [selectedResumeForPreview]);

  useEffect(() => {
    // Check for existing session on mount
    // Bug #1: ensure setIsInitializing(false) always runs even if loadUserData throws
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      try {
        if (session?.user) {
          setUser(mapUser(session.user));
          await loadUserData(session.user.id);
        }
      } catch (err) {
        console.error("Failed to load user data on session restore:", err);
      } finally {
        setIsInitializing(false);
      }
    });

    // Listen for future auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(mapUser(session.user));
        // Bug #11: skip redundant loadUserData when signInWithPassword re-auth fires SIGNED_IN
        if (session.user.id !== currentUserIdRef.current) {
          try {
            await loadUserData(session.user.id);
          } catch (err) {
            console.error("Failed to load user data on sign in:", err);
          }
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setMasterProfile(null);
        setResumes([]);
        setApplications([]);
        window.history.replaceState(null, "", "/");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSelectPreset = (title: string, customPrompt: string) => {
    setSelectedJobPreset(title);
    setSelectedPromptPreset(customPrompt);
    setSelectedGalleryTemplateId("");
    setActiveTab("generate");
  };

  const handleUseTemplate = (templateId: string) => {
    setSelectedGalleryTemplateId(templateId);
    setSelectedJobPreset("");
    setSelectedPromptPreset("");
    setActiveTab("generate");
  };

  const handleLogout = async () => {
    if (confirm("Sign out? Your data is saved to your account.")) {
      await supabase.auth.signOut();
    }
  };

  const handleSaveMasterProfile = async (profile: CandidateProfile) => {
    // Bug #2: DB write first — don't close setup UI if save fails
    if (user) {
      try {
        await db.upsertProfile(user.id, profile);
      } catch {
        alert("Failed to save profile. Please try again.");
        return;
      }
    }
    setMasterProfile(profile);
    setIsSettingUpProfile(false);
  };

  const handleSaveNewResume = async (newResume: Resume) => {
    // Bug #4: persist to DB first — prevent ghost resume if DB write fails
    if (user) {
      try {
        await db.insertResume(user.id, newResume);
      } catch {
        alert("Failed to save resume. Please try again.");
        return;
      }
    }
    setResumes(prev => [newResume, ...prev]);
    setActiveTab("dashboard");
    setSelectedResumeForPreview(null);
  };

  const handleRetailor = (res: Resume) => {
    setSelectedJobPreset(res.targetJobTitle || res.title);
    setSelectedPromptPreset(`Re-tailor for ${res.targetJobTitle || "this role"}${res.targetCompany ? ` at ${res.targetCompany}` : ""}. Maximize ATS keyword alignment.`);
    setSelectedGalleryTemplateId(res.template);
    setSelectedResumeForPreview(null);
    setActiveTab("generate");
  };

  const handleDeleteResume = async (id: string) => {
    if (confirm("Are you sure you want to delete this resume variation?")) {
      // Bug #2: DB first, then remove from UI — no phantom entries on failure
      try {
        await db.deleteResume(id);
        setResumes(prev => prev.filter(r => r.id !== id));
      } catch {
        alert("Failed to delete resume. Please try again.");
      }
    }
  };

  const handleUpsertApplication = async (app: JobApplication) => {
    const previous = applications;
    setApplications(prev => {
      const exists = prev.some(a => a.id === app.id);
      return exists ? prev.map(a => a.id === app.id ? app : a) : [app, ...prev];
    });
    if (user) {
      try {
        await db.upsertApplication(user.id, app);
      } catch {
        setApplications(previous);
        alert("Failed to save application. Please try again.");
      }
    }
  };

  const handleDeleteApplication = async (id: string) => {
    // Bug #2: DB first, then remove from UI
    try {
      await db.deleteApplication(id);
      setApplications(prev => prev.filter(a => a.id !== id));
    } catch {
      alert("Failed to delete application. Please try again.");
    }
  };

  // Loading screen while checking session
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-2" style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa)" }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-indigo-300 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // 1. Auth checkpoint
  if (!user) {
    return <AuthScreen />;
  }

  // 2. Profile Setup checkpoint
  if (!masterProfile || isSettingUpProfile) {
    return (
      <ProfileSetup
        initialProfile={masterProfile}
        onSave={handleSaveMasterProfile}
        onCancel={masterProfile ? () => setIsSettingUpProfile(false) : undefined}
        onLogout={handleLogout}
        isFirstTime={!masterProfile}
      />
    );
  }

  // 3. Main Dashboard Renderer
  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)" }}>

      {/* Header */}
      <header className="sticky top-0 z-30 no-print shadow-lg" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shrink-0" style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa)" }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight block" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Resume Studio</span>
              <span className="text-[10px] text-indigo-300 font-semibold tracking-widest block uppercase">Workspace Manager</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer group border border-indigo-700 hover:border-indigo-400 bg-indigo-900/40 hover:bg-indigo-800/60"
              title="Account Settings"
            >
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
              <span className="text-indigo-300 font-medium">Logged in as:</span>
              <strong className="text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{user.name}</strong>
              <Settings className="w-3 h-3 text-indigo-400 group-hover:text-white transition ml-1" />
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="sm:hidden text-indigo-300 hover:text-white p-2 rounded-lg hover:bg-indigo-800 transition cursor-pointer"
              title="Account Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="text-indigo-300 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/30 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* Navigation Tabs bar */}
        <div className="flex bg-white rounded-2xl shadow-md border border-indigo-50 p-1.5 gap-1 no-print">
          {[
            { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, check: activeTab === "dashboard" && !selectedResumeForPreview },
            { key: "gallery", label: "CV Template Gallery", icon: Layers, check: activeTab === "gallery" && !selectedResumeForPreview },
            { key: "generate", label: "Tailor New Resume", icon: Plus, check: activeTab === "generate" },
            { key: "tracker", label: "Application Tracker", icon: Database, check: activeTab === "tracker" },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key as any); setSelectedResumeForPreview(null); }}
                className={`cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  tab.check
                    ? "text-white shadow-md"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
                style={{
                  background: tab.check ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "",
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Section 1: Resume Preview Modal Overlay style */}
        {selectedResumeForPreview && (
          <div className="space-y-6">
            <div className="no-print text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)" }}>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-widest" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Previewing Variation</span>
                <h2 className="text-base font-bold text-white mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selectedResumeForPreview.title}</h2>
                <p className="text-xs text-indigo-300 mt-1">
                  Template: <strong className="text-purple-300 font-mono uppercase">{selectedResumeForPreview.template}</strong> · Linked: {selectedResumeForPreview.targetCompany || "None"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedResumeForPreview(null)}
                  className="border border-indigo-600 text-indigo-200 hover:text-white hover:border-indigo-400 text-xs px-4 py-2 rounded-xl transition cursor-pointer font-bold bg-indigo-900/40"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => window.print()}
                  className="text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-lg" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                  <FileText className="w-3.5 h-3.5" /> Download / Print PDF
                </button>
              </div>
            </div>

            <div className="bg-white p-4 md:p-8 rounded-2xl border border-indigo-50 shadow-md">
              <ResumeTemplates
                profile={selectedResumeForPreview.profile}
                templateId={selectedResumeForPreview.template}
                isEditable={false}
              />
            </div>
          </div>
        )}

        {/* View Section 2: Dashboard Homepage Layout */}
        {!selectedResumeForPreview && activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in">

            {/* Quick Profile Status Widget */}
            <div className="rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)" }}>
              <div className="space-y-2">
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg" style={{ background: "rgba(129,140,248,0.25)", color: "#a5b4fc", border: "1px solid rgba(129,140,248,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  ✦ Profile Status Active
                </span>
                <h2 className="text-xl font-bold text-white mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Hey {user.name}! 👋 Your master profile is ready.</h2>
                <div className="flex flex-wrap gap-4 text-xs text-indigo-300">
                  <span className="flex items-center gap-1.5 font-medium"><Briefcase className="w-3.5 h-3.5 text-indigo-400" /> {masterProfile.workExperience.length} jobs</span>
                  <span className="flex items-center gap-1.5 font-medium"><Award className="w-3.5 h-3.5 text-purple-400" /> {masterProfile.skills.length} skills listed</span>
                  <span className="flex items-center gap-1.5 font-medium"><MapPin className="w-3.5 h-3.5 text-violet-400" /> {masterProfile.personalDetails.location || "Location not set"}</span>
                </div>
              </div>

              <button
                onClick={() => setIsSettingUpProfile(true)}
                className="text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shrink-0 cursor-pointer border border-indigo-600 hover:border-indigo-400 bg-indigo-900/50 hover:bg-indigo-800/70"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Modify Master Details
              </button>
            </div>

            {/* AI ATS Engine formula catalog selection */}
            <AtsPresets onSelectPreset={handleSelectPreset} />

            {/* My Resumes List Block */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-base text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>My Tailored Resume Variations</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Select a variation to preview, export, or re-tailor.</p>
                </div>

                <button
                  onClick={() => setActiveTab("generate")}
                  className="text-white text-xs px-4 py-2 rounded-xl cursor-pointer transition flex items-center gap-1.5 font-bold shadow-md" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <Plus className="w-3.5 h-3.5" /> Tailor New
                </button>
              </div>

              {resumes.length === 0 ? (
                <div className="text-center py-16 bg-white border border-dashed border-indigo-200 rounded-2xl text-slate-500 space-y-3 shadow-sm" style={{ background: "linear-gradient(135deg, #f8faff, #f5f0ff)" }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-md" style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa)" }}>
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No tailored resumes built yet</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">Paste a job description and let Gemini auto-align your career profile!</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("generate")}
                    className="text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition shadow-lg inline-flex items-center gap-2" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Generate First Resume
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {resumes.map(res => (
                    <div
                      key={res.id}
                      className="bg-white hover:shadow-lg border border-indigo-100 rounded-2xl p-5 transition-all duration-200 relative flex flex-col justify-between shadow-md hover:-translate-y-0.5"
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] uppercase font-bold px-2 py-1 rounded-lg" style={{ background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", color: "#6366f1", border: "1px solid #c7d2fe", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {res.template} template
                          </span>

                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteResume(res.id); }}
                            className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg transition"
                            title="Remove resume variant"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm pt-1 leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {res.title}
                        </h4>

                        {/* Only show targeting line if both values are real (not placeholders) */}
                        {(res.targetJobTitle && res.targetJobTitle !== "Target Position") && (
                          <p className="text-[11px] text-slate-600">
                            Targeting: <strong className="text-slate-800 font-semibold">{res.targetJobTitle}</strong>
                            {res.targetCompany && res.targetCompany !== "Target Employer" && ` at ${res.targetCompany}`}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400 italic">Saved: {res.updatedAt}</p>

                        {/* ATS score badge — cap display at 100 */}
                        {res.profile.aiAnalysis?.matchScore && (
                          <div className="flex items-center gap-1.5 mt-1">
                            {(() => {
                              const score = Math.min(res.profile.aiAnalysis.matchScore, 100);
                              const colour = score >= 80 ? "text-emerald-600" : score >= 65 ? "text-amber-500" : "text-red-500";
                              const barColour = score >= 80 ? "bg-emerald-500" : score >= 65 ? "bg-amber-400" : "bg-red-400";
                              return (
                                <>
                                  <div className={`text-xs font-black ${colour}`}>{score}%</div>
                                  <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${barColour}`} style={{ width: `${score}%` }} />
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-medium">ATS</span>
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-slate-100 flex gap-2">
                        <button
                          onClick={() => setSelectedResumeForPreview(res)}
                          className="flex-1 text-white font-bold text-xs py-2 rounded-xl cursor-pointer transition text-center shadow-sm" style={{ background: "linear-gradient(135deg, #312e81, #4c1d95)" }}
                        >
                          View & Print
                        </button>
                        <button
                          onClick={() => handleRetailor(res)}
                          className="flex-1 font-bold text-xs py-2 rounded-xl cursor-pointer transition text-center border border-indigo-200 text-indigo-600 hover:text-white" style={{ background: "linear-gradient(135deg, #eef2ff, #f5f3ff)" }}
                          onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" })}
                          onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { background: "linear-gradient(135deg, #eef2ff, #f5f3ff)" })}
                          title="Re-generate with improved ATS optimization"
                        >
                          Re-tailor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Metrics preview section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
              {[
                { title: "Matching Score Average", value: resumes.length > 0 ? `${Math.min(100, Math.round(resumes.reduce((sum, r) => sum + Math.min(r.profile.aiAnalysis?.matchScore ?? 0, 100), 0) / resumes.length))}%` : "N/A", label: "Optimized matches", gradient: "from-violet-500 to-purple-600" },
                { title: "Total Resumes", value: resumes.length, label: "Tailored drafts", gradient: "from-blue-500 to-indigo-600" }
              ].map((card, idx) => (
                <div key={idx} className="bg-white border border-indigo-50 p-6 rounded-2xl shadow-md overflow-hidden relative">
                  <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${card.gradient}`} />
                  <div className="pl-3">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{card.title}</div>
                    <div className="text-3xl font-black mt-1" style={{ background: `linear-gradient(135deg, #6366f1, #8b5cf6)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{card.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{card.label}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* View Section 4: CV Gallery workflow */}
        {!selectedResumeForPreview && activeTab === "gallery" && masterProfile && (
          <div className="animate-fade-in">
            <ResumeTemplatesGallery
              profile={masterProfile}
              onUseTemplate={handleUseTemplate}
            />
          </div>
        )}

        {/* View Section 5: Generate/Resume Alignment workflow */}
        {!selectedResumeForPreview && activeTab === "generate" && (
          <div className="animate-fade-in">
            <ResumeBuilder
              masterProfile={masterProfile}
              resumes={resumes}
              onSaveResume={(newRes) => {
                handleSaveNewResume(newRes);
                setSelectedJobPreset("");
                setSelectedPromptPreset("");
                setSelectedGalleryTemplateId("");
              }}
              onBackToDashboard={() => {
                setActiveTab("dashboard");
                setSelectedJobPreset("");
                setSelectedPromptPreset("");
                setSelectedGalleryTemplateId("");
              }}
              initialJobTarget={selectedJobPreset}
              initialCustomPrompt={selectedPromptPreset}
              initialTemplateId={selectedGalleryTemplateId}
            />
          </div>
        )}

        {/* View Section 6: Application Tracker */}
        {!selectedResumeForPreview && activeTab === "tracker" && (
          <div className="animate-fade-in">
            <TrackerBoard
              applications={applications}
              resumes={resumes}
              onUpsertApp={handleUpsertApplication}
              onDeleteApp={handleDeleteApplication}
            />
          </div>
        )}

      </main>

      {/* Account Settings Modal */}
      {isSettingsOpen && (
        <UserSettings
          user={user}
          onClose={() => setIsSettingsOpen(false)}
          onNameUpdate={(name) => setUser(prev => prev ? { ...prev, name } : prev)}
        />
      )}

      {/* Footer */}
      <footer className="py-6 mt-8 text-center text-xs no-print" style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)" }}>
        <div className="text-indigo-300 font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Resume Studio · Workspace Manager</div>
        <div className="text-indigo-500 text-[10px] mt-1">Powered by Gemini 2.5 Flash · ATS-optimized tailoring engine</div>
      </footer>
    </div>
  );
}
