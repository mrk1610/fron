import { supabase } from "./supabase";
import type { CandidateProfile, Resume, JobApplication } from "../types";

export async function fetchProfile(userId: string): Promise<CandidateProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    personalDetails: data.personal_details,
    education: data.education,
    workExperience: data.work_experience,
    skills: data.skills,
    projects: data.projects,
    achievements: data.achievements,
  };
}

// Bug #2: Write functions now throw on error so callers can detect and handle failures
export async function upsertProfile(userId: string, profile: CandidateProfile): Promise<void> {
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    name: profile.personalDetails.name,
    personal_details: profile.personalDetails,
    education: profile.education,
    work_experience: profile.workExperience,
    skills: profile.skills,
    projects: profile.projects,
    achievements: profile.achievements,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function fetchResumes(userId: string): Promise<Resume[]> {
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    targetJobTitle: row.target_job_title,
    targetCompany: row.target_company,
    profile: row.profile,
    template: row.template,
    updatedAt: row.updated_at,
  }));
}

export async function insertResume(userId: string, resume: Resume): Promise<void> {
  const { error } = await supabase.from("resumes").insert({
    id: resume.id,
    user_id: userId,
    title: resume.title,
    target_job_title: resume.targetJobTitle,
    target_company: resume.targetCompany,
    profile: resume.profile,
    template: resume.template,
    updated_at: resume.updatedAt,
  });
  if (error) throw error;
}

export async function deleteResume(resumeId: string): Promise<void> {
  const { error } = await supabase.from("resumes").delete().eq("id", resumeId);
  if (error) throw error;
}

export async function fetchApplications(userId: string): Promise<JobApplication[]> {
  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    jobTitle: row.job_title,
    company: row.company,
    status: row.status,
    dateApplied: row.date_applied,
    salary: row.salary,
    notes: row.notes,
    location: row.location,
    jobUrl: row.job_url,
    associatedResumeId: row.associated_resume_id,
  }));
}

export async function upsertApplication(userId: string, app: JobApplication): Promise<void> {
  const { error } = await supabase.from("job_applications").upsert({
    id: app.id,
    user_id: userId,
    job_title: app.jobTitle,
    company: app.company,
    status: app.status,
    date_applied: app.dateApplied,
    salary: app.salary || null,
    notes: app.notes || null,
    location: app.location || null,
    job_url: app.jobUrl || null,
    associated_resume_id: app.associatedResumeId || null,
  });
  if (error) throw error;
}

export async function deleteApplication(appId: string): Promise<void> {
  const { error } = await supabase.from("job_applications").delete().eq("id", appId);
  if (error) throw error;
}
