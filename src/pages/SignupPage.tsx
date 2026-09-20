import React, { useState } from 'react';
import { 
  Terminal, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
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
      setError('You must accept the SEC EDGAR Data Terms and PCAOB verification protocols.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      const newSession: UserSession = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        organization: organization.trim(),
        role,
        primaryLens,
        isLoggedIn: true,
        tier: 'Institutional'
      };
      onSignupSuccess(newSession);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#080b10] text-[#e1e2ea] font-sans flex flex-col justify-between selection:bg-[#FF4D4D] selection:text-white">
      {/* Top Bar */}
      <div className="p-4 border-b border-[#1c2233] flex items-center justify-between">
        <button
          onClick={onNavigateToLanding}
          className="flex items-center gap-2 text-xs font-mono text-[#8a94a6] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>RETURN TO COVER PAGE</span>
        </button>

        <Logo onClick={onNavigateToLanding} size="sm" showSubtitle={false} />
      </div>

      {/* Main Form Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-[#0c1018] border border-[#222a3d] p-6 shadow-2xl space-y-5 font-mono text-xs">
          {/* Header */}
          <div className="text-center space-y-1.5 pb-2 border-b border-[#1b2336]">
            <div className="h-10 w-10 mx-auto bg-[#1a0f14] border border-[#FF4D4D]/50 flex items-center justify-center text-[#FF4D4D] mb-2 shadow-[0_0_12px_rgba(255,77,77,0.25)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Provision Institutional Account
            </h2>
            <p className="text-[11px] text-[#718096]">
              14-day full terminal access • All 210 forensic heuristics unlocked
            </p>
          </div>

          {error && (
            <div className="p-2.5 bg-[#251014] border border-[#FF4D4D] text-[#FF4D4D] flex items-center gap-2 text-[11px]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#8a94a6] uppercase block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full bg-[#05070a] border border-[#222a3d] focus:border-[#FF4D4D] px-8 py-2 text-white font-mono text-xs outline-none"
                    required
                  />
                  <User className="h-3.5 w-3.5 text-[#525f7a] absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#8a94a6] uppercase block mb-1">
                  Work Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="j.miller@fund.com"
                    className="w-full bg-[#05070a] border border-[#222a3d] focus:border-[#FF4D4D] px-8 py-2 text-white font-mono text-xs outline-none"
                    required
                  />
                  <Mail className="h-3.5 w-3.5 text-[#525f7a] absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#8a94a6] uppercase block mb-1">
                  Organization / Firm *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Citadel / PwC"
                    className="w-full bg-[#05070a] border border-[#222a3d] focus:border-[#FF4D4D] px-8 py-2 text-white font-mono text-xs outline-none"
                    required
                  />
                  <Building2 className="h-3.5 w-3.5 text-[#525f7a] absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#8a94a6] uppercase block mb-1">
                  Professional Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#05070a] border border-[#222a3d] focus:border-[#FF4D4D] px-8 py-2 text-white font-mono text-xs outline-none appearance-none"
                  >
                    {availableRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <Briefcase className="h-3.5 w-3.5 text-[#525f7a] absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#8a94a6] uppercase block mb-1">
                  Primary Forensic Focus Lens
                </label>
                <select
                  value={primaryLens}
                  onChange={(e) => setPrimaryLens(e.target.value as IndustryLens)}
                  className="w-full bg-[#05070a] border border-[#222a3d] focus:border-[#FF4D4D] px-3 py-2 text-white font-mono text-xs outline-none"
                >
                  {lenses.map((lens) => (
                    <option key={lens} value={lens}>
                      {lens} (30 Flags)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#8a94a6] uppercase block mb-1">
                  Create Master Security Key *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full bg-[#05070a] border border-[#222a3d] focus:border-[#FF4D4D] px-8 py-2 text-white font-mono text-xs outline-none"
                    required
                  />
                  <Lock className="h-3.5 w-3.5 text-[#525f7a] absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-[#8a94a6]">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="accent-[#FF4D4D] mt-0.5"
                />
                <span>
                  I agree to PCAOB audit standards, SEC EDGAR fair-access rules, and institutional platform terms.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#FF4D4D] hover:bg-[#e53e3e] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,77,77,0.3)] transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>PROVISIONING TERMINAL WORKSTATION...</span>
              ) : (
                <>
                  <span>CREATE TERMINAL ACCOUNT &amp; LAUNCH</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center pt-2 text-[11px] text-[#8a94a6] border-t border-[#1b2336]">
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-[#FF4D4D] hover:underline font-bold"
            >
              Sign In to Workstation
            </button>
          </div>
        </div>
      </div>

      {/* Legal Bar */}
      <div className="p-3 border-t border-[#1c2233] bg-[#07090f] text-center text-xs font-mono text-[#94a3b8] space-y-1">
        <div>
          © 2026 RedFlag Terminal. For informational purposes only — not investment advice. Data sourced via SEC EDGAR, Yahoo Finance, and Benchmark Feeds.
        </div>
        <div className="text-[11px] text-[#718096]">
          Deterministic heuristic flag calculations are conducted strictly for forensic discrepancy triage and corporate governance auditing under PCAOB guidelines.
        </div>
      </div>
    </div>
  );
};
