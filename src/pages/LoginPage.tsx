import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { UserSession } from '../types';
import { Logo } from '../components/Logo';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  onNavigateToSignup: () => void;
  onNavigateToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToSignup,
  onNavigateToLanding
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const demoPersonas: UserSession[] = [
    {
      id: 'usr_auditor',
      name: 'Pratik Surya',
      email: 'p.surya@forensic-audit.com',
      organization: 'Ernst & Young Forensic Practice',
      role: 'Principal Forensic Auditor',
      primaryLens: 'SaaS',
      isLoggedIn: true,
      tier: 'Institutional'
    },
    {
      id: 'usr_risk',
      name: 'Claire Kensington',
      email: 'kensington@citadel-sec.com',
      organization: 'Citadel Risk Advisory',
      role: 'Head of Portfolio Forensic Risk',
      primaryLens: 'AI/Deep Tech',
      isLoggedIn: true,
      tier: 'Institutional'
    },
    {
      id: 'usr_regulator',
      name: 'Marcus Vance',
      email: 'm.vance@pcaob.org',
      organization: 'PCAOB Division of Enforcement',
      role: 'Senior Regulatory Examiner',
      primaryLens: 'Banks',
      isLoggedIn: true,
      tier: 'Regulatory'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both your work email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      const session: UserSession = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].replace('.', ' '),
        email: email.trim(),
        organization: email.includes('@') ? email.split('@')[1].replace('.com', ' Corp') : 'Institutional Firm',
        role: 'Senior Financial Forensic Analyst',
        primaryLens: 'SaaS',
        isLoggedIn: true,
        tier: 'Institutional'
      };
      onLoginSuccess(session);
    }, 500);
  };

  const handleSelectDemoPersona = (persona: UserSession) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(persona);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col justify-between selection:bg-red-500 selection:text-white">
      {/* Top Bar */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={onNavigateToLanding}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Cover Page</span>
        </button>

        <Logo onClick={onNavigateToLanding} size="sm" showSubtitle={false} />
      </div>

      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl space-y-5 text-xs">
          {/* Header */}
          <div className="text-center space-y-1.5 pb-2 border-b border-slate-800">
            <div className="h-10 w-10 mx-auto bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-400 mb-2">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-white">
              Workstation Sign In
            </h2>
            <p className="text-slate-400 text-[11px]">
              Enter your credentials or choose a pre-configured profile below
            </p>
          </div>

          {error && (
            <div className="p-2.5 bg-red-950/40 border border-red-500/40 text-red-300 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Access */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 font-medium block">
              1-Click Demo Profiles:
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {demoPersonas.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectDemoPersona(p)}
                  className="w-full text-left p-2.5 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-lg transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-medium text-white">{p.name}</div>
                    <div className="text-[11px] text-slate-400">{p.organization} · {p.primaryLens}</div>
                  </div>
                  <span className="text-[11px] text-red-400 font-medium">Select →</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative px-3 bg-slate-900 text-slate-500 text-[11px]">or sign in with password</span>
          </div>

          {/* Custom Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-medium block">Work Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@forensics.com"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 px-8 py-2 text-xs text-white rounded-lg outline-none"
                />
                <Mail className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-medium block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 px-8 py-2 text-xs text-white rounded-lg outline-none"
                />
                <Lock className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-1 border-t border-slate-800 text-xs text-slate-400">
            Don't have an account yet?{' '}
            <button
              onClick={onNavigateToSignup}
              className="text-red-400 hover:underline font-medium"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* Statutory Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 text-center text-xs text-slate-400">
        © 2026 RedFlag Terminal · SEC EDGAR Ground Truth · PCAOB Forensic Alignment
      </div>
    </div>
  );
};
