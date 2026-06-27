import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { User } from "../types";
import { X, User as UserIcon, Mail, Lock, Shield, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";

interface UserSettingsProps {
  user: User;
  onClose: () => void;
  onNameUpdate: (name: string) => void;
}

export default function UserSettings({ user, onClose, onNameUpdate }: UserSettingsProps) {
  const isGoogleUser = user.provider === "google";

  const [name, setName] = useState(user.name);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleNameSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setNameLoading(true);
    setNameMsg(null);
    const { error } = await supabase.auth.updateUser({ data: { full_name: trimmed } });
    setNameLoading(false);
    if (error) {
      setNameMsg({ type: "error", text: error.message });
    } else {
      onNameUpdate(trimmed);
      setNameMsg({ type: "success", text: "Display name updated." });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (newPassword.length < 8) {
      setPwMsg({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    setPwLoading(true);
    // Supabase re-authenticates implicitly via the active session; no need to pass currentPassword separately,
    // but we reauthenticate first to validate the current password.
    const { error: reAuthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (reAuthError) {
      setPwLoading(false);
      setPwMsg({ type: "error", text: "Current password is incorrect." });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwLoading(false);
    if (error) {
      setPwMsg({ type: "error", text: error.message });
    } else {
      setPwMsg({ type: "success", text: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-sm shadow-2xl w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Account Settings</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Manage your profile and security</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-sm hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Account Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Account Info</span>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {isGoogleUser ? (
                <>
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.61 14.94 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.86 3C6.27 7.58 8.9 5.04 12 5.04z" />
                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.46h6.46c-.28 1.47-1.11 2.72-2.36 3.56l3.66 2.84c2.14-1.97 3.39-4.87 3.39-8.5z" />
                    <path fill="#FBBC05" d="M5.36 14.5c-.24-.72-.37-1.49-.37-2.3s.13-1.58.37-2.3l-3.86-3C.54 8.74 0 10.31 0 12c0 1.69.54 3.26 1.5 5.1l3.86-3c0-.3-.0-.6-.0-.8z" />
                    <path fill="#34A853" d="M12 23c3.24 0 5.96-1.08 7.95-2.93l-3.66-2.84c-1 .67-2.28 1.07-3.66 1.07-3.1 0-5.73-2.54-6.64-5.46l-3.86 3C3.39 20.35 7.35 23 12 23z" />
                  </svg>
                  <span className="text-slate-600 font-medium">Signed in with Google</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-600 font-medium">Email & Password</span>
                </>
              )}
            </div>
          </div>

          {/* Display Name */}
          <form onSubmit={handleNameSave} className="space-y-3">
            <div className="flex items-center gap-2">
              <UserIcon className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Display Name</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:outline-none focus:bg-white text-xs text-slate-800 rounded-sm px-3 py-2 transition"
              />
              <button
                type="submit"
                disabled={nameLoading || name.trim() === user.name}
                className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold px-4 py-2 rounded-sm transition cursor-pointer shrink-0"
              >
                {nameLoading ? "Saving..." : "Save"}
              </button>
            </div>
            {nameMsg && (
              <div className={`flex items-center gap-1.5 text-xs ${nameMsg.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
                {nameMsg.type === "success" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {nameMsg.text}
              </div>
            )}
          </form>

          {/* Password Change — email users only */}
          {!isGoogleUser ? (
            <form onSubmit={handlePasswordChange} className="space-y-3 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Change Password</span>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:outline-none focus:bg-white text-xs text-slate-800 rounded-sm px-3 py-2 pr-9 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="New password (min 8 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:outline-none focus:bg-white text-xs text-slate-800 rounded-sm px-3 py-2 pr-9 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:outline-none focus:bg-white text-xs text-slate-800 rounded-sm px-3 py-2 transition"
                />
              </div>

              {pwMsg && (
                <div className={`flex items-center gap-1.5 text-xs ${pwMsg.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
                  {pwMsg.type === "success" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {pwMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={pwLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold py-2 rounded-sm transition cursor-pointer"
              >
                {pwLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          ) : (
            <div className="border-t border-slate-100 pt-5 space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</span>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-sm p-3 text-xs text-blue-700">
                Your account is managed by Google. To change your password, visit your
                {" "}<a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2 hover:text-blue-900">Google Account security settings</a>.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
