import React, { useState } from "react";
import { JobApplication, ApplicationStatus, Resume } from "../types";
import {
  Building2, Calendar, DollarSign, MapPin, ExternalLink,
  Plus, Edit, Trash2, Tag
} from "lucide-react";

interface TrackerBoardProps {
  applications: JobApplication[];
  resumes: Resume[];
  onUpsertApp: (app: JobApplication) => Promise<void>;
  onDeleteApp: (id: string) => void;
}

export default function TrackerBoard({
  applications,
  resumes,
  onUpsertApp,
  onDeleteApp,
}: TrackerBoardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Partial<JobApplication> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const statuses = [
    { key: ApplicationStatus.Bookmarked, label: "Bookmarked", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { key: ApplicationStatus.Applied, label: "Applied", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { key: ApplicationStatus.Interview, label: "Interviewing", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { key: ApplicationStatus.Offer, label: "Offer Received", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { key: ApplicationStatus.Rejected, label: "Rejected", color: "bg-rose-50 text-rose-700 border-rose-200" },
  ];

  const handleOpenCreate = () => {
    setSelectedApp({
      id: crypto.randomUUID(),
      jobTitle: "",
      company: "",
      status: ApplicationStatus.Bookmarked,
      dateApplied: new Date().toISOString().substring(0, 10),
      salary: "",
      location: "",
      notes: "",
      jobUrl: "",
      associatedResumeId: resumes[0]?.id || ""
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (app: JobApplication) => {
    setSelectedApp(app);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !selectedApp.jobTitle || !selectedApp.company) {
      alert("Please provide both Job Title and Company.");
      return;
    }
    setIsSaving(true);
    try {
      await onUpsertApp(selectedApp as JobApplication);
      setIsEditing(false);
      setSelectedApp(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusShift = (app: JobApplication, nextStatus: ApplicationStatus) => {
    onUpsertApp({
      ...app,
      status: nextStatus
    });
  };

  return (
    <div className="space-y-6">
      {/* Tracker Headers */}
      <div className="flex justify-between items-center bg-white p-5 border border-slate-200 rounded-sm shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="text-blue-600 w-5 h-5" />
            Application Tracker Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track and progress positions, associated resume templates, and scheduling logs.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-sm flex items-center gap-1.5 cursor-pointer transition shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Grid Columns */}
      <div className="overflow-x-auto pb-2">
      <div className="grid grid-cols-5 gap-4 min-w-[900px]">
        {statuses.map(({ key, label, color }) => {
          const colApps = applications.filter(app => app.status === key);

          return (
            <div key={key} className="bg-slate-100/70 border border-slate-200 p-4 rounded-sm flex flex-col min-h-[450px]">
              {/* Header col */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-3 shrink-0">
                <span className={`text-[11px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm border border-solid ${color}`}>
                  {label}
                </span>
                <span className="text-xs font-mono font-bold bg-slate-200 text-slate-700 border border-slate-350 rounded-sm w-5 h-5 flex items-center justify-center">
                  {colApps.length}
                </span>
              </div>

              {/* Cards block */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] scrollbar-thin">
                {colApps.length === 0 ? (
                  <div className="text-center py-12 text-[11px] text-slate-400 border border-dashed border-slate-300 rounded-sm">
                    No items on pipeline
                  </div>
                ) : (
                  colApps.map(app => {
                    const matchedResume = resumes.find(r => r.id === app.associatedResumeId);
                    return (
                      <div
                        key={app.id}
                        className="bg-white hover:border-blue-400/80 border border-slate-200 p-4 rounded-sm transition-all duration-150 relative group shadow-xs"
                      >
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-bold text-slate-900 text-sm tracking-tight leading-snug line-clamp-1">
                            {app.jobTitle}
                          </h4>
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition duration-150">
                            <button
                              onClick={() => handleOpenEdit(app)}
                              className="text-slate-400 hover:text-blue-600 hover:bg-slate-100 p-1 rounded-sm"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Remove this application tracking item?")) onDeleteApp(app.id);
                              }}
                              className="text-slate-400 hover:text-red-500 hover:bg-slate-100 p-1 rounded-sm"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Company & Meta */}
                        <div className="text-blue-600 text-xs font-bold mt-1">
                          {app.company}
                        </div>

                        <div className="mt-3.5 space-y-1 text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
                          {app.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{app.location}</span>
                            </div>
                          )}
                          {app.salary && (
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-3 h-3 text-slate-400" />
                              <span>{app.salary}</span>
                            </div>
                          )}
                          {app.dateApplied && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{app.dateApplied}</span>
                            </div>
                          )}
                        </div>

                        {/* Associated resume badge */}
                        {matchedResume && (
                          <div className="mt-2.5 bg-slate-50 px-2 py-1 rounded-sm border border-slate-200 text-[10px] text-blue-600 font-bold truncate flex items-center gap-1.5">
                            <Tag className="w-2.5 h-2.5 text-blue-500" />
                            Resume: {matchedResume.title}
                          </div>
                        )}

                        {/* External Link */}
                        {app.jobUrl && (
                          <a
                            href={app.jobUrl.startsWith("http") ? app.jobUrl : `https://${app.jobUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-3 right-3 text-slate-400 hover:text-slate-800"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {/* Rapid Status Switch Overlay indicator */}
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1 justify-between text-[10px] text-slate-400">
                          <span>Status:</span>
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusShift(app, e.target.value as ApplicationStatus)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-sm text-[10px] px-1 py-0.5 cursor-pointer focus:outline-none"
                          >
                            {statuses.map(st => (
                              <option key={st.key} value={st.key}>{st.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>

      {/* Editor Modal Overlay */}
      {isEditing && selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-sm p-6 w-full max-w-lg shadow-2xl relative text-slate-900">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold text-lg transition"
            >
              ×
            </button>
            
            <h3 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              {applications.some(a => a.id === selectedApp.id) ? "Modify Placement Details" : "Record Target Application"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-500 text-[10px] font-bold mb-1 uppercase tracking-wider">Job Position Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={selectedApp.jobTitle || ""}
                    onChange={(e) => setSelectedApp(prev => ({ ...prev, jobTitle: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-800 text-xs rounded-sm px-3 py-2 transition"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-500 text-[10px] font-bold mb-1 uppercase tracking-wider">Company / Employer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google"
                    value={selectedApp.company || ""}
                    onChange={(e) => setSelectedApp(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-800 text-xs rounded-sm px-3 py-2 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] font-bold mb-1 uppercase tracking-wider">Salary / Comp</label>
                  <input
                    type="text"
                    placeholder="e.g. $140,000/yr"
                    value={selectedApp.salary || ""}
                    onChange={(e) => setSelectedApp(prev => ({ ...prev, salary: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-800 text-xs rounded-sm px-3 py-2 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] font-bold mb-1 uppercase tracking-wider">Location</label>
                  <input
                    type="text"
                    placeholder="Austin, TX or Remote"
                    value={selectedApp.location || ""}
                    onChange={(e) => setSelectedApp(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-800 text-xs rounded-sm px-3 py-2 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] font-bold mb-1 uppercase tracking-wider">Status Category</label>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => setSelectedApp(prev => ({ ...prev, status: e.target.value as ApplicationStatus }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-850 text-xs rounded-sm px-3 py-2 transition cursor-pointer"
                  >
                    {statuses.map(st => (
                      <option key={st.key} value={st.key}>{st.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] font-bold mb-1 uppercase tracking-wider">Date Filed / Saved</label>
                  <input
                    type="date"
                    value={selectedApp.dateApplied || ""}
                    onChange={(e) => setSelectedApp(prev => ({ ...prev, dateApplied: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-850 text-xs rounded-sm px-3 py-2 transition cursor-pointer"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-500 text-[10px] font-bold mb-1 uppercase tracking-wider">Job Advert Link (URL)</label>
                  <input
                    type="text"
                    placeholder="https://careers.google.com/jobs/..."
                    value={selectedApp.jobUrl || ""}
                    onChange={(e) => setSelectedApp(prev => ({ ...prev, jobUrl: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-800 text-xs rounded-sm px-3 py-2 transition"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-500 text-[10px] font-bold mb-1 uppercase tracking-wider">Associated Resume Version</label>
                  <select
                    value={selectedApp.associatedResumeId || ""}
                    onChange={(e) => setSelectedApp(prev => ({ ...prev, associatedResumeId: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-850 text-xs rounded-sm px-3 py-2 transition cursor-pointer"
                  >
                    <option value="">-- No Tailored Resume Version Associated --</option>
                    {resumes.map(r => (
                      <option key={r.id} value={r.id}>{r.title} ({r.template})</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-500 text-[10px] font-bold mb-1 uppercase tracking-wider">Action Items & Reminders (Notes)</label>
                  <textarea
                    placeholder="Spoke with hiring manager; interview scheduled for next Thursday..."
                    value={selectedApp.notes || ""}
                    onChange={(e) => setSelectedApp(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-800 text-xs rounded-sm px-2 py-1.5 transition min-h-[60px]"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); setSelectedApp(null); }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-4 py-2 rounded-sm font-bold cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs px-4 py-2 rounded-sm cursor-pointer shadow-sm transition"
                >
                  {isSaving ? "Saving..." : "Record Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
