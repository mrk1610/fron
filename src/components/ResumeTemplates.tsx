import { CandidateProfile } from "../types";

interface ResumeTemplatesProps {
  profile: CandidateProfile;
  templateId: string;
  onUpdate?: (updated: CandidateProfile) => void;
  isEditable?: boolean;
}

export default function ResumeTemplates({
  profile,
  templateId,
  onUpdate,
  isEditable = false,
}: ResumeTemplatesProps) {
  const { personalDetails, education, workExperience, skills, projects, achievements, aiAnalysis } = profile;

  // Generic handler for individual field updates
  const handlePersonalChange = (field: keyof typeof personalDetails, value: string) => {
    if (!onUpdate) return;
    onUpdate({
      ...profile,
      personalDetails: {
        ...personalDetails,
        [field]: value,
      },
    });
  };

  const handleWorkChange = (index: number, field: string, value: string) => {
    if (!onUpdate) return;
    const updatedWork = [...workExperience];
    updatedWork[index] = {
      ...updatedWork[index],
      [field]: value,
    };
    onUpdate({
      ...profile,
      workExperience: updatedWork,
    });
  };

  const handleEduChange = (index: number, field: string, value: string) => {
    if (!onUpdate) return;
    const updatedEdu = [...education];
    updatedEdu[index] = {
      ...updatedEdu[index],
      [field]: value,
    };
    onUpdate({
      ...profile,
      education: updatedEdu,
    });
  };

  const handleSkillChange = (index: number, value: string) => {
    if (!onUpdate) return;
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    onUpdate({
      ...profile,
      skills: updatedSkills,
    });
  };

  const handleProjectChange = (index: number, field: string, value: any) => {
    if (!onUpdate) return;
    const updatedProjects = [...projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    };
    onUpdate({
      ...profile,
      projects: updatedProjects,
    });
  };

  const handleAchievementChange = (index: number, field: string, value: string) => {
    if (!onUpdate) return;
    const updatedAchievements = [...achievements];
    updatedAchievements[index] = {
      ...updatedAchievements[index],
      [field]: value,
    };
    onUpdate({
      ...profile,
      achievements: updatedAchievements,
    });
  };

  const handleSummaryChange = (value: string) => {
    if (!onUpdate) return;
    onUpdate({
      ...profile,
      aiAnalysis: {
        ...(aiAnalysis || { summary: "", matchScore: 100, keyAdjustments: [], jdKeywords: [] }),
        summary: value,
      },
    });
  };

  // Modern Template Layout
  const renderModern = () => (
    <div id="resume-document" className="bg-white text-gray-800 p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto font-sans text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-indigo-600 pb-5 mb-5">
        <div className="flex justify-between items-start">
          <div>
            {isEditable ? (
              <input
                type="text"
                value={personalDetails.name}
                onChange={(e) => handlePersonalChange("name", e.target.value)}
                className="text-3xl font-extrabold text-gray-900 border-b border-dashed border-gray-300 focus:outline-none focus:border-indigo-600 bg-transparent py-0.5"
              />
            ) : (
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{personalDetails.name}</h1>
            )}
            
            {/* Tagline / AI Summary Preview */}
            <p className="text-indigo-600 font-medium mt-1">Ready Candidate</p>
          </div>
          <div className="text-right text-xs text-gray-500 space-y-1">
            {isEditable ? (
              <div className="flex flex-col space-y-1">
                <input
                  type="text"
                  value={personalDetails.email}
                  placeholder="Email"
                  onChange={(e) => handlePersonalChange("email", e.target.value)}
                  className="text-right border-b border-dashed border-gray-300 focus:outline-none bg-transparent"
                />
                <input
                  type="text"
                  value={personalDetails.phone}
                  placeholder="Phone"
                  onChange={(e) => handlePersonalChange("phone", e.target.value)}
                  className="text-right border-b border-dashed border-gray-300 focus:outline-none bg-transparent"
                />
                <input
                  type="text"
                  value={personalDetails.location}
                  placeholder="Location"
                  onChange={(e) => handlePersonalChange("location", e.target.value)}
                  className="text-right border-b border-dashed border-gray-300 focus:outline-none bg-transparent"
                />
              </div>
            ) : (
              <>
                <div>{personalDetails.email} | {personalDetails.phone}</div>
                <div>{personalDetails.location}</div>
                <div className="text-indigo-600">
                  {personalDetails.linkedin && <span>LinkedIn: {personalDetails.linkedin} </span>}
                  {personalDetails.website && <span>| Portfolio: {personalDetails.website}</span>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {(aiAnalysis?.summary || isEditable) && (
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-widest font-bold text-indigo-700 mb-2">Professional Summary</h2>
          {isEditable ? (
            <textarea
              value={aiAnalysis?.summary || ""}
              onChange={(e) => handleSummaryChange(e.target.value)}
              className="w-full text-gray-700 text-sm border border-dashed border-gray-300 rounded p-1.5 focus:outline-none focus:border-indigo-500 bg-transparent min-h-[60px]"
              placeholder="Elevate your resume with an optimized AI summary..."
            />
          ) : (
            <p className="text-gray-700 leading-relaxed text-sm italic">{aiAnalysis?.summary}</p>
          )}
        </div>
      )}

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-xs uppercase tracking-widest font-bold text-indigo-700 border-b border-gray-100 pb-1 mb-3">Professional Experience</h2>
        <div className="space-y-4">
          {workExperience.map((work, idx) => (
            <div key={idx} className="group relative">
              <div className="flex justify-between font-semibold text-gray-900 text-sm">
                <div className="flex items-center space-x-2">
                  {isEditable ? (
                    <input
                      type="text"
                      value={work.position}
                      onChange={(e) => handleWorkChange(idx, "position", e.target.value)}
                      className="border-b border-dashed border-gray-300 focus:outline-none bg-transparent font-semibold text-gray-900"
                    />
                  ) : (
                    <span>{work.position}</span>
                  )}
                  <span className="text-gray-400 font-light">@</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={work.company}
                      onChange={(e) => handleWorkChange(idx, "company", e.target.value)}
                      className="border-b border-dashed border-gray-300 focus:outline-none bg-transparent text-indigo-600"
                    />
                  ) : (
                    <span className="text-indigo-600">{work.company}</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 font-normal">
                  {isEditable ? (
                    <div className="flex space-x-1">
                      <input
                        type="text"
                        value={work.startDate}
                        onChange={(e) => handleWorkChange(idx, "startDate", e.target.value)}
                        className="w-16 border-b border-dashed border-gray-300 focus:outline-none bg-transparent"
                      />
                      <span>-</span>
                      <input
                        type="text"
                        value={work.endDate}
                        onChange={(e) => handleWorkChange(idx, "endDate", e.target.value)}
                        className="w-16 border-b border-dashed border-gray-300 focus:outline-none bg-transparent"
                      />
                    </div>
                  ) : (
                    <span>{work.startDate} – {work.endDate}</span>
                  )}
                </div>
              </div>
              
              {isEditable ? (
                <textarea
                  value={work.description}
                  onChange={(e) => handleWorkChange(idx, "description", e.target.value)}
                  className="w-full text-xs text-gray-600 border border-dashed border-gray-300 rounded p-1.5 mt-1.5 focus:outline-none bg-transparent font-mono min-h-[80px]"
                  placeholder="Insert duties, use \n for bullets"
                />
              ) : (
                <div className="mt-2 text-gray-600 text-[13px] space-y-1 pl-4">
                  {work.description.split("\n").map((bullet, bIdx) => (
                    <div key={bIdx} className="relative">
                      <span className="absolute -left-3 text-indigo-500">•</span>
                      <span>{bullet.replace(/^[-\s•*]+/, "")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h2 className="text-xs uppercase tracking-widest font-bold text-indigo-700 border-b border-gray-100 pb-1 mb-2">Skills & Expertise</h2>
        {isEditable ? (
          <input
            type="text"
            value={skills.join(", ")}
            onChange={(e) => {
              const updated = e.target.value.split(",").map(s => s.trim());
              if (onUpdate) onUpdate({ ...profile, skills: updated });
            }}
            placeholder="React, TypeScript, Python..."
            className="w-full text-sm border border-dashed border-gray-300 rounded p-1.5 focus:outline-none bg-transparent font-mono"
          />
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-slate-50 text-slate-800 text-xs px-2.5 py-1 rounded font-medium border border-slate-100">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-xs uppercase tracking-widest font-bold text-indigo-700 border-b border-gray-100 pb-1 mb-3">Education</h2>
        <div className="space-y-3">
          {education.map((edu, idx) => (
            <div key={idx}>
              <div className="flex justify-between font-semibold text-gray-900 text-sm">
                <div>
                  {isEditable ? (
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEduChange(idx, "degree", e.target.value)}
                      className="border-b border-dashed border-gray-300 focus:outline-none bg-transparent"
                    />
                  ) : (
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  )}
                  <span className="text-gray-400 font-light mx-1">|</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => handleEduChange(idx, "school", e.target.value)}
                      className="border-b border-dashed border-gray-300 focus:outline-none bg-transparent text-gray-700"
                    />
                  ) : (
                    <span className="text-gray-700">{edu.school}</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 font-normal">
                  {isEditable ? (
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => handleEduChange(idx, "endDate", e.target.value)}
                      className="w-16 border-b border-dashed border-gray-300 focus:outline-none bg-transparent"
                    />
                  ) : (
                    <span>Graduated {edu.endDate}</span>
                  )}
                </div>
              </div>
              {edu.grade && (
                <div className="text-xs text-indigo-600 font-medium">Grade: {edu.grade}</div>
              )}
              {edu.description && (
                <p className="text-xs text-gray-500 mt-0.5">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-widest font-bold text-indigo-700 border-b border-gray-100 pb-1 mb-3">Key Projects</h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center font-bold text-gray-900 text-sm">
                  <div className="flex items-center space-x-1.5">
                    {isEditable ? (
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => handleProjectChange(idx, "title", e.target.value)}
                        className="border-b border-dashed border-gray-300 focus:outline-none bg-transparent"
                      />
                    ) : (
                      <span>{proj.title}</span>
                    )}
                    {proj.link && (
                      <span className="text-xs text-indigo-500 font-normal underline">({proj.link})</span>
                    )}
                  </div>
                </div>
                {isEditable ? (
                  <textarea
                    value={proj.description}
                    onChange={(e) => handleProjectChange(idx, "description", e.target.value)}
                    className="w-full text-xs text-gray-600 border border-dashed border-gray-300 rounded p-1.5 mt-1 focus:outline-none bg-transparent min-h-[40px]"
                  />
                ) : (
                  <p className="text-xs text-gray-600 leading-relaxed mt-0.5">{proj.description}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <h2 className="text-xs uppercase tracking-widest font-bold text-indigo-700 border-b border-gray-100 pb-1 mb-2">Honors & Achievements</h2>
          <div className="space-y-2">
            {achievements.map((ach, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <div>
                  <strong>{ach.title}</strong>: {ach.description}
                </div>
                <div className="text-gray-400 shrink-0">{ach.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Minimalist Template Layout
  const renderMinimal = () => (
    <div id="resume-document" className="bg-white text-slate-900 p-10 shadow-sm border border-gray-100 max-w-4xl mx-auto font-serif text-sm leading-relaxed">
      {/* Centered Name */}
      <div className="text-center mb-8 border-b border-slate-200 pb-6">
        {isEditable ? (
          <input
            type="text"
            value={personalDetails.name}
            onChange={(e) => handlePersonalChange("name", e.target.value)}
            className="text-4xl text-slate-800 tracking-wide font-light text-center border-b border-dashed border-gray-300 focus:outline-none focus:border-slate-800 bg-transparent py-1 mx-auto"
          />
        ) : (
          <h1 className="text-4xl text-slate-800 tracking-wide font-light">{personalDetails.name}</h1>
        )}
        <div className="text-xs font-sans text-slate-500 mt-2 tracking-widest uppercase flex flex-wrap justify-center gap-3">
          <span>{personalDetails.email}</span>
          <span>•</span>
          <span>{personalDetails.phone}</span>
          <span>•</span>
          <span>{personalDetails.location}</span>
        </div>
        {(personalDetails.linkedin || personalDetails.website) && (
          <div className="text-xs font-sans text-stone-600 mt-1 uppercase tracking-wider flex justify-center gap-2">
            {personalDetails.linkedin && <span>LinkedIn: {personalDetails.linkedin}</span>}
            {personalDetails.website && <span>Portfolio: {personalDetails.website}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {(aiAnalysis?.summary || isEditable) && (
        <div className="mb-6 text-center max-w-2xl mx-auto italic text-[13px] text-slate-600">
          {isEditable ? (
            <textarea
              value={aiAnalysis?.summary || ""}
              onChange={(e) => handleSummaryChange(e.target.value)}
              className="w-full text-center text-slate-600 text-xs border border-dashed border-gray-300 rounded p-1.5 focus:outline-none bg-transparent min-h-[60px]"
            />
          ) : (
            <p>"{aiAnalysis?.summary}"</p>
          )}
        </div>
      )}

      {/* Grid Content */}
      <div className="space-y-6">
        {/* Experience Section */}
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-slate-500 border-b border-slate-200 pb-1 mb-3">Experience</h2>
          <div className="space-y-4">
            {workExperience.map((work, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{work.position}</span>
                    <span className="text-slate-400 font-light italic"> at </span>
                    <span className="font-semibold text-slate-800">{work.company}</span>
                  </div>
                  <span className="text-xs font-sans text-slate-500">{work.startDate} – {work.endDate}</span>
                </div>
                {isEditable ? (
                  <textarea
                    value={work.description}
                    onChange={(e) => handleWorkChange(idx, "description", e.target.value)}
                    className="w-full text-xs text-slate-600 border border-dashed border-gray-300 rounded p-1.5 mt-1.5 focus:outline-none bg-transparent font-mono min-h-[70px]"
                  />
                ) : (
                  <div className="mt-1 text-slate-600 text-[13px] pl-4 space-y-0.5 list-disc">
                    {work.description.split("\n").map((bullet, bIdx) => (
                      <p key={bIdx} className="text-slate-600 leading-snug">
                        — {bullet.replace(/^[-\s•*]+/, "")}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-slate-500 border-b border-slate-200 pb-1 mb-3">Education</h2>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900">{edu.school}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{edu.degree} in {edu.fieldOfStudy} {edu.grade ? `(${edu.grade})` : ""}</p>
                </div>
                <span className="text-xs font-sans text-slate-500">{edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-slate-500 border-b border-slate-200 pb-1 mb-2">Technical Skills</h2>
          <p className="text-slate-700 text-xs tracking-wide font-sans">
            {skills.join("  |  ")}
          </p>
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-slate-500 border-b border-slate-200 pb-1 mb-3">Selected Portfolios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="border-l-2 border-slate-100 pl-3 py-0.5">
                  <h4 className="font-bold text-slate-900 text-xs">{proj.title} <span className="text-[10px] text-slate-400 font-mono font-normal">({proj.link})</span></h4>
                  <p className="text-slate-600 text-[12px] leading-relaxed mt-0.5">{proj.description}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1 italic">Stack: {proj.technologies.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Tech-Mono Hacker Layout
  const renderTech = () => (
    <div id="resume-document" className="bg-zinc-950 text-emerald-400 p-8 shadow-sm border border-emerald-800 max-w-4xl mx-auto font-mono text-xs leading-normal">
      {/* Header Info */}
      <div className="border border-emerald-700 p-4 mb-4 bg-zinc-900/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="text-gray-400 text-[10px]">&lt;candidate_identity&gt;</div>
            {isEditable ? (
              <input
                type="text"
                value={personalDetails.name}
                onChange={(e) => handlePersonalChange("name", e.target.value)}
                className="text-2xl font-bold text-emerald-300 border-b border-emerald-600 focus:outline-none bg-transparent"
              />
            ) : (
              <h1 className="text-2xl font-bold text-emerald-300 uppercase tracking-widest">{personalDetails.name}</h1>
            )}
            <div className="text-[10px] text-emerald-500 mt-1">STATUS: VERIFIED_DEVELOPER</div>
          </div>
          <div className="mt-3 md:mt-0 text-[11px] text-slate-400 space-y-1">
            <div>EMAIL: {personalDetails.email}</div>
            <div>PHONE: {personalDetails.phone}</div>
            <div>REGION: {personalDetails.location}</div>
            {personalDetails.linkedin && <div className="text-emerald-500">LI: {personalDetails.linkedin}</div>}
          </div>
        </div>
      </div>

      {/* AI Summary and keywords */}
      {(aiAnalysis?.summary || isEditable) && (
        <div className="mb-4 border border-zinc-800 p-3 bg-zinc-900/15">
          <span className="text-emerald-500 font-semibold">[Summary]</span>
          {isEditable ? (
            <textarea
              value={aiAnalysis?.summary || ""}
              onChange={(e) => handleSummaryChange(e.target.value)}
              className="w-full text-xs text-slate-300 border border-zinc-700 bg-transparent rounded p-1.5 focus:outline-none focus:border-emerald-600 focus:ring-0"
              rows={3}
            />
          ) : (
            <p className="text-zinc-300 mt-1 italic">"{aiAnalysis?.summary}"</p>
          )}
        </div>
      )}

      {/* Sections container */}
      <div className="space-y-4">
        {/* Work Experience */}
        <div>
          <div className="text-emerald-300 bg-emerald-950/40 px-2 py-0.5 border-l-4 border-emerald-500 mb-2 font-bold uppercase tracking-wider">
            :: SECTION_01 // PROFESSIONAL_EXPERIENCE
          </div>
          <div className="space-y-3">
            {workExperience.map((work, idx) => (
              <div key={idx} className="border-b border-zinc-900 pb-2">
                <div className="flex justify-between text-emerald-300 font-semibold">
                  <span>&gt; {work.position} @ {work.company}</span>
                  <span className="text-zinc-500">[{work.startDate} - {work.endDate}]</span>
                </div>
                <div className="text-gray-300 pl-4 mt-1 space-y-0.5 text-[11px]">
                  {work.description.split("\n").map((b, bIdx) => (
                    <div key={bIdx} className="flex">
                      <span className="text-emerald-600 mr-2">*</span>
                      <span>{b.replace(/^[-\s•*]+/, "")}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="text-emerald-300 bg-emerald-950/40 px-2 py-0.5 border-l-4 border-emerald-500 mb-2 font-bold uppercase tracking-wider">
            :: SECTION_02 // ACADEMIC_RECORDS
          </div>
          {education.map((edu, idx) => (
            <div key={idx} className="text-[11px]">
              <span className="text-emerald-300 font-semibold">&gt; {edu.degree} in {edu.fieldOfStudy}</span> | <span className="text-zinc-400">{edu.school}</span>
              <span className="text-zinc-500 ml-2">({edu.endDate})</span>
              {edu.grade && <span className="text-emerald-500 block">SCORE: {edu.grade}</span>}
            </div>
          ))}
        </div>

        {/* Skills */}
        <div>
          <div className="text-emerald-300 bg-emerald-950/40 px-2 py-0.5 border-l-4 border-emerald-500 mb-2 font-bold uppercase tracking-wider">
            :: SECTION_03 // CORE_SKILLS
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-zinc-900 border border-emerald-900 px-2 py-0.5 rounded text-emerald-400">
                [{skill}]
              </span>
            ))}
          </div>
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <div className="text-emerald-300 bg-emerald-950/40 px-2 py-0.5 border-l-4 border-emerald-500 mb-2 font-bold uppercase tracking-wider">
              :: SECTION_04 // PORTFOLIO_REPOS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="border border-zinc-800 p-2 rounded">
                  <div className="text-emerald-300 font-semibold">&gt; {proj.title}</div>
                  <p className="text-zinc-400 text-[11px] mt-1">{proj.description}</p>
                  <p className="text-[10px] text-emerald-600 mt-1">ENV: {proj.technologies.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Executive Template Layout
  const renderExecutive = () => (
    <div id="resume-document" className="bg-white text-[#1a1a1a] p-10 shadow-sm border border-stone-200 max-w-4xl mx-auto font-serif text-[13px] leading-relaxed">
      {/* Name and Centered Identity */}
      <div className="text-center mb-6">
        {isEditable ? (
          <input
            type="text"
            value={personalDetails.name}
            onChange={(e) => handlePersonalChange("name", e.target.value)}
            className="text-3xl font-bold font-serif uppercase tracking-tight text-center border-b border-dashed border-stone-400 focus:outline-none bg-transparent mx-auto"
          />
        ) : (
          <h1 className="text-3xl font-bold font-serif uppercase tracking-tight text-stone-900">{personalDetails.name}</h1>
        )}
        <div className="text-[11px] font-sans text-stone-500 mt-1.5 uppercase tracking-widest">
          {personalDetails.location} &nbsp;|&nbsp; {personalDetails.phone} &nbsp;|&nbsp; {personalDetails.email}
        </div>
        {(personalDetails.linkedin || personalDetails.website) && (
          <div className="text-[10px] font-sans text-stone-400/80 uppercase tracking-widest mt-0.5">
            {personalDetails.linkedin && <span>LinkedIn: {personalDetails.linkedin} &nbsp;&nbsp;</span>}
            {personalDetails.website && <span>Portfolio: {personalDetails.website}</span>}
          </div>
        )}
      </div>

      <div className="w-full h-[1px] bg-stone-300 mb-5"></div>

      {/* Summary */}
      {(aiAnalysis?.summary || isEditable) && (
        <div className="mb-5">
          <h2 className="font-sans font-bold text-stone-800 text-xs uppercase tracking-wider border-b border-stone-200 pb-0.5 mb-2">Executive Summary</h2>
          {isEditable ? (
            <textarea
              value={aiAnalysis?.summary || ""}
              onChange={(e) => handleSummaryChange(e.target.value)}
              className="w-full text-[#1a1a1a] text-[13px] border border-dashed border-stone-300 rounded p-1.5 focus:outline-none bg-transparent min-h-[60px]"
            />
          ) : (
            <p className="text-stone-700 pr-2 italic">{aiAnalysis?.summary}</p>
          )}
        </div>
      )}

      {/* Work Experience */}
      <div className="mb-5">
        <h2 className="font-sans font-bold text-stone-800 text-xs uppercase tracking-wider border-b border-stone-200 pb-0.5 mb-3">Employment History</h2>
        <div className="space-y-4">
          {workExperience.map((work, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline font-bold text-stone-900">
                <div>
                  <span className="font-semibold text-stone-800">{work.position}</span>
                  <span className="font-light text-stone-400">, </span>
                  <span className="font-bold underline uppercase tracking-tight">{work.company}</span>
                </div>
                <span className="text-xs font-sans text-stone-500 font-normal">{work.startDate} — {work.endDate}</span>
              </div>
              <div className="mt-1 text-stone-700 text-xs pl-4 space-y-0.5">
                {work.description.split("\n").map((b, bIdx) => (
                  <p key={bIdx} className="text-stone-700 leading-normal">
                    • {b.replace(/^[-\s•*]+/, "")}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="mb-5">
        <h2 className="font-sans font-bold text-stone-800 text-xs uppercase tracking-wider border-b border-stone-200 pb-0.5 mb-3">Education & Credentials</h2>
        <div className="space-y-3">
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-start text-stone-800">
              <div>
                <span className="font-bold">{edu.school}</span>
                <span className="text-stone-500"> — {edu.degree} in {edu.fieldOfStudy}</span>
                {edu.grade && <span className="text-xs text-stone-500 italic block">Grade Accomplishment: {edu.grade}</span>}
              </div>
              <span className="text-xs font-sans text-stone-500">{edu.endDate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-5">
        <h2 className="font-sans font-bold text-stone-800 text-xs uppercase tracking-wider border-b border-stone-200 pb-0.5 mb-2">Areas of expertise</h2>
        <p className="text-stone-700 text-xs tracking-normal">
          {skills.join(",  ")}
        </p>
      </div>

      {/* Achievements / Honors */}
      {achievements.length > 0 && (
        <div>
          <h2 className="font-sans font-bold text-stone-800 text-xs uppercase tracking-wider border-b border-stone-200 pb-0.5 mb-2">Key Distinctions</h2>
          <div className="space-y-2">
            {achievements.map((ach, idx) => (
              <div key={idx} className="flex justify-between text-xs text-stone-700">
                <div>
                  <strong>{ach.title}</strong>: {ach.description}
                </div>
                <div className="font-sans text-stone-400 font-light shrink-0">{ach.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ATS Safe Layout
  const renderAtsSafe = () => (
    <div id="resume-document" className="bg-white text-slate-900 p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto font-sans text-xs leading-relaxed">
      <div className="border-b border-slate-300 pb-3 mb-4">
        <h1 className="text-xl font-bold uppercase text-slate-900">{personalDetails.name}</h1>
        <p className="text-slate-600 mt-1">{personalDetails.email} | {personalDetails.phone} | {personalDetails.location}</p>
        {(personalDetails.linkedin || personalDetails.website) && (
          <p className="text-[10px] text-slate-500 mt-1">LinkedIn: {personalDetails.linkedin || "N/A"} | Website: {personalDetails.website || "N/A"}</p>
        )}
      </div>
      {aiAnalysis?.summary && (
        <div className="mb-4">
          <strong className="block text-[11px] uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-1">Professional Summary</strong>
          <p className="text-slate-700 mt-1">{aiAnalysis.summary}</p>
        </div>
      )}
      <div className="mb-4">
        <strong className="block text-[11px] uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-2">Work Experience</strong>
        <div className="space-y-3">
          {workExperience.map((work, idx) => (
            <div key={idx}>
              <div className="flex justify-between font-bold text-slate-900">
                <span>{work.position} - {work.company}</span>
                <span>{work.startDate} to {work.endDate}</span>
              </div>
              <div className="mt-1 text-slate-650 space-y-0.5 pl-4">
                {work.description.split("\n").map((b, i) => (
                  <p key={i}>• {b.replace(/^[-\s•*]+/, "")}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <strong className="block text-[11px] uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-1">Skills & Certifications</strong>
        <p className="text-slate-700 mt-1">{skills.join(", ")}</p>
      </div>
      <div className="mb-4">
        <strong className="block text-[11px] uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-2">Education</strong>
        <div className="space-y-2">
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between">
              <div>
                <span className="font-bold">{edu.school}</span> - {edu.degree} in {edu.fieldOfStudy}
                {edu.grade && <span className="text-slate-500 italic block">Grade Accomplishment: {edu.grade}</span>}
              </div>
              <span className="text-slate-500">{edu.endDate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Modern Dark Theme
  const renderModernDark = () => (
    <div id="resume-document" className="bg-[#0f172a] text-slate-250 p-8 shadow-sm border border-slate-850 max-w-4xl mx-auto font-sans text-xs leading-relaxed">
      <div className="border-b border-blue-500/50 pb-5 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{personalDetails.name}</h1>
          <p className="text-blue-400 font-medium text-xs mt-1">Strategic Candidate Professional</p>
        </div>
        <div className="text-slate-400 md:text-right space-y-0.5">
          <p>{personalDetails.email} | {personalDetails.phone}</p>
          <p>{personalDetails.location}</p>
          {personalDetails.linkedin && <p className="text-blue-400">{personalDetails.linkedin}</p>}
        </div>
      </div>
      {aiAnalysis?.summary && (
        <div className="mb-5 bg-slate-900/40 p-3 rounded-sm border border-slate-800">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-1.5">Executive Summary</h2>
          <p className="text-slate-300 italic">"{aiAnalysis.summary}"</p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1 mb-3">Employment History</h2>
            <div className="space-y-3">
              {workExperience.map((work, idx) => (
                <div key={idx} className="border-l-2 border-slate-800 pl-3.5 py-0.5">
                  <div className="flex justify-between text-white font-semibold">
                    <span>{work.position} <strong className="text-blue-400">@ {work.company}</strong></span>
                    <span className="text-xs text-slate-500 font-normal">{work.startDate} – {work.endDate}</span>
                  </div>
                  <div className="mt-1.5 text-slate-300 space-y-1">
                    {work.description.split("\n").map((b, i) => (
                      <p key={i}>• {b.replace(/^[-\s•*]+/, "")}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1 mb-2.5">Skills Highlight</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-slate-900 text-slate-100 text-[10px] px-2 py-0.5 border border-slate-800 rounded-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1 mb-2">Education</h2>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={idx} className="text-[11px]">
                  <p className="font-bold text-white">{edu.degree}</p>
                  <p className="text-slate-400">{edu.school} ({edu.endDate})</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Minimal Clean
  const renderMinimalClean = () => (
    <div id="resume-document" className="bg-white text-[#2b2b2b] p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto font-sans text-xs leading-relaxed">
      <div className="border-b border-slate-100 pb-4 mb-5">
        <h1 className="text-2xl font-light tracking-wide text-slate-950 uppercase">{personalDetails.name}</h1>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
          {personalDetails.email} / {personalDetails.phone} / {personalDetails.location}
        </p>
      </div>
      {aiAnalysis?.summary && (
        <div className="mb-5 max-w-2xl text-slate-500 italic">
          <p>{aiAnalysis.summary}</p>
        </div>
      )}
      <div className="space-y-5">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-0.5 mb-3">Timeline Experience</h2>
          <div className="space-y-4">
            {workExperience.map((work, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <div className="md:col-span-1 text-slate-400 text-[10px] uppercase font-mono">{work.startDate} – {work.endDate}</div>
                <div className="md:col-span-4 pl-1">
                  <h4 className="font-bold text-slate-900">{work.position} at {work.company}</h4>
                  <div className="mt-1 text-slate-600 space-y-0.5">
                    {work.description.split("\n").map((b, i) => (
                      <p key={i}>— {b.replace(/^[-\s•*]+/, "")}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Academics</h2>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={idx} className="text-slate-655">
                  <strong className="text-slate-900">{edu.school}</strong>
                  <p>{edu.degree} in {edu.fieldOfStudy} ({edu.endDate})</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Technical Skill Matrix</h2>
            <p className="text-slate-600 line-clamp-3">{skills.join(", ")}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Sidebar Navy
  const renderSidebarNavy = () => (
    <div id="resume-document" className="bg-white text-slate-800 shadow-sm border border-slate-200 max-w-4xl mx-auto font-sans text-xs leading-relaxed grid grid-cols-1 md:grid-cols-3">
      {/* Sidebar (Navy Blue background) */}
      <div className="bg-[#1e293b] text-slate-300 p-6 md:p-8 space-y-6 md:col-span-1">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-xl font-black text-white uppercase tracking-tight leading-none">{personalDetails.name}</h1>
          <span className="w-10 h-1 bg-sky-400 block my-2 mx-auto md:mx-0"></span>
          <p className="text-xs text-sky-400 uppercase tracking-widest font-mono">Industry Pro</p>
        </div>
        <div className="space-y-3.5 pt-4 text-[11px] border-t border-slate-700">
          <strong className="text-white text-[10px] uppercase font-mono tracking-widest block text-sky-400">Personal Contact</strong>
          <p>📧 {personalDetails.email}</p>
          <p>📞 {personalDetails.phone}</p>
          <p>📍 {personalDetails.location}</p>
          {personalDetails.linkedin && <p className="truncate">🔗 {personalDetails.linkedin}</p>}
        </div>
        <div className="space-y-3 pt-4 border-t border-slate-700">
          <strong className="text-white text-[10px] uppercase font-mono tracking-widest block text-sky-400">Technical Assets</strong>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-slate-800 text-[10px] text-white px-2 py-0.5 rounded-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-3 pt-4 border-t border-slate-700">
          <strong className="text-white text-[10px] uppercase font-mono tracking-widest block text-sky-400">Education</strong>
          <div className="space-y-2 text-[11px]">
            {education.map((edu, idx) => (
              <div key={idx}>
                <p className="font-bold text-white leading-tight">{edu.degree}</p>
                <p className="text-slate-400 font-serif translate-y-0.5">{edu.school}</p>
                <p className="text-slate-500 text-[10px]">{edu.endDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Main Body Column */}
      <div className="md:col-span-2 p-6 md:p-8 space-y-6">
        {aiAnalysis?.summary && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold text-[#1e293b] uppercase tracking-widest border-b border-slate-200 pb-1">Professional Focus</h2>
            <p className="text-slate-655 italic mt-1 font-serif">"{aiAnalysis.summary}"</p>
          </div>
        )}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-[#1e293b] uppercase tracking-widest border-b border-slate-200 pb-1">Career History</h2>
          <div className="space-y-4">
            {workExperience.map((work, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-slate-900 text-sm">{work.position}</h4>
                  <span className="text-slate-550 text-[11px] font-mono">{work.startDate} – {work.endDate}</span>
                </div>
                <p className="text-[#1e2a38] text-[11px] font-bold italic">{work.company}</p>
                <div className="text-slate-600 pl-3.5 space-y-1 pt-1">
                  {work.description.split("\n").map((b, i) => (
                    <p key={i} className="relative text-[11px]">
                      <span className="absolute -left-3 text-[#1e293b]">•</span>
                      {b.replace(/^[-\s•*]+/, "")}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {projects.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-[#1e293b] uppercase tracking-widest border-b border-slate-200 pb-1 font-sans">Strategic Portfolios</h2>
            {projects.map((proj, idx) => (
              <div key={idx} className="text-[11px]">
                <strong className="text-slate-850">{proj.title}</strong> — <span className="text-slate-600">{proj.description}</span>
                {proj.technologies && <p className="text-[10px] text-slate-400 font-mono mt-0.5">Stack: {proj.technologies.join(", ")}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Creative Green
  const renderCreativeGreen = () => (
    <div id="resume-document" className="bg-white text-slate-800 p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto font-sans text-xs leading-relaxed">
      <div className="border-l-8 border-emerald-600 pl-4 py-1 mb-5">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{personalDetails.name}</h1>
        <p className="text-emerald-700 font-semibold text-xs uppercase tracking-widest mt-1">Innovative Value Proposition</p>
        <p className="text-slate-500 mt-1.5 text-[10px] uppercase font-mono">
          {personalDetails.email} / {personalDetails.phone} / {personalDetails.location}
        </p>
      </div>
      {aiAnalysis?.summary && (
        <div className="mb-5 bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-sm">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 mb-1">Executive summary</h2>
          <p className="text-slate-700 font-serif italic text-xs">"{aiAnalysis.summary}"</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#164e63] border-b border-emerald-100 pb-1">Milestone History</h2>
          <div className="space-y-4">
            {workExperience.map((work, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-slate-900 text-sm">{work.position}</h4>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-2 py-0.5 rounded-sm">{work.startDate} – {work.endDate}</span>
                </div>
                <p className="text-emerald-700 font-semibold">{work.company}</p>
                <div className="text-slate-600 pl-3 space-y-0.5">
                  {work.description.split("\n").map((b, i) => (
                    <p key={i}>✓ {b.replace(/^[-\s•*]+/, "")}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#164e63] border-b border-emerald-100 pb-1 mb-2">Technical Mastery</h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-emerald-50 text-emerald-900 text-[10px] font-semibold border border-emerald-100 px-2 py-0.5 rounded-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#164e63] border-b border-emerald-100 pb-1 mb-2">Academic Alignment</h2>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={idx} className="text-[11px]">
                  <p className="font-bold text-slate-900">{edu.degree}</p>
                  <p className="text-slate-500 font-serif leading-snug">{edu.school}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Bold Header Styling
  const renderBoldHeader = () => (
    <div id="resume-document" className="bg-white text-slate-850 p-0 shadow-sm border border-slate-200 max-w-4xl mx-auto font-sans text-xs leading-relaxed">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-8 mb-6 text-center">
        <h1 className="text-3xl font-black text-white tracking-widest uppercase">{personalDetails.name}</h1>
        <p className="text-slate-100 text-xs mt-2 uppercase tracking-widest font-mono">
          {personalDetails.email} &nbsp;|&nbsp; {personalDetails.phone} &nbsp;|&nbsp; {personalDetails.location}
        </p>
      </div>
      <div className="px-8 pb-8 space-y-5">
        {aiAnalysis?.summary && (
          <div className="border-l-4 border-blue-600 pl-3">
            <h2 className="text-[10px] font-black uppercase text-blue-700 tracking-wider">Strategic Position</h2>
            <p className="text-slate-700 mt-1 italic">"{aiAnalysis.summary}"</p>
          </div>
        )}
        <div>
          <h2 className="text-[10px] font-black uppercase text-blue-705 border-b border-slate-200 pb-0.5 tracking-wider mb-2.5">Chronological Milestones</h2>
          <div className="space-y-4">
            {workExperience.map((work, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{work.position} — <strong className="text-blue-700 font-semibold">{work.company}</strong></span>
                  <span className="text-slate-500 font-mono text-[11px]">{work.startDate} – {work.endDate}</span>
                </div>
                <div className="text-slate-650 mt-1 pl-4 space-y-0.5">
                  {work.description.split("\n").map((b, i) => (
                    <p key={i}>• {b.replace(/^[-\s•*]+/, "")}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <h2 className="text-[10px] font-black uppercase text-blue-705 border-b border-slate-200 pb-0.5 tracking-wider mb-2">Skills Inventory</h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-800 text-[10px] px-2 py-0.5 border border-slate-200 rounded-sm font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase text-blue-705 border-b border-slate-200 pb-0.5 tracking-wider mb-2">Education Outline</h2>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={idx} className="text-slate-655">
                  <strong className="text-slate-900">{edu.school}</strong>
                  <p>{edu.degree} in {edu.fieldOfStudy} ({edu.endDate})</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Simple ATS layout
  const renderSimpleAts = () => (
    <div id="resume-document" className="bg-white text-black p-8 max-w-4xl mx-auto font-serif text-xs leading-normal">
      <div className="text-center space-y-0.5 mb-4">
        <h1 className="text-lg font-bold uppercase">{personalDetails.name}</h1>
        <p>{personalDetails.email} | {personalDetails.phone} | {personalDetails.location}</p>
        {personalDetails.linkedin && <p>LinkedIn: {personalDetails.linkedin}</p>}
      </div>
      {aiAnalysis?.summary && (
        <div className="mb-4">
          <h2 className="font-bold uppercase border-b border-black pb-0.5 text-xs">Professional Summary</h2>
          <p className="mt-1 text-slate-800">{aiAnalysis.summary}</p>
        </div>
      )}
      <div className="mb-4">
        <h2 className="font-bold uppercase border-b border-black pb-0.5 text-xs">Work Experience</h2>
        <div className="space-y-3 mt-1.5">
          {workExperience.map((work, idx) => (
            <div key={idx}>
              <div className="flex justify-between font-bold">
                <span>{work.company} — {work.position}</span>
                <span>{work.startDate} – {work.endDate}</span>
              </div>
              <div className="mt-1 pl-4 space-y-0.5">
                {work.description.split("\n").map((b, i) => (
                  <p key={i}>* {b.replace(/^[-\s•*]+/, "")}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <h2 className="font-bold uppercase border-b border-black pb-0.5 text-xs">Skills</h2>
        <p className="mt-1">{skills.join(", ")}</p>
      </div>
      <div className="mb-4">
        <h2 className="font-bold uppercase border-b border-black pb-0.5 text-xs">Education</h2>
        <div className="space-y-1.5 mt-1">
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{edu.school}, {edu.degree} in {edu.fieldOfStudy}</span>
              <span>{edu.endDate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Coral Accent
  const renderCoralAccent = () => (
    <div id="resume-document" className="bg-white text-slate-800 p-8 shadow-sm border border-slate-205 max-w-4xl mx-auto font-sans text-xs leading-relaxed">
      <div className="flex justify-between items-baseline border-b-2 border-coral-500 pb-3 mb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{personalDetails.name}</h1>
          <p className="text-rose-500 font-bold uppercase tracking-widest text-[10px] mt-1">Creative Value Strategist</p>
        </div>
        <div className="text-right text-slate-500 text-[10px] uppercase font-mono space-y-0.5">
          <p>{personalDetails.email} / {personalDetails.phone}</p>
          <p>{personalDetails.location}</p>
        </div>
      </div>
      {aiAnalysis?.summary && (
        <div className="mb-4 text-slate-600 font-serif italic text-xs leading-relaxed">
          <p>"{aiAnalysis.summary}"</p>
        </div>
      )}
      <div className="space-y-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Career Performance</h2>
          <div className="space-y-3">
            {workExperience.map((work, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-900">{work.position} — <strong className="text-rose-500 font-semibold">{work.company}</strong></span>
                  <span className="text-slate-400 font-mono text-[10px]">{work.startDate} – {work.endDate}</span>
                </div>
                <div className="mt-1 text-slate-600 pl-3 border-l border-rose-200">
                  {work.description.split("\n").map((b, i) => (
                    <p key={i}>• {b.replace(/^[-\s•*]+/, "")}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Qualifications</h2>
            <div className="space-y-1">
              {education.map((edu, idx) => (
                <div key={idx} className="text-slate-655">
                  <strong className="text-slate-900">{edu.school}</strong>
                  <p className="text-[11px]">{edu.degree} in {edu.fieldOfStudy}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Master Core Skills</h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-rose-50 text-rose-800 text-[9px] font-bold border border-rose-100 px-2 py-0.5 rounded-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Teal Split Layout
  const renderTealSplit = () => (
    <div id="resume-document" className="bg-white text-slate-800 shadow-sm border border-slate-200 max-w-4xl mx-auto font-sans text-xs leading-relaxed">
      <div className="bg-[#0f766e] text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider">{personalDetails.name}</h1>
          <p className="text-teal-200 text-xs uppercase tracking-widest font-mono mt-1">Specialized Lead Officer</p>
        </div>
        <div className="mt-3 md:mt-0 text-[11px] text-teal-100 md:text-right">
          <p>{personalDetails.email} | {personalDetails.phone}</p>
          <p>{personalDetails.location}</p>
        </div>
      </div>
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xs font-bold text-teal-850 uppercase tracking-widest border-b border-slate-200 pb-0.5">Chronological Experience</h2>
          <div className="space-y-3">
            {workExperience.map((work, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-slate-900">{work.position}</h4>
                  <span className="text-[10px] font-mono text-slate-500">{work.startDate} – {work.endDate}</span>
                </div>
                <p className="text-teal-700 italic font-medium">{work.company}</p>
                <div className="text-slate-600 pl-3 pt-1 space-y-0.5">
                  {work.description.split("\n").map((b, i) => (
                    <p key={i}>• {b.replace(/^[-\s•*]+/, "")}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <h2 className="text-xs font-bold text-teal-850 uppercase tracking-widest border-b border-slate-200 pb-0.5 mb-2.5">Key Core Assets</h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-teal-50 text-teal-905 border border-teal-100 text-[10px] px-2 py-0.5 rounded-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xs font-bold text-teal-850 uppercase tracking-widest border-b border-slate-200 pb-0.5 mb-2">Education Profile</h2>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={idx} className="text-slate-655">
                  <strong className="text-slate-900 block leading-tight">{edu.school}</strong>
                  <span className="text-[11px] text-slate-500">{edu.degree} ({edu.endDate})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Gray Slate Layout
  const renderGraySlate = () => (
    <div id="resume-document" className="bg-[#f8fafc] text-slate-800 p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto font-sans text-xs leading-relaxed">
      <div className="bg-slate-800 text-white p-6 mb-5 rounded-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase">{personalDetails.name}</h1>
          <p className="text-slate-400 mt-1">{personalDetails.location}</p>
        </div>
        <div className="text-right text-[11px] text-slate-300">
          <p>{personalDetails.email}</p>
          <p>{personalDetails.phone}</p>
        </div>
      </div>
      {aiAnalysis?.summary && (
        <div className="bg-white border border-slate-200 p-3 mb-4 rounded-sm italic">
          <p>"{aiAnalysis.summary}"</p>
        </div>
      )}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1">Professional History</h2>
          <div className="space-y-3">
            {workExperience.map((work, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{work.position} — <strong className="text-slate-700">{work.company}</strong></span>
                  <span className="text-slate-500 font-mono text-[10px]">{work.startDate} – {work.endDate}</span>
                </div>
                <div className="text-slate-600 mt-1 pl-4.5 space-y-0.5">
                  {work.description.split("\n").map((b, i) => (
                    <p key={i}>— {b.replace(/^[-\s•*]+/, "")}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1">Skills Highlight</h2>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Warm Amber
  const renderWarmAmber = () => (
    <div id="resume-document" className="bg-[#fdfbf7] text-[#453229] p-8 shadow-sm border border-amber-100 max-w-4xl mx-auto font-serif text-xs leading-relaxed">
      <div className="text-center border-b border-amber-200 pb-4 mb-5">
        <h1 className="text-3xl font-bold tracking-tight text-[#2c1d11]">{personalDetails.name}</h1>
        <p className="text-[#a16207] uppercase tracking-widest text-[10px] mt-1 font-sans">Corporate Consulting Candidate</p>
        <p className="text-slate-500 mt-1.5 text-[10px] font-sans uppercase">
          {personalDetails.email} &nbsp;&bull;&nbsp; {personalDetails.phone} &nbsp;&bull;&nbsp; {personalDetails.location}
        </p>
      </div>
      {aiAnalysis?.summary && (
        <div className="mb-5 italic text-center max-w-2xl mx-auto text-slate-600">
          <p>"{aiAnalysis.summary}"</p>
        </div>
      )}
      <div className="space-y-5">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#a16207] border-b border-amber-200 pb-1 mb-2.5 font-sans">Employment Timeline</h2>
          <div className="space-y-3.5">
            {workExperience.map((work, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold text-[#2c1d11]">
                  <span>{work.position} at {work.company}</span>
                  <span className="text-[11px] text-[#a16207] font-sans font-normal">{work.startDate} – {work.endDate}</span>
                </div>
                <div className="pl-4 mt-1 space-y-0.5 text-[#5c4a3b]">
                  {work.description.split("\n").map((b, i) => (
                    <p key={i}>• {b.replace(/^[-\s•*]+/, "")}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-amber-200 pt-3 font-sans">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#a16207] mb-2">Qualifications Core</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="text-xs text-[#5c4a3b]">
                <strong className="text-[#2c1d11]">{edu.school}</strong>
                <p>{edu.degree} in {edu.fieldOfStudy} ({edu.endDate})</p>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#a16207] mb-2">Primary Keyword Assets</h2>
            <p className="text-slate-600 line-clamp-2">{skills.join(", ")}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Two Column layout
  const renderTwoColumn = () => (
    <div id="resume-document" className="bg-white text-slate-800 p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto font-sans text-xs leading-relaxed grid grid-cols-3 gap-6">
      <div className="col-span-1 space-y-5 pr-2 border-r border-slate-100">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900">{personalDetails.name}</h1>
          <p className="text-blue-600 font-medium text-[10px] uppercase block tracking-wider mt-0.5">Focus Candidate</p>
        </div>
        <div className="space-y-2 text-[11px] text-slate-500 font-mono">
          <p className="font-bold uppercase text-slate-700 tracking-wider font-sans text-[10px]">Contact Details</p>
          <p className="truncate">📧 {personalDetails.email}</p>
          <p>📞 {personalDetails.phone}</p>
          <p>📍 {personalDetails.location}</p>
        </div>
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <strong className="text-[10px] uppercase tracking-wider text-slate-700 block">Expertise Areas</strong>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-850 border border-slate-200 text-[10px] px-2 py-0.5 rounded-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-2 space-y-5">
        {aiAnalysis?.summary && (
          <div className="italic text-slate-500">
            <p>"{aiAnalysis.summary}"</p>
          </div>
        )}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-150 pb-0.5">Chronological Milestones</h2>
          <div className="space-y-3">
            {workExperience.map((work, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{work.position} @ {work.company}</span>
                  <span className="font-mono text-slate-400 text-[10px]">{work.startDate} – {work.endDate}</span>
                </div>
                <div className="mt-1 text-slate-600 pl-3 space-y-0.5">
                  {work.description.split("\n").map((b, i) => (
                    <p key={i}>• {b.replace(/^[-\s•*]+/, "")}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Timeline chronology connecting vertical timeline dot style
  const renderTimeline = () => (
    <div id="resume-document" className="bg-white text-slate-800 p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto font-sans text-xs leading-relaxed">
      <div className="border-b border-slate-200 pb-4 mb-5 flex justify-between items-baseline">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{personalDetails.name}</h1>
          <p className="text-teal-605 font-bold uppercase tracking-wider text-[11px] mt-0.5">Career Timeline Format</p>
        </div>
        <div className="text-right text-[10px] text-slate-450 uppercase font-mono">
          <p>{personalDetails.email} / {personalDetails.location}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div>
            <strong className="text-[10px] uppercase text-slate-400 tracking-wider block mb-2">Qualifications</strong>
            {education.map((edu, idx) => (
              <div key={idx} className="text-[11px] leading-tight mb-2">
                <strong className="text-slate-900">{edu.school}</strong>
                <p className="text-slate-600 mt-0.5">{edu.degree}</p>
              </div>
            ))}
          </div>
          <div>
            <strong className="text-[10px] uppercase text-slate-400 tracking-wider block mb-1">Keywords</strong>
            <p className="text-slate-600 font-mono text-[10px]">{skills.join(", ")}</p>
          </div>
        </div>
        <div className="md:col-span-3 space-y-4">
          <strong className="text-[10px] uppercase text-slate-450 tracking-widest block border-b border-slate-100 pb-0.5 mb-2">Career Milestones</strong>
          <div className="relative border-l-2 border-slate-205 ml-1 pl-4 space-y-4">
            {workExperience.map((work, idx) => (
              <div key={idx} className="relative">
                <span className="w-3 h-3 bg-teal-500 rounded-full border border-white absolute -left-[21px] top-1"></span>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-slate-900">{work.position} at {work.company}</h4>
                  <span className="text-[10px] text-teal-600 font-bold">{work.startDate} – {work.endDate}</span>
                </div>
                <div className="mt-1 text-slate-600 space-y-0.5">
                  {work.description.split("\n").map((b, i) => (
                    <p key={i}>— {b.replace(/^[-\s•*]+/, "")}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Infographic layout with tags and custom projects achievements metrics
  const renderInfographic = () => (
    <div id="resume-document" className="bg-white text-slate-800 p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto font-sans text-xs leading-relaxed">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-slate-200 pb-4 mb-4">
        <div className="md:col-span-2 space-y-1.5">
          <h1 className="text-2xl font-extrabold text-blue-700 uppercase tracking-tight">{personalDetails.name}</h1>
          <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Data & Performance Focused Champion</p>
        </div>
        <div className="md:col-span-2 text-[10px] text-slate-450 uppercase font-mono md:text-right space-y-0.5">
          <p>📞 {personalDetails.phone} | 📧 {personalDetails.email}</p>
          <p>📍 {personalDetails.location}</p>
        </div>
      </div>
      {aiAnalysis?.summary && (
        <div className="mb-4 bg-slate-50 p-3 rounded border border-slate-200 text-slate-600 text-xs italic">
          <p>"{aiAnalysis.summary}"</p>
        </div>
      )}
      <div className="space-y-4">
        <div>
          <strong className="text-[10px] uppercase text-blue-700 tracking-widest block mb-2">Metrics Infographics Achievements</strong>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {workExperience.slice(0, 3).map((work, idx) => (
              <div key={idx} className="bg-blue-50/40 p-3 border border-blue-105 rounded-sm">
                <h5 className="font-bold text-slate-900 text-xs">{work.position} — <span className="text-blue-700">{work.company}</span></h5>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{work.startDate} – {work.endDate}</p>
                <p className="text-slate-600 mt-1 line-clamp-3 text-[11px] leading-tight">
                  {work.description.split("\n")[0] || "Key contributor"}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <strong className="text-[10px] uppercase text-blue-700 tracking-widest block mb-2.5">Skills Matrix Gauges</strong>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                ⭐ {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ATS Plus Layout
  const renderAtsPlus = () => (
    <div id="resume-document" className="bg-white text-slate-900 p-8 max-w-4xl mx-auto font-sans text-xs leading-normal">
      <div className="text-center space-y-0.5 mb-4 border-b border-slate-300 pb-3">
        <h1 className="text-xl font-extrabold uppercase">{personalDetails.name}</h1>
        <p className="font-bold text-blue-700 tracking-widest uppercase text-[10px]">Optimized Core Asset</p>
        <p>{personalDetails.email} &nbsp;|&nbsp; {personalDetails.phone} &nbsp;|&nbsp; {personalDetails.location}</p>
      </div>
      {aiAnalysis?.summary && (
        <div className="mb-4">
          <strong className="font-bold block uppercase border-b border-slate-400">Executive Briefing</strong>
          <p className="mt-1 text-slate-700">{aiAnalysis.summary}</p>
        </div>
      )}
      <div className="mb-4">
        <strong className="font-bold block uppercase border-b border-slate-400">Professional Experience</strong>
        <div className="space-y-3.5 mt-1.5">
          {workExperience.map((work, idx) => (
            <div key={idx}>
              <div className="flex justify-between font-bold">
                <span>{work.company} — {work.position}</span>
                <span>{work.startDate} – {work.endDate}</span>
              </div>
              <div className="mt-1 text-slate-700 pl-4 space-y-0.5">
                {work.description.split("\n").map((b, i) => (
                  <p key={i}>* {b.replace(/^[-\s•*]+/, "")}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <strong className="font-bold block uppercase border-[#94a3b8] border-b pb-0.5">Proven Keywords Assets</strong>
        <p className="mt-1">{skills.join(", ")}</p>
      </div>
    </div>
  );

  // Compact Layout
  const renderCompact = () => (
    <div id="resume-document" className="bg-white text-slate-900 p-6 shadow-sm border border-slate-200 max-w-4xl mx-auto font-sans text-[11px] leading-tight space-y-3">
      {/* Dynamic personal details header */}
      <div className="flex justify-between items-baseline border-b border-slate-350 pb-2">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">{personalDetails.name}</h1>
          <span className="text-[10px] text-indigo-600 block leading-none font-bold uppercase">{personalDetails.location}</span>
        </div>
        <div className="text-right text-[10px] text-slate-500 font-mono">
          <span>{personalDetails.email} | {personalDetails.phone}</span>
        </div>
      </div>
      <div>
        <strong className="uppercase text-[9px] font-bold text-slate-400 tracking-widest block border-b border-slate-100 pb-[1px] mb-1">Roles Matrix</strong>
        <div className="space-y-2">
          {workExperience.map((work, idx) => (
            <div key={idx} className="grid grid-cols-6 gap-2">
              <span className="col-span-1 text-[10px] text-slate-400 font-mono">{work.startDate} – {work.endDate}</span>
              <div className="col-span-5 leading-tight">
                <strong>{work.position} — {work.company}</strong>
                <p className="text-slate-600 mt-0.5 text-[10px] line-clamp-2">{work.description.substring(0, 160)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-1.5">
        <div>
          <strong className="uppercase text-[9px] font-bold text-slate-400 tracking-widest block mb-1">Academics Highlights</strong>
          <div className="space-y-1 text-[10px]">
            {education.slice(0, 2).map((edu, idx) => (
              <p key={idx}>{edu.degree} - {edu.school}</p>
            ))}
          </div>
        </div>
        <div>
          <strong className="uppercase text-[9px] font-bold text-slate-400 tracking-widest block mb-1">Core Tech</strong>
          <p className="text-slate-600 leading-none text-[10px]">{skills.slice(0, 15).join(", ")}</p>
        </div>
      </div>
    </div>
  );

  // Elegant Layout
  const renderElegant = () => (
    <div id="resume-document" className="bg-white text-stone-900 p-8 shadow-sm border border-stone-250 max-w-4xl mx-auto font-serif text-xs leading-relaxed">
      <div className="border border-stone-300 p-6 mb-5 text-center bg-stone-50/50">
        <h1 className="text-3xl font-light tracking-wide text-stone-950 uppercase">{personalDetails.name}</h1>
        <p className="text-[10px] uppercase font-sans tracking-widest text-stone-500 mt-1.5">Executive Elite Candidate</p>
        <p className="text-[10px] font-sans text-stone-400 mt-1.5 uppercase">
          {personalDetails.email} &bull; {personalDetails.phone} &bull; {personalDetails.location}
        </p>
      </div>
      <div className="space-y-4">
        {aiAnalysis?.summary && (
          <p className="italic text-center text-stone-700 max-w-xl mx-auto">"{aiAnalysis.summary}"</p>
        )}
        <div className="space-y-3">
          <strong className="block text-[10px] font-sans font-bold uppercase tracking-widest text-[#78350f] border-b border-stone-200 pb-0.5">Professional Experience</strong>
          {workExperience.map((work, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between font-bold text-stone-950">
                <span>{work.position} @ {work.company}</span>
                <span className="font-sans text-stone-500 font-normal">{work.startDate} – {work.endDate}</span>
              </div>
              <div className="pl-4 text-stone-700 space-y-0.5">
                {work.description.split("\n").map((b, i) => (
                  <p key={i}>• {b.replace(/^[-\s•*]+/, "")}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Fresh Blue Layout
  const renderFreshBlue = () => (
    <div id="resume-document" className="bg-[#f0f9ff] text-slate-800 p-8 shadow-sm border border-sky-200 max-w-4xl mx-auto font-sans text-xs leading-relaxed">
      <div className="bg-white border border-sky-100 p-6 mb-5 rounded-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-sky-900 uppercase tracking-tight">{personalDetails.name}</h1>
          <p className="text-sky-600 mt-1 uppercase font-semibold text-[10px] tracking-wider">Dynamic Innovation Lead</p>
        </div>
        <div className="text-right text-[11px] text-slate-500 space-y-0.5">
          <p>{personalDetails.email}</p>
          <p>{personalDetails.phone}</p>
        </div>
      </div>
      <div className="space-y-4 bg-white p-5 border border-sky-100 rounded-sm">
        <h2 className="text-xs font-bold text-sky-900 uppercase tracking-widest border-b border-sky-100 pb-1">Professional Experience</h2>
        <div className="space-y-3.5">
          {workExperience.map((work, idx) => (
            <div key={idx}>
              <div className="flex justify-between font-bold">
                <span className="text-slate-900">{work.position} — <strong className="text-sky-600">{work.company}</strong></span>
                <span className="text-[10px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-sm">{work.startDate} – {work.endDate}</span>
              </div>
              <div className="mt-1 text-slate-600 pl-3.5 space-y-1">
                {work.description.split("\n").map((b, i) => (
                  <p key={i}>— {b.replace(/^[-\s•*]+/, "")}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Cyber Dark Mode Template
  const renderDarkMode = () => (
    <div id="resume-document" className="bg-[#0b0f19] text-[#94a3b8] p-8 shadow-sm border border-[#1e293b] max-w-4xl mx-auto font-sans text-xs leading-relaxed">
      <div className="border-b border-[#1e293b] pb-4 mb-5 flex justify-between items-center bg-[#0f172a] p-4 rounded-sm border">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">{personalDetails.name}</h1>
          <p className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] mt-1 font-mono">:: SYSTEM_ADMIN_ARCHITECT</p>
        </div>
        <div className="text-right text-[#64748b] text-[10px] font-mono space-y-0.5">
          <p>{personalDetails.email}</p>
          <p>{personalDetails.phone}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider border-b border-[#1e293b] pb-1">HISTORY_STREAM</h2>
          <div className="space-y-3.5">
            {workExperience.map((work, idx) => (
              <div key={idx} className="border-l border-[#1e293b] pl-3">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-white leading-tight">{work.position}</h4>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">{work.startDate} — {work.endDate}</span>
                </div>
                <p className="text-[#38bdf8] font-semibold text-[11px] mt-0.5">{work.company}</p>
                <div className="text-slate-400 leading-relaxed pr-2 mt-1 space-y-0.5">
                  {work.description.split("\n").map((b, i) => (
                    <p key={i}>&gt; {b.replace(/^[-\s•*]+/, "")}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider border-b border-[#1e293b] pb-1 mb-2">ASSET_INDEX</h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-[#1e293b] text-white text-[10px] px-2 py-0.5 border border-[#334155] rounded-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Classic Professional Layout
  const renderClassic = () => (
    <div id="resume-document" className="bg-white text-slate-900 p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto font-serif text-xs leading-relaxed">
      <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
        <h1 className="text-2xl font-black tracking-wide uppercase text-slate-900">{personalDetails.name}</h1>
        <p className="text-xs italic text-slate-600 mt-1">{personalDetails.email} | {personalDetails.phone} | {personalDetails.location}</p>
        {personalDetails.linkedin && <p className="text-[10px] text-slate-500 mt-0.5">LinkedIn: {personalDetails.linkedin}</p>}
      </div>
      {aiAnalysis?.summary && (
        <div className="mb-4 text-center max-w-2xl mx-auto italic text-slate-700">
          <p>{aiAnalysis.summary}</p>
        </div>
      )}
      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-350 pb-0.5 mb-2">Professional Experience</h2>
        <div className="space-y-3">
          {workExperience.map((work, idx) => (
            <div key={idx}>
              <div className="flex justify-between font-bold text-slate-950">
                <span>{work.position} — <span className="font-semibold">{work.company}</span></span>
                <span className="font-sans text-[10px] text-slate-500">{work.startDate} – {work.endDate}</span>
              </div>
              <div className="mt-1 text-slate-700 space-y-0.5 pl-4">
                {work.description.split("\n").map((b, i) => (
                  <p key={i}>• {b.replace(/^[-\s•*]+/, "")}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-350 pb-0.5 mb-1.5">Expertise Highlights</h2>
        <p className="text-slate-705">{skills.join(", ")}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-350 pb-0.5 mb-2">Education Profile</h2>
        <div className="space-y-1.5">
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between">
              <div>
                <strong>{edu.school}</strong> — {edu.degree} in {edu.fieldOfStudy}
              </div>
              <span className="text-slate-500 font-sans text-[10px]">{edu.endDate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Creative Rose Gold
  const renderRoseGold = () => (
    <div id="resume-document" className="bg-white text-slate-800 p-8 shadow-sm border border-rose-100 max-w-4xl mx-auto font-sans text-xs leading-relaxed">
      <div className="text-center border-b border-rose-100 pb-4 mb-4">
        <h1 className="text-3xl font-light text-slate-900 tracking-wider uppercase">{personalDetails.name}</h1>
        <p className="text-[#be123c] font-bold uppercase tracking-widest text-[9px] mt-1.5">Creative Director Portfolio</p>
        <p className="text-slate-400 text-[10px] font-sans mt-1">
          {personalDetails.email} &nbsp;|&nbsp; {personalDetails.phone} &nbsp;|&nbsp; {personalDetails.location}
        </p>
      </div>
      {aiAnalysis?.summary && (
        <p className="text-center text-slate-500 italic max-w-xl mx-auto font-serif">"{aiAnalysis.summary}"</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#be123c] border-b border-rose-100 pb-0.5">Career Catalog</h2>
          <div className="space-y-3.5">
            {workExperience.map((work, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{work.position} ({work.company})</span>
                  <span className="font-normal text-slate-400 text-[10px]">{work.startDate} – {work.endDate}</span>
                </div>
                <div className="text-slate-600 pl-3 border-l border-rose-200 mt-1">
                  {work.description.split("\n").map((b, i) => (
                    <p key={i}>• {b.replace(/^[-\s•*]+/, "")}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#be123c] border-b border-rose-100 pb-0.5">Focus Disciplines</h2>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-rose-50/70 border border-rose-200/50 text-[#be123c] text-[10px] px-2 py-0.5 rounded-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Selector
  switch (templateId) {
    case "classic":
      return renderClassic ? renderClassic() : renderModern();
    case "moderndark":
      return renderModernDark();
    case "minimalclean":
      return renderMinimalClean();
    case "sidebar":
      return renderSidebarNavy();
    case "creativegreen":
      return renderCreativeGreen();
    case "boldheader":
      return renderBoldHeader();
    case "simpleats":
      return renderSimpleAts();
    case "coralaccent":
      return renderCoralAccent();
    case "tealsplit":
      return renderTealSplit();
    case "grayslate":
      return renderGraySlate();
    case "warmamber":
      return renderWarmAmber();
    case "twocolumn":
      return renderTwoColumn();
    case "timeline":
      return renderTimeline();
    case "infographic":
      return renderInfographic();
    case "atssafe":
      return renderAtsSafe();
    case "atsplus":
      return renderAtsPlus();
    case "compact":
      return renderCompact();
    case "elegant":
      return renderElegant();
    case "freshblue":
      return renderFreshBlue();
    case "darkmode":
      return renderDarkMode();
    case "rosegold":
      return renderRoseGold();
    case "minimal":
      return renderMinimal();
    case "tech":
      return renderTech();
    case "executive":
      return renderExecutive();
    case "modern":
    default:
      return renderModern();
  }
}
