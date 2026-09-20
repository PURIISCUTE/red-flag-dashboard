import React, { useState } from 'react';
import { 
  Terminal, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Briefcase, 
  Building2, 
  CheckCircle2,
  AlertCircle,
  ArrowLeft
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
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Demo accounts for instant 1-click test login
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
      setError('Please provide both work email and terminal master key.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      // Create session from input
      const session: UserSession = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email.trim(),
        organization: email.includes('@') ? email.split('@')[1].toUpperCase().replace('.COM', ' CORP') : 'Institutional Firm',
        role: 'Senior Financial Forensic Analyst',
        primaryLens: 'SaaS',
        isLoggedIn: true,
        tier: 'Institutional'
      };
      onLoginSuccess(session);
    }, 600);
  };

  const handleSelectDemoPersona = (persona: UserSession) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(persona);
    }, 400);
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

      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0c1018] border border-[#222a3d] p-6 shadow-2xl space-y-6 font-mono text-xs">
          {/* Header */}
          <div className="text-center space-y-1.5 pb-2 border-b border-[#1b2336]">
            <div className="h-10 w-10 mx-auto bg-[#1a0f14] border border-[#FF4D4D]/50 flex items-center justify-center text-[#FF4D4D] mb-2 shadow-[0_0_12px_rgba(255,77,77,0.25)]">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Terminal Workstation Sign In
            </h2>
            <p className="text-[11px] text-[#718096]">
              Enter institutional credentials or choose a pre-configured persona
            </p>
          </div>

          {error && (
            <div className="p-2.5 bg-[#251014] border border-[#FF4D4D] text-[#FF4D4D] flex items-center gap-2 text-[11px]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-[#8a94a6] uppercase block mb-1">
                Institutional Work Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@firm.com"
                  className="w-full bg-[#05070a] border border-[#222a3d] focus:border-[#FF4D4D] px-8 py-2 text-white font-mono text-xs outline-none"
                />
                <Mail className="h-3.5 w-3.5 text-[#525f7a] absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#8a94a6] uppercase block mb-1">
                Master Security Key / Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#05070a] border border-[#222a3d] focus:border-[#FF4D4D] px-8 py-2 text-white font-mono text-xs outline-none"
                />
                <Lock className="h-3.5 w-3.5 text-[#525f7a] absolute left-2.5 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-[#525f7a] hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#718096]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#FF4D4D]"
                />
                <span>Remember workstation</span>
              </label>
              <span className="text-[#a5b4fc] hover:underline cursor-pointer">
                Reset Master Key
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#FF4D4D] hover:bg-[#e53e3e] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,77,77,0.3)] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>AUTHENTICATING WORKSTATION...</span>
              ) : (
                <>
                  <span>SIGN IN TO TERMINAL</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Fast 1-Click Institutional Personas */}
          <div className="pt-3 border-t border-[#1b2336] space-y-2">
            <span className="text-[10px] text-[#718096] uppercase font-bold block">
              Or 1-Click Instant Demo Personas:
            </span>

            <div className="space-y-1.5">
              {demoPersonas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => handleSelectDemoPersona(persona)}
                  className="w-full p-2 bg-[#07090e] hover:bg-[#121826] border border-[#1b2233] hover:border-[#2d3a54] text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-white font-bold text-[11px]">{persona.name}</div>
                    <div className="text-[10px] text-[#718096]">
                      {persona.role} • {persona.organization}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#a5b4fc] font-bold">LOGIN →</span>
                </button>
              ))}
            </div>
          </div>

          {/* Switch to Signup */}
          <div className="text-center pt-2 text-[11px] text-[#8a94a6]">
            Don&apos;t have an institutional account?{' '}
            <button
              onClick={onNavigateToSignup}
              className="text-[#FF4D4D] hover:underline font-bold"
            >
              Create Account
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
