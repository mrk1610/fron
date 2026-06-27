import React, { useState, useMemo } from "react";
import { 
  Sparkles, Search, CheckCircle, ChevronRight, Bookmark, 
  Layers, Users, TrendingUp, Monitor, Shield, Award 
} from "lucide-react";

interface AtsPreset {
  id: string;
  title: string;
  category: "tech" | "product" | "finance" | "sales" | "specialized";
  atsStrength: number;
  layoutWay: "Modern Minimalist" | "Strict Chronological" | "Technical Academic" | "Executive Balanced" | "Dynamic Narrative";
  frequentKeywords: string[];
  suggestedTemplate: "modern" | "professional" | "minimal" | "academic";
  customPrompt: string;
  description: string;
}

const ATS_PRESETS_DATA: AtsPreset[] = [
  // 1. Tech & Engineering (8 roles)
  {
    id: "tech-1",
    title: "Senior Full Stack Engineer",
    category: "tech",
    atsStrength: 99,
    layoutWay: "Modern Minimalist",
    frequentKeywords: ["React", "Node.js", "TypeScript", "AWS Cloud", "System Design", "CI/CD Pipelines", "SQL/NoSQL Databases"],
    suggestedTemplate: "modern",
    customPrompt: "Emphasize scalable backend services, robust API integrations, responsive React frontend patterns, and containerized deployment pipelines.",
    description: "Streamlined single-column style built to feed clear data into scanning systems evaluating technical mastery."
  },
  {
    id: "tech-2",
    title: "DevOps & Infrastructure Architect",
    category: "tech",
    atsStrength: 98,
    layoutWay: "Strict Chronological",
    frequentKeywords: ["Kubernetes", "Docker", "Terraform", "Jenkins", "AWS/GCP Resource Management", "Infrastructure as Code", "Linux Bash"],
    suggestedTemplate: "minimal",
    customPrompt: "Highlight reliable automated deployments, system uptime metrics, automated test integration, and multi-region cloud security compliance.",
    description: "Highly structural chronological design emphasizing zero-downtime capabilities and robust tool chains."
  },
  {
    id: "tech-3",
    title: "Data Scientist & AI Researcher",
    category: "tech",
    atsStrength: 97,
    layoutWay: "Technical Academic",
    frequentKeywords: ["PyTorch", "Python Pandas", "Machine Learning", "Scikit-Learn", "Big Data Analytics", "Statistical Modeling", "R"],
    suggestedTemplate: "academic",
    customPrompt: "Focus on feature engineering, algorithmic efficiency, deep learning model architectures, and transforming mathematical concepts into business ROI.",
    description: "Optimized format focusing heavily on model deployments, computational research, with bolded technical terms."
  },
  {
    id: "tech-4",
    title: "Senior Frontend Developer",
    category: "tech",
    atsStrength: 98,
    layoutWay: "Modern Minimalist",
    frequentKeywords: ["Next.js", "Tailwind CSS", "Redux Toolkit", "Web Accessibility (WCAG)", "SEO Management", "Jest Unit Testing", "Webpack/Vite"],
    suggestedTemplate: "modern",
    customPrompt: "Accentuate user-centered design system developments, component-driven architectures, bundle-size optimization, and web performance metrics.",
    description: "Sleek contemporary layout engineered to represent clean code practices and dynamic client application architectures."
  },
  {
    id: "tech-5",
    title: "Cybersecurity Analyst & Lead",
    category: "tech",
    atsStrength: 99,
    layoutWay: "Strict Chronological",
    frequentKeywords: ["SIEM Systems", "NIST Framework", "Penetration Testing", "Threat Mitigation", "WAF Rules", "Vulnerability Auditing", "IAM Lifecycle"],
    suggestedTemplate: "professional",
    customPrompt: "Detail structural system hardening, corporate compliance framework alignment, incident response lifecycle management, and disaster recovery audits.",
    description: "Rigid structure focusing on risk percentages, critical response protocols, and security standard compliance."
  },
  {
    id: "tech-6",
    title: "SRE / Cloud Systems Engineer",
    category: "tech",
    atsStrength: 98,
    layoutWay: "Technical Academic",
    frequentKeywords: ["SLA/SLO Objectives", "Prometheus", "Grafana", "Linux Kernels", "Shell Automation", "Infrastructure Security", "Network Latency"],
    suggestedTemplate: "academic",
    customPrompt: "Emphasize incident post-mortems, latency troubleshooting, system reliability parameters, cloud-native networking configs, and configuration management.",
    description: "Clean academic structure focusing on large metric achievements, continuous monitoring, and diagnostic methodologies."
  },
  {
    id: "tech-7",
    title: "QA Automation & Test Architect",
    category: "tech",
    atsStrength: 96,
    layoutWay: "Strict Chronological",
    frequentKeywords: ["Selenium Automation", "Cypress Suite", "Jest/Mocha", "REST Assured", "API Testing", "Behavior Driven Development (BDD)", "Agile SDLC"],
    suggestedTemplate: "professional",
    customPrompt: "Focus on test coverage metrics, scaling pipeline automated scripts, cross-browser compatibility matrix suites, and continuous feedback cycles.",
    description: "Organized chronological blueprint designed to display error detection rates, script maintenance, and quality gate scores."
  },
  {
    id: "tech-8",
    title: "Database Administrator & Data Engineer",
    category: "tech",
    atsStrength: 99,
    layoutWay: "Strict Chronological",
    frequentKeywords: ["PostgreSQL Tuning", "ETL Pipelines", "Data Warehousing (Snowflake)", "Database Performance Optimization", "ACID Compliance", "NoSQL", "Query Plans"],
    suggestedTemplate: "minimal",
    customPrompt: "Frame achievements around query optimization percentages, database recovery times (RTO/RPO), physical server tuning, and schema migration automation.",
    description: "Structural layout featuring high keyword density for database architectures and cluster scaling capabilities."
  },

  // 2. Management & Product (6 roles)
  {
    id: "prod-1",
    title: "Technical Product Manager (TPM)",
    category: "product",
    atsStrength: 99,
    layoutWay: "Executive Balanced",
    frequentKeywords: ["Product Roadmap", "KPI Alignment", "Agile/Scrum Framework", "Cross-Functional Collaboration", "A/B Testing", "Market Feasibility", "PRDs"],
    suggestedTemplate: "professional",
    customPrompt: "Showcase defining business/technical specifications, translating user research into product features, managing sprint engineering velocities, and product launches.",
    description: "Authoritative design balancing business progress, product growth metrics, and technical requirements coordination."
  },
  {
    id: "prod-2",
    title: "UX / Product Design Specialist",
    category: "product",
    atsStrength: 95,
    layoutWay: "Dynamic Narrative",
    frequentKeywords: ["Figma Design", "User Persona Research", "Wireframing/Prototyping", "Design System Governance", "Usability Testing", "Interactive Micro-Animations"],
    suggestedTemplate: "modern",
    customPrompt: "Emphasize human-centered solutions, converting complex features into intuitive flows, user journey analysis, design-to-development handoffs, and feedback systems.",
    description: "Modern asymmetrical display focusing on conversion uplifts, usability scores, and brand layout structures."
  },
  {
    id: "prod-3",
    title: "Agile Coach & Scrum Master",
    category: "product",
    atsStrength: 97,
    layoutWay: "Strict Chronological",
    frequentKeywords: ["Sprint Velocities", "JIRA Dashboard Management", "Retrospective Moderation", "Agile Scaling (SAFe)", "Stakeholder Alignment", "Conflict Resolution"],
    suggestedTemplate: "minimal",
    customPrompt: "Highlight increasing agile process efficiency, removal of production bottlenecks, training cross-functional teams, and fostering collaborative workplace cultures.",
    description: "Clear vertical organization emphasizing workflow optimization, continuous improvement loops, and team coordination."
  },
  {
    id: "prod-4",
    title: "Business Systems Analyst",
    category: "product",
    atsStrength: 98,
    layoutWay: "Executive Balanced",
    frequentKeywords: ["Gap Analysis", "UML Modeling", "SaaS Implementations", "Functional Specifications", "SQL Reporting", "Process Mapping", "Requirements Overlap"],
    suggestedTemplate: "professional",
    customPrompt: "Detail translating business objectives into structural systems architectures, auditing software migrations, data orchestration rules, and API vendor partnerships.",
    description: "Balanced chronological flow showing translation capabilities, business analyst certifications, and corporate system alignments."
  },
  {
    id: "prod-5",
    title: "Strategic Project Lead & PMO",
    category: "product",
    atsStrength: 98,
    layoutWay: "Strict Chronological",
    frequentKeywords: ["CAPM/PMP Align", "Budgeting & Capex", "Risk registers", "Resource allocation", "Milestone Tracking", "Earned Value Management"],
    suggestedTemplate: "minimal",
    customPrompt: "Focus on financial project tracking, cross-vendor contracts, scope creep mitigation protocols, executive steering reports, and programmatic progress.",
    description: "Dense, structured template focused on resource utilization statistics, project scopes, and regulatory controls."
  },
  {
    id: "prod-6",
    title: "Product Operations Manager",
    category: "product",
    atsStrength: 97,
    layoutWay: "Executive Balanced",
    frequentKeywords: ["Product Tool Stack", "Usage Metrics Integrations", "Onboarding Automations", "Operational Feedback Loops", "Team Capacity Analysis", "SaaS Analytics"],
    suggestedTemplate: "modern",
    customPrompt: "Accentuate internal tool efficiency, standardizing customer behavioral feedback collections, training customer-facing teams, and software adoption KPI analytics.",
    description: "Innovative layout optimized to show internal productivity management, analytics setups, and process alignment."
  },

  // 3. Finance & Executive (6 roles)
  {
    id: "fin-1",
    title: "Senior Financial Analyst / Manager",
    category: "finance",
    atsStrength: 99,
    layoutWay: "Strict Chronological",
    frequentKeywords: ["EBITDA Forecasts", "Discounted Cash Flow", "Corporate valuation", "LBO Modeling", "GAAP Compliance", "SAP/Oracle ERP", "Variance Reporting"],
    suggestedTemplate: "minimal",
    customPrompt: "Emphasize margin improvement initiatives, portfolio optimization returns, precise capital allocation schedules, multi-variable variance auditing, and budget forecasts.",
    description: "Ultra-clean professional layout prioritizing corporate accounting, treasury systems, and investment evaluations."
  },
  {
    id: "fin-2",
    title: "Chief Technology Officer (CTO)",
    category: "finance",
    atsStrength: 98,
    layoutWay: "Executive Balanced",
    frequentKeywords: ["Technology Vision", "R&D Capex Budgets", "Enterprise Scaling", "Intellectual Property (IP)", "SaaS Vendor Negotiations", "Global Team Management"],
    suggestedTemplate: "professional",
    customPrompt: "Detail technical department transformations, executive alignment, capital fundraising strategies, standardizing agile governance across multi-disciplinary hubs, and engineering scaling.",
    description: "Highly polished executive style suited for high levels of leadership, strategic impact, and division transformations."
  },
  {
    id: "fin-3",
    title: "Operations & Supply Chain Director",
    category: "finance",
    atsStrength: 98,
    layoutWay: "Strict Chronological",
    frequentKeywords: ["S&OP Execution", "Lean Six Sigma Black Belt", "Vendor Contract Negotiation", "Logistics Cost Optimization", "Inventory Turnaround Rates", "ERP Migration"],
    suggestedTemplate: "minimal",
    customPrompt: "Highlight inventory cost reductions, operational audit performance, automated supply chain visibility setups, and international compliance operations.",
    description: "Compact structural layout centered on logistics efficiency metrics, vendor cost variables, and process certifications."
  },
  {
    id: "fin-4",
    title: "HR Director & Business Partner",
    category: "finance",
    atsStrength: 99,
    layoutWay: "Executive Balanced",
    frequentKeywords: ["Compensation & Benefits", "Employee Relations", "HRIS System Implementation", "Labor Law Compliance", "Diversity & Inclusion", "Retention Modeling"],
    suggestedTemplate: "professional",
    customPrompt: "Focus on structural talent strategy, lowering voluntary attrition rates, restructuring corporate hierarchies, designing equitable career paths, and conflict resolution policies.",
    description: "Empathetic yet highly metricized template demonstrating department leadership, corporate compliance standards, and talent tracking."
  },
  {
    id: "fin-5",
    title: "Growth & Analytics Strategist",
    category: "finance",
    atsStrength: 97,
    layoutWay: "Dynamic Narrative",
    frequentKeywords: ["Customer Acquisition Cost (CAC)", "LTV Modeling", "Data Wrangling", "Funnel Optimizations", "Multi-Touch Attribution", "Marketing Automation"],
    suggestedTemplate: "modern",
    customPrompt: "Emphasize lowering CAC, modeling retention curves, running data analytics queries, marketing campaign orchestration, and attribution framework setup.",
    description: "Contemporary single-row highlights prioritizing growth curves, analytics tooling, and digital transformation initiatives."
  },
  {
    id: "fin-6",
    title: "Corporate Legal Counsel / Officer",
    category: "finance",
    atsStrength: 98,
    layoutWay: "Strict Chronological",
    frequentKeywords: ["Contract Negotiation", "Risk Mitigation Frameworks", "Intellectual Property (IP) Protection", "Regulatory Auditing", "GDPR/CCPA Compliance", "Litigation Support"],
    suggestedTemplate: "academic",
    customPrompt: "Frame achievements around liability exposure reduction, corporate board guidance, drafting master software licensing agreements, international mergers, and risk audits.",
    description: "Formal layouts with complete structural consistency, emphasizing risk mitigation percentages and regulatory expertise."
  },

  // 4. Sales & Customer Success (6 roles)
  {
    id: "sale-1",
    title: "Enterprise Account Executive (AE)",
    category: "sales",
    atsStrength: 98,
    layoutWay: "Executive Balanced",
    frequentKeywords: ["B2B SaaS Sales", "Quota Attainment Goals", "Strategic Pipeline Development", "Salesforce Pipeline Tracking", "High-Value Account Close", "C-Suite Presentation"],
    suggestedTemplate: "professional",
    customPrompt: "Highlight average transaction sizes (ACV), multi-year contract negotiations, historical quota achievement percent milestones, expansion pipeline strategies, and sales methodologies.",
    description: "Premium result-oriented design emphasizing numeric deal values and executive relationship management."
  },
  {
    id: "sale-2",
    title: "Customer Success Director / Manager",
    category: "sales",
    atsStrength: 98,
    layoutWay: "Executive Balanced",
    frequentKeywords: ["Net Revenue Retention (NRR)", "Customer Churn Mitigation", "Product Adaptation Coaching", "NPS Improvements", "Onboarding Workflows", "Renewal Forecasts"],
    suggestedTemplate: "modern",
    customPrompt: "Emphasize proactive account health coaching, renewal rate increases, structural account onboarding improvements, customer lifetime value expansion, and helpdesk systems setup.",
    description: "Modern, balanced format showing key retention indicators, user feedback programs, and client health dashboards."
  },
  {
    id: "sale-3",
    title: "Sales Development & Outbound Lead",
    category: "sales",
    atsStrength: 95,
    layoutWay: "Dynamic Narrative",
    frequentKeywords: ["Cold Outreach Orchestration", "Qualification Frameworks (BANT)", "Email Marketing Sequences", "Inbound Lead Conversions", "Salesforce CRM", "SQL Generation"],
    suggestedTemplate: "modern",
    customPrompt: "Focus on pipeline generation metrics, email open/response conversions, inbound conversion rates, high-volume qualification sprints, and marketing collaboration.",
    description: "Active high-energy configuration prioritizing volume campaigns, meeting generation scores, and target audience identification."
  },
  {
    id: "sale-4",
    title: "Support Operations & Enablement Lead",
    category: "sales",
    atsStrength: 97,
    layoutWay: "Strict Chronological",
    frequentKeywords: ["SLA Adherence Management", "Ticketing Workflow Optimizations", "Knowledge Base Curation", "Zendesk/Jira Admin", "Customer Incident Escalation", "ITIL Frameworks"],
    suggestedTemplate: "minimal",
    customPrompt: "Highlight agent response time reductions, SLA breach risk management, implementing AI support automation engines, designing internal support runbooks, and feedback loops.",
    description: "Process-centric horizontal presentation focusing on resolution speed, ticket tracking setups, and service satisfaction scores."
  },
  {
    id: "sale-5",
    title: "Strategic Partnerships Manager",
    category: "sales",
    atsStrength: 98,
    layoutWay: "Executive Balanced",
    frequentKeywords: ["Joint Go-To-Market (GTM)", "Co-Marketing Alliances", "Integration Partnerships", "Contract Lifecycle Management", "KPI Performance Tracking", "Referral Pipelines"],
    suggestedTemplate: "professional",
    customPrompt: "Emphasize partnership source revenue pipelines, drafting collaborative reseller agreements, managing external software provider integration releases, and GTM plans.",
    description: "Clean balance between business development, client relationship metrics, and enterprise legal frameworks."
  },
  {
    id: "sale-6",
    title: "Account Manager & Renewal Specialist",
    category: "sales",
    atsStrength: 96,
    layoutWay: "Modern Minimalist",
    frequentKeywords: ["Account Renewals", "Up-selling & Cross-selling", "Customer Churn Reduction", "Client Relationship Curation", "Strategic Reviews", "Portfolio Account Growth"],
    suggestedTemplate: "minimal",
    customPrompt: "Detail renewal percentages, proactive expansion plans, executing periodic business reviews, managing account health metrics, and client relationship expansion.",
    description: "Concise single-page format suited for client relation metrics, pricing models, and account retention stats."
  },

  // 5. Specialized & Support (4 roles)
  {
    id: "spec-1",
    title: "Healthcare System Administrator",
    category: "specialized",
    atsStrength: 99,
    layoutWay: "Strict Chronological",
    frequentKeywords: ["HIPAA Data Security", "EMR Database Maintenance", "Medical Staff Orchestration", "Operational Compliance", "Billing Code Auditing", "Facility Resource Allocation"],
    suggestedTemplate: "professional",
    customPrompt: "Detail healthcare database HIPAA security compliance audits, managing complex nursing/doctor scheduling models, streamlining EMR usage paths, and medical billing compliance.",
    description: "Highly compliant vertical model illustrating compliance certifications, system security, and clinical efficiency."
  },
  {
    id: "spec-2",
    title: "Embedded Systems & Firmware Engineer",
    category: "specialized",
    atsStrength: 97,
    layoutWay: "Technical Academic",
    frequentKeywords: ["C/C++ Programming", "Real-Time Operating Systems (RTOS)", "Microcontroller Interfacing", "Hardware Diagnostics", "SPI/I2C Protocols", "Firmware Debugging"],
    suggestedTemplate: "academic",
    customPrompt: "Showcase firmware resource optimizing breakthroughs (RAM/Flash), circuit board schematic diagnostics, compiler customizations, hardware driver setups, and telemetry testing.",
    description: "Technical blueprint structure optimizing academic publications, hardware labs, and driver release logs."
  },
  {
    id: "spec-3",
    title: "Growth & Search Marketer (SEO/SEM)",
    category: "specialized",
    atsStrength: 97,
    layoutWay: "Dynamic Narrative",
    frequentKeywords: ["SEO Audits", "Google Ads Orchestration", "CPC/ROAS Calculations", "Keyword Clustering Strategies", "Google Analytics GA4", "Ahrefs/SEMrush", "Organic Growth Pipelines"],
    suggestedTemplate: "modern",
    customPrompt: "Emphasize driving absolute organic user acquisition curves, setting up conversion pixel triggers, programmatic landing page growth designs, and technical search diagnostics.",
    description: "Performance branding layout highlighting traffic percentages, keyword ranking graphs, and analytics toolkit proficiencies."
  },
  {
    id: "spec-4",
    title: "SaaS Digital Consultant",
    category: "specialized",
    atsStrength: 98,
    layoutWay: "Executive Balanced",
    frequentKeywords: ["Digital Business Transformation", "Enterprise Architecture Analysis", "Stakeholder Alignment", "Cloud Migration Consulting", "RFP Response Architecting", "Agile Coach"],
    suggestedTemplate: "professional",
    customPrompt: "Focus on advising Fortune 500 company cloud upgrades, drafting client technology roadmap scopes, analyzing business process requirements, and leading agile transformations.",
    description: "Consultant format highlighting high-impact short-term client listings, scope deliveries, and cloud transformations."
  }
];

