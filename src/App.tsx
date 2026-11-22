import React, { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroAndConnectedStage } from './components/HeroAndConnectedStage';
import { ApproachSection } from './components/ApproachSection';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { VisionSection } from './components/VisionSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { RoutePreviewModal } from './components/RoutePreviewModal';
import { AdminShell } from './components/admin/AdminShell';
import { AppShell } from './components/app/AppShell';
import { AppViewMode, FutureRouteId } from './types/navigation';

function resolveInitialViewMode(): AppViewMode {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  if (
    path === '/app' ||
    path.startsWith('/app/') ||
    hash.includes('#/app') ||
    params.get('view') === 'app'
  ) {
    return 'app';
  }
  if (
    path.startsWith('/dashboard') ||
    path.startsWith('/admin') ||
    hash.includes('dashboard') ||
    hash.includes('admin') ||
    params.get('view') === 'dashboard'
  ) {
    return 'dashboard';
  }
  return 'landing';
}

export default function App() {
  const [viewMode, setViewMode] = useState<AppViewMode>(() =>
    resolveInitialViewMode()
  );
  const [activeRoute, setActiveRoute] = useState<FutureRouteId | null>(null);

  useEffect(() => {
    const onPopState = () => {
      setViewMode(resolveInitialViewMode());
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('hashchange', onPopState);
    };
  }, []);

  const enterMainApp = useCallback(() => {
    setActiveRoute(null);
    setViewMode('app');
    try {
      if (!window.location.pathname.startsWith('/app')) {
        window.history.pushState({}, '', '/app');
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch {
      window.location.hash = '#/app';
    }
  }, []);

  const enterDashboardPreview = useCallback(() => {
    setActiveRoute(null);
    setViewMode('dashboard');
    try {
      if (!window.location.pathname.startsWith('/dashboard')) {
        window.history.pushState({}, '', '/dashboard');
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch {
      window.location.hash = '#/dashboard';
    }
  }, []);

  const handleOpenRoute = useCallback(
    (route: FutureRouteId) => {
      if (route === 'get-started') {
        enterMainApp();
        return;
      }
      setActiveRoute(route);
    },
    [enterMainApp]
  );

  const exitToLanding = useCallback(() => {
    setViewMode('landing');
    try {
      if (window.location.pathname !== '/' || window.location.search) {
        window.history.pushState({}, '', '/');
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch {
      window.location.hash = '';
    }
  }, []);

  if (viewMode === 'app') {
    return (
      <MotionConfig reducedMotion="user">
        <AppShell onExitToLanding={exitToLanding} />
      </MotionConfig>
    );
  }

  if (viewMode === 'dashboard') {
    return (
      <MotionConfig reducedMotion="user">
        <AdminShell onExitToLanding={exitToLanding} />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#050605] text-[#F5F7F2] flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2.5 focus:rounded-full focus:bg-[#C5FF62] focus:text-[#050605] focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>

        <Navbar onOpenRoute={handleOpenRoute} />

        <main id="main-content" className="flex-1">
          <HeroAndConnectedStage onOpenRoute={handleOpenRoute} />
          <ApproachSection />
          <CapabilitiesSection onOpenRoute={handleOpenRoute} />
          <HowItWorksSection />
          <VisionSection />
          <FinalCtaSection onOpenRoute={handleOpenRoute} />
        </main>

        <Footer onOpenRoute={handleOpenRoute} />

        <RoutePreviewModal
          activeRoute={activeRoute}
          onClose={() => setActiveRoute(null)}
          onEnterMainApp={enterMainApp}
          onEnterDashboard={enterDashboardPreview}
        />
      </div>
    </MotionConfig>
  );
}
