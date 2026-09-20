import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Briefcase, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { UserSession, IndustryLens } from '../types';
import { Logo } from '../components/Logo';

interface SignupPageProps {
  onSignupSuccess: (session: UserSession) => void;
  onNavigateToLogin: () => void;
  onNavigateToLanding: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onSignupSuccess,
  onNavigateToLogin,
  onNavigateToLanding
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('Senior Forensic Accountant');
  const [primaryLens, setPrimaryLens] = useState<IndustryLens>('SaaS');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const availableRoles = [
    'Senior Forensic Accountant',
    'Long/Short Equity Portfolio Manager',
    'Quantitative Risk Officer',
    'PCAOB / SEC Compliance Examiner',
    'Corporate Controller & Auditor'
  ];

  const lenses: IndustryLens[] = [
    'SaaS',
    'Retail',
    'Payments',
    'Banks',
    'Tech Hardware',
    'Healthcare',
    'AI/Deep Tech'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !organization.trim() || !password.trim()) {
      setError('Please complete all required fields.');
      return;
    }
    if (!agreedToTerms) {
      setError('You must accept the terms of service.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      const session: UserSession = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        organization: organization.trim(),
        role: role,
        primaryLens: primaryLens,
        isLoggedIn: true,
        tier: 'Institutional'
      };
      onSignupSuccess(session);
    }, 500);
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

      {/* Main Form Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl space-y-5 text-xs">
          {/* Header */}
          <div className="text-center space-y-1.5 pb-2 border-b border-slate-800">
            <h2 className="text-base font-semibold text-white">
              Create Analyst Workstation
            </h2>
            <p className="text-slate-400 text-[11px]">
              Provision your institutional account with SEC EDGAR live telemetry
            </p>
          </div>

          {error && (
            <div className="p-2.5 bg-red-950/40 border border-red-500/40 text-red-300 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 text-xs font-medium block">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Pratik Surya"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 px-8 py-2 text-xs text-white rounded-lg outline-none"
                  />
                  <User className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-xs font-medium block">Work Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@firm.com"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 px-8 py-2 text-xs text-white rounded-lg outline-none"
                  />
                  <Mail className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 text-xs font-medium block">Organization / Fund</label>
                <div className="relative">
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Citadel Risk Management"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 px-8 py-2 text-xs text-white rounded-lg outline-none"
                  />
                  <Building2 className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-xs font-medium block">Professional Role</label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 px-8 py-2 text-xs text-white rounded-lg outline-none"
                  >
                    {availableRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <Briefcase className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-medium block">Primary Industry Lens</label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
                {lenses.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setPrimaryLens(l)}
                    className={`py-1.5 text-[11px] rounded transition-all font-medium ${
                      primaryLens === l
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-medium block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 px-8 py-2 text-xs text-white rounded-lg outline-none"
                />
                <Lock className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-slate-300">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="accent-red-500 rounded"
              />
              <label htmlFor="terms" className="text-[11px] cursor-pointer">
                I agree to the SEC EDGAR Data Usage Agreement and PCAOB Heuristic Guidelines
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <span>Provisioning Account...</span>
              ) : (
                <>
                  <span>Create Account &amp; Launch</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-1 border-t border-slate-800 text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-red-400 hover:underline font-medium"
            >
              Sign In
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
