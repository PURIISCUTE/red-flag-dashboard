import React, { useState } from 'react';
import { X, User, Mail, Shield, Check, Save } from 'lucide-react';
import { UserSession } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSession: UserSession | null;
  onUpdateUserSession: (updated: UserSession) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userSession,
  onUpdateUserSession
}) => {
  const [name, setName] = useState(userSession?.name || '');
  const [email, setEmail] = useState(userSession?.email || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if userSession changes
  React.useEffect(() => {
    if (userSession) {
      setName(userSession.name);
      setEmail(userSession.email);
    }
  }, [userSession]);

  if (!isOpen || !userSession) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserSession = {
      ...userSession,
      name: name.trim() || userSession.name,
      email: email.trim() || userSession.email
    };
    onUpdateUserSession(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const initial = (name || userSession.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn font-sans">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-xl shadow-2xl p-6 text-slate-200 relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-semibold">
              <User className="h-4 w-4 text-slate-300" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">User Profile</h2>
              <p className="text-xs text-slate-400">Manage your account information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User Card Header */}
        <div className="flex items-center gap-3.5 p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl">
          <div className="h-12 w-12 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-base font-bold text-red-400">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-white truncate">
              {name || userSession.name}
            </div>
            <div className="text-xs text-slate-400 truncate">
              {email || userSession.email}
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>Active Account</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 pl-9 pr-3 py-2 text-xs text-white rounded-lg outline-none transition-all placeholder:text-slate-600"
                placeholder="Your full name"
              />
              <User className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 pl-9 pr-3 py-2 text-xs text-white rounded-lg outline-none transition-all placeholder:text-slate-600"
                placeholder="name@example.com"
              />
              <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          {savedSuccess && (
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 rounded-lg flex items-center gap-2 text-xs">
              <Check className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
