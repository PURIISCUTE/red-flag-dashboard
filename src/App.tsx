import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { UserSession } from './types';

type PageView = 'landing' | 'login' | 'signup' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [currentTicker, setCurrentTicker] = useState<string>('AAPL');
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('redflag_user_session');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Clean up any legacy mock fields like Citadel Risk or Institutional
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
      if (hash === 'dashboard') setCurrentPage('dashboard');
      else if (hash === 'login') setCurrentPage('login');
      else if (hash === 'signup') setCurrentPage('signup');
      else if (hash === 'landing' || hash === '') setCurrentPage('landing');
    };

    // Check initial hash
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

  const handleLaunchDashboard = (ticker?: string) => {
    if (ticker) {
      setCurrentTicker(ticker.toUpperCase());
    }
    navigateTo('dashboard');
  };

  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    try {
      localStorage.setItem('redflag_user_session', JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to persist session to localStorage', e);
    }
    navigateTo('dashboard');
  };

  const handleSignupSuccess = (session: UserSession) => {
    setUserSession(session);
    try {
      localStorage.setItem('redflag_user_session', JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to persist session to localStorage', e);
    }
    navigateTo('dashboard');
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
      />
    );
  }

  if (currentPage === 'signup') {
    return (
      <SignupPage
        onSignupSuccess={handleSignupSuccess}
        onNavigateToLogin={() => navigateTo('login')}
        onNavigateToLanding={() => navigateTo('landing')}
      />
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <DashboardPage
        currentTicker={currentTicker}
        onSelectTicker={(ticker) => setCurrentTicker(ticker)}
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
      onNavigateToDashboard={handleLaunchDashboard}
      onNavigateToLogin={() => navigateTo('login')}
      onNavigateToSignup={() => navigateTo('signup')}
    />
  );
}
