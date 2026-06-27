import React, { useState } from "react";
import { CandidateProfile, Resume } from "../types";
import { 
  Sparkles, FileText, Upload, Copy, Palette, Edit, FileDown, ArrowLeft, 
  RefreshCw, CheckCircle2, ChevronRight, HelpCircle, FileCheck, Zap, AlertCircle
} from "lucide-react";
import ResumeTemplates from "./ResumeTemplates";

interface ResumeBuilderProps {
  masterProfile: CandidateProfile;
  resumes: Resume[];
  onSaveResume: (newResume: Resume) => void;
  onBackToDashboard: () => void;
  initialJobTarget?: string;
  initialCustomPrompt?: string;
  initialTemplateId?: string;
}

export default function ResumeBuilder({
  masterProfile,
  resumes,
  onSaveResume,
  onBackToDashboard,
  initialJobTarget = "",
  initialCustomPrompt = "",
  initialTemplateId = "",
}: ResumeBuilderProps) {
  const [jdText, setJdText] = useState("");
  const [customPrompt, setCustomPrompt] = useState(initialCustomPrompt);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; data: string; mimeType: string } | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [generatedProfile, setGeneratedProfile] = useState<CandidateProfile | null>(null);
  
  // Custom resume metadata
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplateId || "modern");
  const [resumeTitle, setResumeTitle] = useState(initialJobTarget ? `${initialJobTarget} (Tailored)` : "");
  const [targetJobTitle, setTargetJobTitle] = useState(initialJobTarget);
  const [targetCompany, setTargetCompany] = useState("");
  const [isLiveEditing, setIsLiveEditing] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  // Synchronize preset inputs
  React.useEffect(() => {
    if (initialTemplateId) {
      setSelectedTemplate(initialTemplateId);
    }
  }, [initialTemplateId]);

  React.useEffect(() => {
    if (initialJobTarget) {
      setTargetJobTitle(initialJobTarget);
      setResumeTitle(`${initialJobTarget} (Tailored)`);
    }
    if (initialCustomPrompt) {
      setCustomPrompt(initialCustomPrompt);
    }
  }, [initialJobTarget, initialCustomPrompt]);

  // File Upload base64 Conversion
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== "application/pdf" && !file.type.startsWith("image/") && !file.type.startsWith("text/")) {
      alert("Please upload a PDF document or a text file representing the Job Description.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      setUploadedFile({
        name: file.name,
        data: base64String,
        mimeType: file.type
      });
      const sanitizedName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTargetJobTitle(sanitizedName);
      setResumeTitle(`Tailored Resume - ${sanitizedName}`);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Generate Tailored Resume via server API proxying Gemini
  const handleGenerate = async () => {
    if (!jdText && !uploadedFile) {
      alert("Please paste a Job Description or upload a PDF document so the AI has context to align.");
      return;
    }

    setIsGenerating(true);
    setStatusMessage("Ingesting reference job description...");


    setTimeout(() => setStatusMessage("Analyzing Master Resume details..."), 1200);
    setTimeout(() => setStatusMessage("Gemini is matching professional vocabulary keywords..."), 2400);
    setTimeout(() => setStatusMessage("Revising accomplishments with active metrics..."), 3600);

    try {
      const payload = {
        profile: masterProfile,
        jdText: jdText,
        pdfFile: uploadedFile,
        customPrompt: customPrompt
      };

      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to contact tailoring engine");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setGeneratedProfile(result.data);
        setIsFallback(!!result.data.aiAnalysis?.isFallback);
        
        // Form default metadata based on generated details
        const jobName = targetJobTitle || result.data.aiAnalysis?.jdKeywords?.[0] || "Target Job";
        setTargetJobTitle(jobName);
        if (!resumeTitle) {
          setResumeTitle(`Tailored Resume — ${jobName}`);
        }
      } else {
        throw new Error(result.error || "Generation payload error");
      }
    } catch (err: any) {
      console.error(err);
      alert(`Adjustment error: ${err.message}. Loading robust simulated tailored draft...`);
      
      // Safety Fallback content if everything fails
      const fallbackResult = {
        ...masterProfile,
        aiAnalysis: {
          summary: "Goal-oriented software specialist demonstrating core technology execution and structured system delivery principles tailored for matches.",
          matchScore: 82,
          keyAdjustments: ["Matched default backup requirements"],
          jdKeywords: ["Development", "Production Quality", "Troubleshooting"],
          isFallback: true
        }
      };
      setGeneratedProfile(fallbackResult);
      setIsFallback(true);
    } finally {
      setIsGenerating(false);
      setStatusMessage("");
    }
  };

  const handleSaveToDashboard = () => {
    if (!generatedProfile) return;
    const finalResume: Resume = {
      id: crypto.randomUUID(),
      title: resumeTitle || "Tailored Custom Resume",
      targetJobTitle: targetJobTitle || "Target Position",
      targetCompany: targetCompany || "Target Employer",
      profile: generatedProfile,
      template: selectedTemplate,
      updatedAt: new Date().toLocaleDateString()
    };
    onSaveResume(finalResume);
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-1 selection:bg-blue-200">
      
      {/* Navigation and Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-950 text-slate-700 p-2.5 rounded-sm cursor-pointer transition"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-blue-600">Step Guided Alignment</div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
              Tailor Resume with Gemini AI
            </h1>
          </div>
        </div>

        {generatedProfile && (
          <div className="flex gap-2">
            <button
              onClick={() => { setGeneratedProfile(null); setJdText(""); setUploadedFile(null); }}
              className="bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-1.5 rounded-sm transition cursor-pointer"
            >
              Tailor Another
            </button>
            <button
              onClick={handleSaveToDashboard}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-1.5 rounded-sm transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Save to My Resumes
            </button>
          </div>
        )}
      </div>

      {isFallback && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-sm p-4 flex gap-3 text-xs max-w-3xl no-print">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block text-amber-900">Preset fallback loaded!</strong>
            To enable true real-time Gemini AI resume tailoring specifically tailored to your precise JD keyword parameters, configure a valid <code className="bg-amber-100/60 px-1 py-0.5 rounded-sm text-[11px] font-mono select-all text-amber-900 font-semibold border border-amber-200/60">GEMINI_API_KEY</code> within the platform Secrets widget.
          </div>
        </div>
      )}

      {/* STAGE A: Input parameters */}
      {!generatedProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form instructions column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-sm space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Target Job Requirements
              </h3>

              {/* Paste Text Area */}
              <div>
                <label className="block text-slate-500 text-[10px] font-bold mb-1.5 uppercase tracking-wider">Paste Job Description *</label>
                <textarea
                  required
                  placeholder="Paste the full job post details, key bullet points, required technologies, or qualifications..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 rounded-sm p-4 text-xs text-slate-800 min-h-[160px] font-sans transition"
                />
              </div>

              {/* Drag/Drop PDF Area */}
              <div className="relative">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider">Or Upload Job Details PDF</label>
                  {uploadedFile && (
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-[10px] text-red-500 hover:underline"
                    >
                      Clear File
                    </button>
                  )}
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-sm p-6 text-center transition duration-150 relative ${
                    uploadedFile 
                      ? "border-green-500 bg-green-50/40" 
                      : dragOver 
                        ? "border-blue-500 bg-blue-50/50" 
                        : "border-slate-300 hover:border-slate-405 bg-slate-50"
                  }`}
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf,text/plain"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 bg-slate-200 rounded-sm flex items-center justify-center border border-slate-300">
                      <Upload className={`w-5 h-5 ${uploadedFile ? "text-green-600" : "text-slate-500"}`} />
                    </div>
                    {uploadedFile ? (
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{uploadedFile.name}</p>
                        <p className="text-[10px] text-green-600 mt-1 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Inline File Loaded Natively
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-slate-700 font-medium font-bold">Drag & drop JD PDF or click to select</p>
                        <p className="text-[10px] text-slate-400 mt-1">Supports standard .pdf or .txt</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Extra Custom Prompt Alignments */}
              <div>
                <label className="block text-slate-500 text-[10px] font-bold mb-1.5 uppercase flex justify-between tracking-wider">
                  <span>Additional AI Custom Goals (Optional)</span>
                  <span className="text-[10px] text-blue-600 lowercase italic">Give special orders</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 'Align to a Senior Frontend role', 'Focus heavily on React & AWS services ...'"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 text-xs rounded-sm px-4 py-2.5 text-slate-800 transition"
                />
              </div>

            </div>
          </div>

          {/* Configuration Meta Sidebar Column */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-sm space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-600" />
                Resume Variables
              </h3>

              <div>
                <label className="block text-slate-500 text-[10px] font-bold mb-1 uppercase tracking-wider">Save Variant Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior React Developer (Google)"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-xs rounded-sm px-3 py-2 text-slate-800 focus:border-blue-600 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-550 text-[10px] font-bold mb-1 uppercase tracking-wider">Target Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend"
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-xs rounded-sm px-3 py-2 text-slate-800 focus:border-blue-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold mb-1 uppercase tracking-wider">Target Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Google"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-xs rounded-sm px-3 py-2 text-slate-800 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-bold mb-2.5 uppercase tracking-wider">Select Typography preset</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "modern", name: "Modern", desc: "Inter Clean, Indigo lines" },
                    { id: "minimal", name: "Minimal", desc: "Serif spacing, elegant" },
                    { id: "tech", name: "Tech-Mono", desc: "Terminal vibe, hacker grids" },
                    { id: "executive", name: "Executive", desc: "Warm stone, high-density" }
                  ].map(tmpl => (
                    <button
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={`text-left p-3 rounded-sm border transition text-xs relative cursor-pointer ${
                        selectedTemplate === tmpl.id 
                          ? "border-blue-600 bg-blue-50/50 text-blue-700 font-semibold" 
                          : "border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-650"
                      }`}
                    >
                      <span className="block font-bold">{tmpl.name}</span>
                      <span className="block text-[9px] text-slate-400 font-normal mt-0.5">{tmpl.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Master Profile verification check */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm text-[11px] text-slate-650 space-y-1">
                <span className="text-blue-600 font-bold block uppercase text-[10px] tracking-widest">Master Record Summary</span>
                <p>Personal detail: <strong className="text-slate-900">{masterProfile.personalDetails.name || "Missing Name"}</strong></p>
                <p>Skills cataloged: <strong className="text-slate-900">{masterProfile.skills.length} skills</strong></p>
                <p>Historical jobs: <strong className="text-slate-900">{masterProfile.workExperience.length} entries</strong></p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs py-3 rounded-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing: {statusMessage}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white/10" />
                    <span>Run Gemini Tuning Alignment</span>
                  </>
                )}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* STAGE B: Resume previews and inline editors */}
      {generatedProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Controls Side-Panel */}
          <div className="lg:col-span-1 space-y-6 no-print">
            <div className="bg-white border border-slate-200 p-5 rounded-sm space-y-5 sticky top-24 shadow-sm">
              
              {/* ATS matching analytics */}
              <div className="border-b border-slate-100 pb-4">
                <span className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2">ATS Matching Grade</span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black ${generatedProfile.aiAnalysis?.matchScore && generatedProfile.aiAnalysis.matchScore >= 85 ? "text-emerald-600" : "text-amber-600"}`}>
                    {generatedProfile.aiAnalysis?.matchScore || 80}%
                  </span>
                  <span className="text-xs text-slate-500 font-bold">Alignment Rating</span>
                </div>
                
                {/* Keywords checklist */}
                {generatedProfile.aiAnalysis?.jdKeywords && (
                  <div className="mt-3 space-y-1.5">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Injected Keywords</span>
                    <div className="flex flex-wrap gap-1">
                      {generatedProfile.aiAnalysis.jdKeywords.map(kw => (
                        <span key={kw} className="bg-slate-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-sm border border-slate-250/70 font-semibold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Template Toggler */}
              <div>
                <span className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2">Template Layout</span>
                <div className="space-y-1.5">
                  {[
                    { id: "modern", name: "Modern" },
                    { id: "minimal", name: "Minimalist" },
                    { id: "tech", name: "Tech-Mono" },
                    { id: "executive", name: "Executive" }
                  ].map(tmpl => (
                    <button
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={`w-full text-left px-3 py-2 rounded-sm text-xs transition border flex justify-between items-center cursor-pointer ${
                        selectedTemplate === tmpl.id 
                          ? "border-blue-600 bg-blue-50 text-blue-700 font-bold" 
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <span>{tmpl.name}</span>
                      {selectedTemplate === tmpl.id && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live edit trigger toggler */}
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <div>
                  <span className="block text-xs font-bold text-slate-850">Interactive Editor</span>
                  <span className="block text-[10px] text-slate-400">Tap anywhere to inline edit</span>
                </div>
                <button
                  onClick={() => setIsLiveEditing(!isLiveEditing)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-bold transition border cursor-pointer ${
                    isLiveEditing 
                      ? "bg-amber-100 text-amber-850 border-amber-250" 
                      : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {isLiveEditing ? "Live Editing" : "Preview Mode"}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <button
                  onClick={handleTriggerPrint}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-sm transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FileDown className="w-4 h-4 text-white" /> Print / Export PDF
                </button>
                <button
                  onClick={handleSaveToDashboard}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-sm transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FileCheck className="w-4 h-4" /> Save Tailored Resume
                </button>
              </div>

            </div>
          </div>

          {/* Document Render Column */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-slate-200 rounded-sm p-4 no-print flex flex-col md:flex-row justify-between items-center gap-3 shadow-xs">
              <div className="text-xs text-slate-600">
                ⭐ <strong className="text-slate-900">Pro Tip:</strong> Click any section title, name, or bullet point directly to perform instant corrections!
              </div>
              <div className="text-xs bg-slate-100 border border-slate-200 text-slate-800 rounded-sm px-2.5 py-1 font-mono uppercase tracking-wide">
                Active View: {selectedTemplate} layout
              </div>
            </div>

            <div className="bg-slate-200 p-2 md:p-8 rounded-sm border border-slate-300 shadow-inner overflow-x-auto">
              <ResumeTemplates
                profile={generatedProfile}
                templateId={selectedTemplate}
                isEditable={isLiveEditing}
                onUpdate={(upd) => setGeneratedProfile(upd)}
              />
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
