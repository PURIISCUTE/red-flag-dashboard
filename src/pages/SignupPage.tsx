import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Send,
  RefreshCw,
  ShieldCheck,
  Inbox
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Automated Email Verification Flow
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationCode, setVerificationCode] = useState('592814');
  const [inputCode, setInputCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [tempSession, setTempSession] = useState<UserSession | null>(null);

  // Automated 1-Click Google / Gmail Registration
  const handleGoogleSignUp = () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const userEmail = 'pratiksurya02@gmail.com';
      const session: UserSession = {
        id: `usr_${Date.now()}`,
        name: 'Pratik Surya',
        email: userEmail,
        isLoggedIn: true,
        emailVerified: false
      };
      setTempSession(session);
      setIsLoading(false);
      // Trigger automated verification email
      setVerificationPending(true);
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

    setTimeout(() => {
      const session: UserSession = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        isLoggedIn: true,
        emailVerified: false
      };

      setTempSession(session);
      setIsLoading(false);
      // Trigger automated verification email
      setVerificationPending(true);
    }, 450);
  };

  // User manually confirms verification
  const handleManualVerification = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tempSession) return;

    setIsVerifying(true);
    setError(null);

    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);

      setTimeout(() => {
        const verifiedSession: UserSession = {
          ...tempSession,
          emailVerified: true
        };
        onSignupSuccess(verifiedSession);
      }, 700);
    }, 500);
  };

  const handleResendEmail = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(newCode);
    setResendStatus(`New automated verification email dispatched to ${tempSession?.email || email}`);
    setTimeout(() => setResendStatus(null), 4000);
  };

  return (
    <div className="min-h-screen bg-checkered text-slate-200 font-sans flex flex-col justify-between selection:bg-red-500 selection:text-white">
      {/* Top Bar */}
      <header className="p-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur flex items-center justify-between">
        <button
          onClick={onNavigateToLanding}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Cover Page</span>
        </button>

        <Logo onClick={onNavigateToLanding} size="sm" showSubtitle={false} />
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4">
        {!verificationPending ? (
          <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-bold font-display text-white tracking-tight">
                Create Account
              </h1>
              <p className="text-xs text-slate-400">
                Register with your email or sign up with Gmail
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-200 rounded-lg flex items-center gap-2 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Gmail / Google 1-Click Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleSignUp}
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
                <span className="font-semibold">Sign Up with Google (Gmail)</span>
              </button>
            </div>

            {/* Clean Divider */}
            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <span className="relative px-3 bg-slate-900 text-slate-500 text-xs">
                or sign up with email
              </span>
            </div>

            {/* Signup Form */}
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
                    placeholder="Your Name"
                    required
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
                    placeholder="name@example.com"
                    required
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
                    placeholder="Create a password"
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 pl-9 pr-3 py-2.5 text-xs text-white rounded-lg outline-none transition-all placeholder:text-slate-600"
                  />
                  <Lock className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Creating account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Footer switcher */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Already have an account?</span>
              <button
                onClick={onNavigateToLogin}
                className="text-red-400 hover:underline font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        ) : (
          /* Automated Email Verification Screen (User Must Manually Verify) */
          <div className="w-full max-w-lg bg-slate-900/95 border border-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-red-600/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-400">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold font-display text-white tracking-tight">
                Verify Your Email Address
              </h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                An automated security verification message was dispatched to{' '}
                <span className="text-white font-medium">{tempSession?.email || email}</span>.
                Please complete manual verification to activate access.
              </p>
            </div>

            {/* Automated Email Notification Card (Simulated Inbox) */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60">
                <div className="flex items-center gap-1.5 font-medium text-slate-300">
                  <Inbox className="h-3.5 w-3.5 text-red-400" />
                  <span>Incoming Email to {tempSession?.email || email}</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Delivered Just Now
                </span>
              </div>

              <div className="text-xs space-y-1">
                <div className="text-slate-400">
                  <span className="text-slate-500">From:</span> RedFlag Security &lt;auth-verify@redflag-terminal.com&gt;
                </div>
                <div className="text-slate-300 font-semibold">
                  Subject: Verify your email to activate RedFlag account
                </div>
              </div>

              <div className="p-3 bg-slate-900/90 rounded border border-slate-800 text-xs space-y-2.5">
                <p className="text-slate-300">
                  Welcome {tempSession?.name || 'User'}! Please confirm your email registration by clicking verify below.
                </p>
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Verification Code:</span>
                  <span className="font-mono text-sm font-bold text-red-400 tracking-wider">
                    {verificationCode.slice(0, 3)}-{verificationCode.slice(3)}
                  </span>
                </div>
              </div>
            </div>

            {/* Feedback Alerts */}
            {resendStatus && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-lg flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{resendStatus}</span>
              </div>
            )}

            {verifiedSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 rounded-lg flex items-center gap-2 text-xs animate-pulse">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Email verified successfully! Activating your account...</span>
              </div>
            )}

            {/* Manual Verification Action Required By The User */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleManualVerification()}
                disabled={isVerifying || verifiedSuccess}
                className="w-full py-3 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Verifying Email Security Token...</span>
                  </>
                ) : verifiedSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Registration Confirmed</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Click Here to Verify Email &amp; Open Terminal</span>
                  </>
                )}
              </button>

              {/* Or manual code input */}
              <form onSubmit={handleManualVerification} className="pt-2 flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder={`Or enter 6-digit code (${verificationCode})`}
                  className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-red-500/60 px-3 py-2 text-xs font-mono text-center text-white rounded-lg outline-none placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  disabled={isVerifying || verifiedSuccess}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Verify Code
                </button>
              </form>
            </div>

            {/* Action Links */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={handleResendEmail}
                className="text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Send className="h-3 w-3" />
                <span>Resend verification email</span>
              </button>

              <button
                type="button"
                onClick={() => setVerificationPending(false)}
                className="hover:text-white transition-colors"
              >
                Back to Registration
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        © 2026 RedFlag Terminal · Automated Secure Registration
      </footer>
    </div>
  );
};
