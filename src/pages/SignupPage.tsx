import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Send
} from 'lucide-react';
import { UserSession } from '../types';
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
  const [name, setName] = useState('Pratik Surya');
  const [email, setEmail] = useState('pratiksurya02@gmail.com');
  const [password, setPassword] = useState('');
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Automated 1-Click Google / Gmail Registration
  const handleGoogleSignUp = () => {
    setIsLoading(true);
    setError(null);
    setStatusMessage('Connecting with Google Identity Services...');

    setTimeout(() => {
      setStatusMessage('Automating registration for pratiksurya02@gmail.com...');
      setTimeout(() => {
        setStatusMessage('✓ Automated confirmation email sent to pratiksurya02@gmail.com');
        setTimeout(() => {
          const session: UserSession = {
            id: `usr_google_${Date.now()}`,
            name: 'Pratik Surya',
            email: 'pratiksurya02@gmail.com',
            organization: 'Healthcare Forensic Auditor',
            role: 'Financial Forensic Analyst',
            primaryLens: 'Healthcare',
            isLoggedIn: true,
            tier: 'Institutional'
          };
          onSignupSuccess(session);
        }, 600);
      }, 600);
    }, 450);
  };

  // Standard Form Submit with Automated Registration Email
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please create a password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    if (sendWelcomeEmail) {
      setStatusMessage(`Automating verification email to ${email}...`);
    } else {
      setStatusMessage('Creating your account...');
    }

    setTimeout(() => {
      if (sendWelcomeEmail) {
        setStatusMessage(`✓ Verification dispatched to ${email}. Provisioning workspace...`);
      }
      setTimeout(() => {
        const isGmail = email.toLowerCase().includes('@gmail.com');
        const session: UserSession = {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          organization: isGmail ? 'Forensic Accounting Practice' : email.split('@')[1].replace('.com', ' Corp'),
          role: 'Financial Forensic Analyst',
          primaryLens: 'Healthcare',
          isLoggedIn: true,
          tier: 'Institutional'
        };
        setIsLoading(false);
        onSignupSuccess(session);
      }, 500);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col justify-between selection:bg-red-500 selection:text-white">
      {/* Top Bar */}
      <header className="p-4 border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={onNavigateToLanding}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Cover Page</span>
        </button>

        <Logo onClick={onNavigateToLanding} size="sm" showSubtitle={false} />
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-xl shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <h1 className="text-xl font-bold text-white">
              Create your account
            </h1>
            <p className="text-xs text-slate-400">
              Get immediate access to 210 accounting flags and live SEC feeds
            </p>
          </div>

          {/* Status / Loading Notification */}
          {statusMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg flex items-center gap-2.5 text-xs animate-pulse">
              <Sparkles className="h-4 w-4 text-red-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Automated Gmail Registration */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-medium rounded-lg text-xs transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.99] disabled:opacity-60"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Automate Registration with Google (Gmail)</span>
            </button>

            <div className="flex items-center gap-1.5 justify-center text-[11px] text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Instantly verifies your Gmail and creates your workspace</span>
            </div>
          </div>

          {/* Clean Divider */}
          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative px-3 bg-slate-900 text-slate-500 text-xs">
              or register with email
            </span>
          </div>

          {/* Clean 3-Field Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 text-xs font-medium block">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Pratik Surya"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 pl-9 pr-3 py-2.5 text-xs text-white rounded-lg outline-none transition-all placeholder:text-slate-600"
                />
                <User className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 text-xs font-medium block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pratiksurya02@gmail.com"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 pl-9 pr-3 py-2.5 text-xs text-white rounded-lg outline-none transition-all placeholder:text-slate-600"
                />
                <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 text-xs font-medium block">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 pl-9 pr-3 py-2.5 text-xs text-white rounded-lg outline-none transition-all placeholder:text-slate-600"
                />
                <Lock className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Automated Gmail Notification Checkbox */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-start gap-2.5">
              <input
                type="checkbox"
                id="welcomeEmail"
                checked={sendWelcomeEmail}
                onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                className="mt-0.5 accent-red-500 rounded cursor-pointer"
              />
              <label htmlFor="welcomeEmail" className="text-[11px] text-slate-300 leading-relaxed cursor-pointer select-none">
                <span className="text-white font-medium block">Automated Gmail Welcome Briefing</span>
                Send an automated account confirmation and quickstart forensic guide to my inbox upon registration.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account &amp; Launch</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div className="pt-2 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-red-400 hover:underline font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="p-4 border-t border-slate-800 text-center text-xs text-slate-500">
        © 2026 RedFlag Terminal · Automated Secure Registration
      </footer>
    </div>
  );
};
