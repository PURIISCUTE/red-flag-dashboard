import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { TerminalPage } from './components/TerminalNavbar';
import { UserSession, IndustryLens } from './types';

export type PageView = 
  | 'landing' 
  | 'login' 
  | 'signup' 
  | 'terminal' 
  | 'lenses' 
  | 'matrix' 
  | 'financials' 
  | 'simulator' 
  | 'filings' 
  | 'queue';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash === 'login') return 'login';
    if (hash === 'signup') return 'signup';
    if (hash === 'terminal' || hash === 'dashboard') return 'terminal';
    if (hash === 'lenses') return 'lenses';
    if (hash === 'matrix' || hash === 'flags') return 'matrix';
    if (hash === 'financials') return 'financials';
    if (hash === 'simulator') return 'simulator';
    if (hash === 'filings') return 'filings';
    if (hash === 'queue' || hash === 'investigation') return 'queue';
    return 'landing';
  });

  const [currentTicker, setCurrentTicker] = useState<string>('AAPL');
  const [currentLens, setCurrentLens] = useState<IndustryLens | undefined>(undefined);
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('redflag_user_session');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      delete parsed.organization;
      delete parsed.tier;
      delete parsed.role;
      try {
        localStorage.setItem('redflag_user_session', JSON.stringify(parsed));
      } catch {}
      return parsed;
    } catch {
      return null;
    }
  });

  // Handle URL hash changes for browser history navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'landing' || hash === '') setCurrentPage('landing');
      else if (hash === 'login') setCurrentPage('login');
      else if (hash === 'signup') setCurrentPage('signup');
      else if (hash === 'lenses') setCurrentPage('lenses');
      else if (hash === 'matrix' || hash === 'flags') setCurrentPage('matrix');
      else if (hash === 'financials') setCurrentPage('financials');
      else if (hash === 'simulator') setCurrentPage('simulator');
      else if (hash === 'filings') setCurrentPage('filings');
      else if (hash === 'queue' || hash === 'investigation') setCurrentPage('queue');
      else setCurrentPage('terminal');
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageView, hashUpdate = true) => {
    setCurrentPage(page);
    if (hashUpdate) {
      window.location.hash = page === 'landing' ? '' : page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchTerminal = (ticker?: string, page: TerminalPage = 'terminal', lens?: IndustryLens) => {
    if (ticker) {
      setCurrentTicker(ticker.toUpperCase());
    }
    if (lens) {
      setCurrentLens(lens);
    }
    navigateTo(page as PageView);
  };

  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    try {
      localStorage.setItem('redflag_user_session', JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to persist session to localStorage', e);
    }
    navigateTo('terminal');
  };

  const handleSignupSuccess = (session: UserSession) => {
    setUserSession(session);
    try {
      localStorage.setItem('redflag_user_session', JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to persist session to localStorage', e);
    }
    navigateTo('terminal');
  };

  const handleLogout = () => {
    setUserSession(null);
    try {
      localStorage.removeItem('redflag_user_session');
    } catch (e) {
      console.warn('Failed to clear session from localStorage', e);
    }
    navigateTo('landing');
  };

  const handleUpdateUserSession = (updated: UserSession) => {
    delete (updated as any).organization;
    delete (updated as any).tier;
    delete (updated as any).role;
    setUserSession(updated);
    try {
      localStorage.setItem('redflag_user_session', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist session to localStorage', e);
    }
  };

  // Render active view
  if (currentPage === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSignup={() => navigateTo('signup')}
        onNavigateToLanding={() => navigateTo('landing')}
        onDirectTerminalAccess={() => navigateTo('terminal')}
      />
    );
  }

  if (currentPage === 'signup') {
    return (
      <SignupPage
        onSignupSuccess={handleSignupSuccess}
        onNavigateToLogin={() => navigateTo('login')}
        onNavigateToLanding={() => navigateTo('landing')}
        onDirectTerminalAccess={() => navigateTo('terminal')}
      />
    );
  }

  // All terminal workspaces (executive overview, 7 lenses, 30 flags matrix, financials, simulator, filings, queue)
  if (
    currentPage === 'terminal' ||
    currentPage === 'lenses' ||
    currentPage === 'matrix' ||
    currentPage === 'financials' ||
    currentPage === 'simulator' ||
    currentPage === 'filings' ||
    currentPage === 'queue'
  ) {
    return (
      <DashboardPage
        currentTicker={currentTicker}
        onSelectTicker={(ticker) => setCurrentTicker(ticker)}
        activeTerminalPage={currentPage as TerminalPage}
        onNavigateTerminalPage={(page) => navigateTo(page as PageView)}
        initialLens={currentLens}
        userSession={userSession}
        onUpdateUserSession={handleUpdateUserSession}
        onNavigateToLanding={() => navigateTo('landing')}
        onLogout={handleLogout}
      />
    );
  }

  // Default: Professional Cover / Landing Page
  return (
    <LandingPage
      onNavigateToTerminal={handleLaunchTerminal}
      onNavigateToLogin={() => navigateTo('login')}
      onNavigateToSignup={() => navigateTo('signup')}
    />
  );
}
