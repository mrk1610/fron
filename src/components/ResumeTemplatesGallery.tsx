import { useState, useMemo } from "react";
import { CandidateProfile } from "../types";
import ResumeTemplates from "./ResumeTemplates";
import {
  Search, Check, Download, Sparkles, FileText, Briefcase,
  MapPin, Mail, Phone, HelpCircle
} from "lucide-react";

interface ResumeTemplatesGalleryProps {
  profile: CandidateProfile;
  onUseTemplate: (templateId: string) => void;
}

interface TemplateMetadata {
  id: string;
  name: string;
  category: "Modern" | "Classic" | "Creative" | "Minimal" | "ATS";
  description: string;
  primaryColor: string;
}

export default function ResumeTemplatesGallery({ profile, onUseTemplate }: ResumeTemplatesGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"All" | "Modern" | "Classic" | "Creative" | "Minimal" | "ATS">("All");
  const [selectedTemplateId, setSelectedTemplateId] = useState("classic");

  // Define 22 comprehensive template choices
  const templatesList: TemplateMetadata[] = useMemo(() => [
    { id: "classic", name: "Classic Professional", category: "Classic", description: "Authoritative traditional serif format layout suitable for leadership and finance", primaryColor: "bg-slate-800" },
    { id: "moderndark", name: "Modern Dark", category: "Modern", description: "Stylish dark blue aesthetic paired with modern block tags", primaryColor: "bg-slate-900" },
    { id: "minimalclean", name: "Minimal Clean", category: "Minimal", description: "Sophisticated usage of white space & chronological timelines", primaryColor: "bg-stone-50" },
    { id: "sidebar", name: "Sidebar Navy", category: "Modern", description: "Split asymmetric layout dividing core details and experience grid", primaryColor: "bg-[#1e293b]" },
    { id: "creativegreen", name: "Creative Green", category: "Creative", description: "Accented forest-green outline built for creatives & designers", primaryColor: "bg-emerald-600" },
    { id: "executive", name: "Executive", category: "Classic", description: "Polished formal letter formatting with warm margins", primaryColor: "bg-stone-800" },
    { id: "boldheader", name: "Bold Header", category: "Modern", description: "Stunning indigo gradient upper block designed to grab instant attention", primaryColor: "bg-indigo-700" },
    { id: "simpleats", name: "Simple ATS", category: "ATS", description: "A simple, highly parsed baseline layout for rigid automatic systems", primaryColor: "bg-zinc-100" },
    { id: "coralaccent", name: "Coral Accent", category: "Creative", description: "Spiced with warm rose-gold outlines & highlighting badges", primaryColor: "bg-rose-500" },
    { id: "tealsplit", name: "Teal Split", category: "Creative", description: "Elegant split columns overlaying robust tech gauges", primaryColor: "bg-teal-700" },
    { id: "grayslate", name: "Gray Slate", category: "Minimal", description: "Assembled with clean Cool Gray frames, prioritizing ease of reading", primaryColor: "bg-slate-600" },
    { id: "warmamber", name: "Warm Amber", category: "Classic", description: "Cream vintage styling for consultants, advisory, and academics", primaryColor: "bg-amber-600" },
    { id: "twocolumn", name: "Two Column", category: "Modern", description: "Balanced ratio columns side by side optimizing content spacing", primaryColor: "bg-blue-600" },
    { id: "timeline", name: "Timeline Chrono", category: "Creative", description: "Interconnected chronological milestone indicators", primaryColor: "bg-teal-500" },
    { id: "infographic", name: "Infographic", category: "Creative", description: "Visual dynamic layout supporting bullet gauges and project cards", primaryColor: "bg-blue-700" },
    { id: "atssafe", name: "ATS Safe", category: "ATS", description: "Standard single column structured for scanning compliance", primaryColor: "bg-slate-705" },
    { id: "atsplus", name: "ATS Plus", category: "ATS", description: "High efficiency technical keywords catalog with explicit section limits", primaryColor: "bg-blue-800" },
    { id: "compact", name: "Compact Tight", category: "Minimal", description: "High content density, space optimized layout keeping records on 1-page", primaryColor: "bg-zinc-700" },
    { id: "elegant", name: "Elegant Gold", category: "Classic", description: "Sophisticated gold trim borders paired with deep serifs", primaryColor: "bg-stone-900" },
    { id: "freshblue", name: "Fresh Blue", category: "Creative", description: "Vibrant high contrast sky blue highlighting headers", primaryColor: "bg-sky-600" },
    { id: "darkmode", name: "Dark Mode Cyber", category: "Modern", description: "Modern cyberpunk dark style with terminal neon indices", primaryColor: "bg-[#0b0f19]" },
    { id: "rosegold", name: "Rose Gold", category: "Creative", description: "Luxury color matching targeting soft design or advisor streams", primaryColor: "bg-rose-450" }
  ], []);

  // Filter & Search Logic
  const filteredTemplates = useMemo(() => {
    return templatesList.filter(tpl => {
      const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedFilter === "All" || tpl.category === selectedFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedFilter, templatesList]);

  // Handle standard PDF print download action
  const handleDownloadPDF = () => {
    // Generate custom print styles temporarily for high quality isolated print output
    const printContent = document.getElementById("resume-document");
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    const printWindow = window.open("", "", "width=900,height=1200");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Download CV - ${profile.personalDetails.name}</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @media print {
                body { background-color: white; color: black; padding: 0; margin: 0; }
                #resume-document { box-shadow: none !important; border: none !important; max-width: 100% !important; width: 100% !important; padding: 0 !important; margin: 0 !important; }
              }
            </style>
          </head>
          <body class="bg-white p-6">
            <div>
              ${printContent.outerHTML}
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const selectedTemplateName = templatesList.find(t => t.id === selectedTemplateId)?.name || "Selected Layout";

  return (
    <div className="space-y-6" id="templates-gallery-section">
      
      {/* 4. Active Profile Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-white no-print shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <FileText className="w-40 h-40" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl border-2 border-slate-700 shadow-md">
              {profile.personalDetails.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold tracking-tight text-white">{profile.personalDetails.name}</h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 bg-emerald-405 rounded-full animate-pulse"></span>
                  Open to Work
                </span>
              </div>
              <p className="text-slate-400 mt-1 flex items-center gap-1 text-sm">
                <Briefcase className="w-4 h-4 text-slate-500" />
                Senior Candidate Consultant
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 flex-wrap">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-500" /> {profile.personalDetails.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-500" /> {profile.personalDetails.phone}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {profile.personalDetails.location}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/80 border border-slate-700 rounded p-3 text-xs text-slate-355 max-w-sm">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored Intelligence Loaded</span>
            </div>
            Data synchronizes instantly! Swap templates to immediately visualize how your credentials conform to any styling rule.
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: 2 columns thumbnail grid */}
        <div className="lg:col-span-5 space-y-4 no-print">
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4 shadow-sm">
            
            {/* Header with Search and Stats */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">Template Catalog</h4>
              <p className="text-xs text-slate-500">{filteredTemplates.length} matches out of {templatesList.length} total curated professional layouts</p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles (e.g., ATS, Emerald, timeline)..."
                className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-220 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
              />
            </div>

            {/* Categories filters scroll list */}
            <div className="flex flex-wrap gap-1">
              {(["All", "Modern", "Classic", "Creative", "Minimal", "ATS"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`cursor-pointer px-2.5 py-1 text-xs font-semibold rounded-sm border transition-all ${
                    selectedFilter === filter
                      ? "bg-slate-900 border-slate-900 text-white shadow-sm font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-655 hover:bg-slate-100"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Listing scroll area */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-h-[560px] overflow-y-auto space-y-3 shadow-inner">
            <div className="grid grid-cols-2 gap-3">
              {filteredTemplates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`cursor-pointer text-left flex flex-col p-3 rounded-lg border transition-all relative overflow-hidden bg-white shadow-sm hover:translate-y-[-2px] hover:shadow-md ${
                      isSelected 
                        ? "border-blue-600 ring-2 ring-blue-600/30" 
                        : "border-slate-200 hover:border-slate-350"
                    }`}
                  >
                    {/* Tiny styled color band tag indicator */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${tpl.primaryColor}`} />
                    
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{tpl.category}</span>
                      {isSelected && (
                        <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white scale-90">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <h5 className="font-bold text-slate-900 mt-1 leading-snug line-clamp-1">{tpl.name}</h5>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug flex-1 line-clamp-2">{tpl.description}</p>
                    
                    <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between items-center gap-2">
                      <span className="text-[9px] text-slate-400 font-mono">ID: {tpl.id}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onUseTemplate(tpl.id); }}
                        className="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-sm transition cursor-pointer shrink-0"
                      >
                        Use →
                      </button>
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-10 bg-white border border-slate-200 rounded-lg">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No matching templates found</p>
                <p className="text-[10px] text-slate-500 mt-1">Try resetting the category filter or searching generic keys</p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedFilter("All"); }}
                  className="mt-3 text-[10px] font-bold text-blue-600 border border-blue-200 px-3 py-1 bg-blue-50/50 hover:bg-blue-50 rounded"
                >
                  Reset Active Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column: live interactive template preview */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Live Action Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm no-print">
            <div>
              <span className="text-[10px] font-bold uppercase text-blue-600 tracking-widest block">Live Renderer Mode</span>
              <h3 className="text-sm font-extrabold text-slate-900">Previewing: <span className="text-blue-600">{selectedTemplateName}</span></h3>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => onUseTemplate(selectedTemplateId)}
                className="cursor-pointer flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold uppercase tracking-wider text-white shadow transition-all hover:scale-[1.01]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Use Template
              </button>
              <button
                onClick={handleDownloadPDF}
                className="cursor-pointer flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>

          {/* Interactive Document Area */}
          <div className="border border-slate-200 bg-slate-100 rounded-lg p-1 md:p-4 max-h-[730px] overflow-y-auto shadow-inner select-none relative">
            <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[9px] uppercase font-mono px-2 py-0.5 rounded tracking-widest z-10 pointer-events-none no-print">
              Preview Frame
            </div>
            {/* Live Data Render */}
            <div className="transform origin-top scale-95 md:scale-100 transition-all">
              <ResumeTemplates
                profile={profile}
                templateId={selectedTemplateId}
                isEditable={false}
              />
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}
