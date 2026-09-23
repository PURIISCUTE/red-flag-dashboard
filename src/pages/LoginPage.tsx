import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Shield,
  Zap
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
  const [email, setEmail] = useState('pratiksurya02@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Direct 1-Click Google Sign-in
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const userEmail = 'pratiksurya02@gmail.com';
      const session: UserSession = {
        id: `usr_${Date.now()}`,
        name: 'Pratik Surya',
        email: userEmail,
        isLoggedIn: true,
        emailVerified: true,
        tier: 'Institutional',
        role: 'Forensic Equity Analyst'
      };
      setIsLoading(false);
      onLoginSuccess(session);
    }, 200);
  };

  // Standard Email & Password Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const cleanName = email.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

      const session: UserSession = {
        id: `usr_${Date.now()}`,
        name: formattedName || 'Forensic Analyst',
        email: email.trim(),
        isLoggedIn: true,
        emailVerified: true,
        tier: 'Institutional',
        role: 'Forensic Analyst'
      };

      setIsLoading(false);
      onLoginSuccess(session);
    }, 250);
  };

  // Instant Demo Access
  const handleQuickDemoAccess = () => {
    const session: UserSession = {
      id: 'usr_demo_terminal',
      name: 'Senior Forensic Analyst',
      email: 'analyst@redflag-terminal.sec',
      isLoggedIn: true,
      emailVerified: true,
      tier: 'Regulatory',
      role: 'Chief Audit Examiner'
    };
    onLoginSuccess(session);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col justify-between selection:bg-red-500 selection:text-white">
      {/* Top Bar */}
      <header className="p-4 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur flex items-center justify-between">
        <button
          onClick={onNavigateToLanding}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Cover Page</span>
        </button>

        <Logo onClick={onNavigateToLanding} size="sm" showSubtitle={false} />
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-bold font-display text-white tracking-tight">
              Sign In
            </h1>
            <p className="text-xs text-slate-400">
              Access the 30 Red Flags Forensic Terminal &amp; SEC EDGAR Audit Engine
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-200 rounded-lg flex items-center gap-2 text-xs animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-medium rounded-lg text-xs transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
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
            <span className="font-semibold">Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative px-3 bg-slate-900 text-slate-500 text-xs">
              or enter account credentials
            </span>
          </div>

          {/* Email & Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 text-xs font-medium block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 pl-9 pr-3 py-2.5 text-xs text-white rounded-lg outline-none transition-all placeholder:text-slate-600"
                />
                <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 text-xs font-medium block">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 pl-9 pr-9 py-2.5 text-xs text-white rounded-lg outline-none transition-all placeholder:text-slate-600"
                />
                <Lock className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-red-500 focus:ring-0 h-3.5 w-3.5"
                />
                <span>Remember session</span>
              </label>
              <button
                type="button"
                onClick={handleQuickDemoAccess}
                className="text-red-400 hover:text-red-300 font-medium"
              >
                Instant Demo Access
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={handleQuickDemoAccess}
              className="w-full py-2 px-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Explore as Guest Analyst (Instant Access)</span>
            </button>
          </div>

          {/* Footer Navigation */}
          <div className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onNavigateToSignup}
              className="text-red-400 hover:text-red-300 font-medium underline underline-offset-2"
            >
              Sign up
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-slate-800/60 text-center text-xs text-slate-500">
        RedFlag Terminal • Enterprise SEC Financial Forensics • All US Stock Tickers Supported
      </footer>
    </div>
  );
};
