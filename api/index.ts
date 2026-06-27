import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;


// Bug #2: use x-real-ip (Vercel's trusted header) or the LAST entry of X-Forwarded-For
// (Vercel appends the real IP at the end — taking the first entry is client-spoofable)
function getClientIp(req: express.Request): string {
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp) return realIp;
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded) {
    const ips = forwarded.split(",");
    return ips[ips.length - 1].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
    return null;
  }
  return new GoogleGenAI({ apiKey: key });
}

const app = express();

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

app.post("/api/generate-resume", async (req, res) => {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ success: false, error: "Rate limit exceeded. Please wait a minute before trying again." });
  }
  try {
    const { profile, jdText, pdfFile, customPrompt } = req.body;
    const aiClient = getGeminiClient();

    if (!aiClient) {
      const tailoredProfileNote = {
        ...profile,
        aiAnalysis: {
          summary: "Highly skilled professional with verified experience. (NOTE: Set your GEMINI_API_KEY in the Settings menu to enable live Gemini tailoring!)",
          matchScore: 78,
          keyAdjustments: [
            "Highlighted core engineering principles from your profile",
            "Aligned tech stack priorities to simulated developer standards"
          ],
          jdKeywords: ["React", "TypeScript", "Problem Solving"],
          isFallback: true
        }
      };
      return res.json({ success: true, data: tailoredProfileNote });
    }

    // Bug #3: use pretty-printed JSON for size check — matches what's embedded in the prompt
    const profileJson = JSON.stringify(profile || {}, null, 2);
    if (profileJson.length > 60000) {
      return res.status(400).json({ success: false, error: "Profile is too large. Please reduce the number of entries and try again." });
    }
    const safeJdText = (jdText || "").slice(0, 10000);
    const safeCustomPrompt = (customPrompt || "").slice(0, 500);

    const promptText = `
You are a world-class ATS (Applicant Tracking System) optimization expert and professional resume writer.
Your SOLE objective is to maximize the candidate's ATS match score against the provided Job Description while keeping all content truthful and grounded in their real experience.

═══════════════════════════════════════════════════
CANDIDATE PROFILE:
${JSON.stringify(profile, null, 2)}

JOB DESCRIPTION:
${safeJdText || "No JD provided — optimize for professional best practices."}

CUSTOM INSTRUCTIONS:
${safeCustomPrompt || "Maximize ATS keyword alignment and achievement impact."}
═══════════════════════════════════════════════════

STEP 1 — KEYWORD EXTRACTION (do this internally first):
- Extract every technical skill, tool, framework, methodology, and qualification from the JD.
- Classify each as: REQUIRED (explicitly stated) or PREFERRED (nice-to-have).
- This list drives all decisions below.

STEP 2 — SKILLS MAXIMIZATION (most important for ATS score):
- Add ALL JD keywords to the skills array if the candidate's profile provides ANY evidence of related experience.
- Apply logical inference: JavaScript → TypeScript, React → Next.js/Redux, AWS experience → cloud computing, Node.js → Express.js, etc.
- Add adjacent tools the candidate almost certainly knows given their stack (e.g. if they use React, add JSX, Webpack/Vite, npm).
- Add ALL soft skills and methodologies from JD that apply (Agile, Scrum, CI/CD, code review, cross-functional collaboration).
- Aim for 25-35 skills total. Never remove existing skills — only add.
- Do NOT add skills with zero connection to their experience (e.g. do not add Kubernetes if they have never worked with containers).

STEP 3 — WORK EXPERIENCE REWRITE (second most important):
- Rewrite EVERY bullet point to start with a strong action verb.
- EVERY bullet MUST include a quantified outcome. Use real numbers from their profile if available. If not explicitly stated, add realistic industry-standard estimates marked with "~" (e.g. "~30% improvement", "~10,000 monthly users").
- Embed the top 5-8 JD keywords naturally across the bullet points — especially REQUIRED ones.
- Structure each bullet as: [Action Verb] + [Task using JD keyword] + [Quantified Result].
- Aim for 4-5 bullets per job, each 1-2 lines.

STEP 4 — PROFESSIONAL SUMMARY:
- Write a 3-sentence keyword-dense professional summary for aiAnalysis.summary.
- Sentence 1: Years of experience + core JD-matched skills (name at least 4 keywords from JD).
- Sentence 2: Most relevant achievement with a number.
- Sentence 3: Value proposition aligned to the target role's responsibilities.

STEP 5 — EDUCATION ENHANCEMENT:
- If education description is empty, add: "Relevant coursework: [3-5 courses from their field that align with JD keywords]."

STEP 6 — PROJECT & ACHIEVEMENT ALIGNMENT:
- Rewrite project descriptions to emphasize technologies that appear in the JD.
- Add metrics to projects if missing (users served, performance improvement, etc.).

STEP 7 — SCORE CALCULATION (be accurate, not modest):
- Start at 50% baseline.
- +5% for each REQUIRED JD skill now present in skills array (max +30%).
- +3% for each PREFERRED JD skill now present (max +15%).
- +5% if work experience bullets contain quantified metrics.
- +5% if professional summary contains 4+ JD keywords.
- +3% if projects/achievements align with JD responsibilities.
- -5% for each REQUIRED skill still missing after Step 2.
- Most candidates with relevant experience should score 78-92% after optimization.

STEP 8 — OUTPUT:
Return ONLY valid JSON. No markdown fences, no prose, no explanation outside the JSON.

JSON Response Shape:
{
  "personalDetails": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "website": "string"
  },
  "education": [
    {
      "school": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "startDate": "string",
      "endDate": "string",
      "grade": "string",
      "description": "string — add relevant coursework if empty"
    }
  ],
  "workExperience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "string",
      "endDate": "string",
      "location": "string",
      "description": "string — 4-5 bullets separated by \\n, each with action verb + JD keyword + metric"
    }
  ],
  "skills": ["string — 25 to 35 skills, all JD keywords included"],
  "projects": [
    {
      "title": "string",
      "description": "string — rewritten to emphasize JD-relevant technologies and include a metric",
      "technologies": ["string"],
      "link": "string"
    }
  ],
  "achievements": [
    {
      "title": "string",
      "description": "string",
      "date": "string"
    }
  ],
  "aiAnalysis": {
    "summary": "string — 3-sentence keyword-dense professional summary",
    "matchScore": number,
    "keyAdjustments": ["string — list every significant change made"],
    "jdKeywords": ["string — every keyword extracted from JD, both matched and unmatched"],
    "isFallback": false
  }
}
    `;

    // Bug #12: Use proper Gemini SDK Part format for mixed content (PDF + text)
    const parts: any[] = [];
    if (pdfFile && pdfFile.data && pdfFile.mimeType) {
      parts.push({ inlineData: { mimeType: pdfFile.mimeType, data: pdfFile.data } });
    }
    parts.push({ text: promptText });

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json"
      }
    });

    // Bug #10: response.text can be undefined when Gemini blocks output
    const responseText = response.text;
    if (!responseText) {
      throw new Error("Gemini returned an empty response. The request may have been blocked by safety filters or exceeded token limits.");
    }

    // Bug #7: Handle both ```json and plain ``` fences
    let cleanText = responseText.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.slice(7);
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.slice(3);
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.slice(0, -3);
    }
    cleanText = cleanText.trim();

    const parsedData = JSON.parse(cleanText);
    if (parsedData.aiAnalysis?.matchScore > 100) {
      parsedData.aiAnalysis.matchScore = 100;
    }
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Gemini tailing resume error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to process resume tailoring" });
  }
});

app.post("/api/analyze-resume", async (req, res) => {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ success: false, error: "Rate limit exceeded. Please wait a minute before trying again." });
  }
  try {
    const { profile } = req.body;
    const aiClient = getGeminiClient();

    if (!aiClient) {
      return res.json({
        success: true,
        suggestions: [
          "Add metric parameters to job descriptions (e.g., 'increased efficiency by 30%')",
          "Re-phrase actions starting with professional action verbs",
          "Set your GEMINI_API_KEY in Settings to get real-time tailored instructions for every section of your resume!"
        ]
      });
    }

    const promptText = `
Analyze this resume data and suggest 5 rich, practical, specific bullet points of advice to optimize it further.
Resume Profile Data:
${JSON.stringify(profile, null, 2)}

Return your answer strictly in JSON structure:
{
  "suggestions": ["string"]
}
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: promptText }] }],
      config: { responseMimeType: "application/json" }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Gemini returned an empty response.");
    }

    const data = JSON.parse(responseText);
    res.json({ success: true, suggestions: data.suggestions });
  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    // Bug #8: surface the real error message instead of a hardcoded generic string
    res.status(500).json({ success: false, error: error.message || "Failed to analyze resume" });
  }
});

export default app;