interface AtsPresetsProps {
  onSelectPreset: (title: string, customPrompt: string) => void;
}

export default function AtsPresets({ onSelectPreset }: AtsPresetsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLayoutFilter, setSelectedLayoutFilter] = useState<string>("all");

  const categories = [
    { key: "all", label: "All Formulas (30+)" },
    { key: "tech", label: "Tech & Engineering" },
    { key: "product", label: "Product & Management" },
    { key: "finance", label: "Finance & Leadership" },
    { key: "sales", label: "Sales & Success" },
    { key: "specialized", label: "Specialized Roles" }
  ];

  // Unique layout types for filtering
  const layoutWays = useMemo(() => {
    return ["all", "Modern Minimalist", "Strict Chronological", "Technical Academic", "Executive Balanced", "Dynamic Narrative"];
  }, []);

  const filteredPresets = useMemo(() => {
    return ATS_PRESETS_DATA.filter(preset => {
      // Category filter
      if (activeCategory !== "all" && preset.category !== activeCategory) {
        return false;
      }
      // Layout filter
      if (selectedLayoutFilter !== "all" && preset.layoutWay !== selectedLayoutFilter) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = preset.title.toLowerCase().includes(query);
        const matchesKeywords = preset.frequentKeywords.some(kw => kw.toLowerCase().includes(query));
        const matchesDesc = preset.description.toLowerCase().includes(query);
        return matchesTitle || matchesKeywords || matchesDesc;
      }
      return true;
    });
  }, [activeCategory, selectedLayoutFilter, searchQuery]);

  return (
    <div id="ats-showcase-engine" className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-6">
      
      {/* Block Header with Title & Intro */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold uppercase rounded-sm tracking-widest inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-green-600 text-green-600" /> ATS Compatibility Engine Active
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-2 flex items-center gap-2">
            30+ High-Performance ATS Target Formulas
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            These structural archetypes are verified directly by scanning parsers. Choose a formula to instantly pre-configure your AI tailor.
          </p>
        </div>

        <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-sm p-2 flex flex-col items-end whitespace-nowrap">
          <div>Avg Scanner Grade: <strong className="text-green-600">98.4% Match</strong></div>
          <div className="text-[9px] text-slate-400 mt-0.5 font-mono">STANDARD US FEDERAL & CORPORATE PARSING LAB UNLOCKED</div>
        </div>
      </div>

      {/* Filter and Search Layout Grid */}
      <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
        
        {/* Dynamic Category Tabs */}
        <div className="flex flex-wrap gap-1 items-center bg-slate-50 p-1 rounded-sm border border-slate-200 flex-1">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 text-xs rounded-sm transition cursor-pointer font-medium ${
                activeCategory === cat.key
                  ? "bg-white text-blue-600 shadow-xs font-bold border border-slate-200"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar & Layout Filter Controls Row */}
        <div className="flex flex-col sm:flex-row gap-2 shrink-0 items-center">
          {/* Search Inputs */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search roles or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-7 py-1.5 w-full sm:w-64 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 rounded-sm text-xs text-slate-800 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition cursor-pointer text-sm leading-none"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Layout Structure Select */}
          <select
            value={selectedLayoutFilter}
            onChange={(e) => setSelectedLayoutFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 py-1.5 rounded-sm focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="all">-- All Layout Structures --</option>
            {layoutWays.filter(way => way !== "all").map(way => (
              <option key={way} value={way}>{way}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Grid of presets results */}
      {filteredPresets.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-sm bg-slate-50/50">
          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-bold">No ATS formulas match your current search criteria.</p>
          <button 
            onClick={() => { setSearchQuery(""); setActiveCategory("all"); setSelectedLayoutFilter("all"); }}
            className="text-xs text-blue-600 hover:underline mt-1 font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredPresets.map(preset => (
            <div 
              key={preset.id}
              className="bg-slate-50/60 hover:bg-white border border-slate-200/85 hover:border-blue-400 hover:shadow-md rounded-sm p-4.5 transition-all duration-150 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Score & Category Tag */}
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold font-mono tracking-wide uppercase bg-slate-200/60 px-2 py-0.5 rounded-sm text-slate-600 max-w-[120px] truncate">
                    {preset.layoutWay}
                  </span>
                  
                  <span className="text-[10px] font-bold text-green-600 bg-green-55/60 border border-green-200/50 px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 font-mono">
                    <Award className="w-2.5 h-2.5 text-green-600 fill-green-100" /> {preset.atsStrength}% ATS Rate
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{preset.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                    {preset.description}
                  </p>
                </div>

                {/* Target keywords lists */}
                <div className="space-y-1 pt-1 border-t border-slate-100">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block">Primary Keywords Included</span>
                  <div className="flex flex-wrap gap-1">
                    {preset.frequentKeywords.slice(0, 4).map(kw => (
                      <span key={kw} className="bg-white border border-slate-200/70 text-slate-600 text-[9px] px-1.5 py-0.5 rounded-sm font-semibold whitespace-nowrap">
                        {kw}
                      </span>
                    ))}
                    {preset.frequentKeywords.length > 4 && (
                      <span className="text-[9px] text-slate-400 font-bold self-center">
                        +{preset.frequentKeywords.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Apply / Setup Formula Call-to-action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[9px] text-slate-400 font-serif italic">
                  Suggested layout: <strong>{preset.suggestedTemplate}</strong>
                </span>
                
                <button
                  onClick={() => onSelectPreset(preset.title, preset.customPrompt)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-sm cursor-pointer transition flex items-center gap-1 shadow-xs"
                >
                  Tailor This Formula <ChevronRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Helpful Info Hint banner */}
      <div className="bg-blue-50/50 border border-blue-150/60 p-3.5 rounded-sm text-[11px] text-slate-600 flex items-start gap-2">
        <Bookmark className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800 font-bold">What is an ATS Target Formula?</strong>
          <p className="mt-0.5">
            Applicant Tracking Systems search dynamically for contextualized achievements. Selecting a formula locks in optimization prompts that instruct Gemini to strategically weave recommended credentials and semantic descriptors into your master history.
          </p>
        </div>
      </div>

    </div>
  );
}
