import React, { useEffect, useRef } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { Button } from './Button';
import { FutureRouteId, RoutePreviewInfo } from '../types/navigation';

interface RoutePreviewModalProps {
  activeRoute: FutureRouteId | null;
  onClose: () => void;
  onEnterMainApp?: () => void;
  onEnterDashboard?: () => void;
}

const ROUTE_DETAILS: Record<FutureRouteId, RoutePreviewInfo> = {
  'get-started': {
    id: 'get-started',
    title: 'Get Started With TRCK MAIN',
    routePath: '/app',
    summary:
      'Workspace onboarding and account creation will wrap this entry point once authentication is wired.',
    statusNote:
      'Authentication is not active yet. Entering now opens the TRCK MAIN Main App Home workspace in isolated development entry mode.',
  },
  'sign-in': {
    id: 'sign-in',
    title: 'Sign In to TRCK MAIN',
    routePath: '/sign-in',
    summary:
      'Existing members will sign in here to access their connected personal workspace.',
    statusNote:
      'Authentication is not active yet. You can enter the TRCK MAIN App Home workspace right now without signing in.',
  },
  platform: {
    id: 'platform',
    title: 'TRCK MAIN Platform Overview',
    routePath: '/platform',
    summary:
      'A dedicated product walkthrough detailing each connected area of the workspace is planned for this route.',
    statusNote:
      'You can jump directly into the TRCK MAIN App Home interface to explore the post-landing workspace.',
  },
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy (Placeholder)',
    routePath: '/privacy',
    summary:
      'This placeholder marks the future location of the TRCK MAIN Privacy Policy.',
    statusNote:
      'Formal legal documentation will be published prior to account registration and workspace launch.',
  },
  terms: {
    id: 'terms',
    title: 'Terms of Service (Placeholder)',
    routePath: '/terms',
    summary:
      'This placeholder marks the future location of the TRCK MAIN Terms of Service.',
    statusNote:
      'Formal terms will be published prior to account registration and workspace launch.',
  },
};

export const RoutePreviewModal: React.FC<RoutePreviewModalProps> = ({
  activeRoute,
  onClose,
  onEnterMainApp,
  onEnterDashboard,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!activeRoute) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeRoute, onClose]);

  if (!activeRoute) return null;

  const info = ROUTE_DETAILS[activeRoute];
  const canOpenWorkspace =
    activeRoute === 'sign-in' ||
    activeRoute === 'get-started' ||
    activeRoute === 'platform';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050605]/85"
      role="dialog"
      aria-modal="true"
      aria-labelledby="route-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[24px] bg-[#111411] border border-[rgba(0,255,120,0.28)] p-6 sm:p-7 shadow-[0_32px_90px_rgba(0,0,0,0.88)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-[#C5FF62] tracking-wide">
              Planned destination · {info.routePath}
            </p>
            <h3
              id="route-modal-title"
              className="mt-2 text-xl font-semibold tracking-[-0.015em] text-[#F5F7F2]"
            >
              {info.title}
            </h3>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#191D19] border border-[#30372F] text-[#F5F7F2]/85 hover:text-[#F5F7F2] hover:border-[rgba(0,255,120,0.4)] transition-colors cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-4 text-sm sm:text-[15px] leading-[1.65] text-[#F5F7F2]/90">
          {info.summary}
        </p>

        <div className="mt-4 rounded-xl bg-[#0A0D0A] border border-[#30372F]/75 p-4">
          <p className="text-xs leading-[1.6] text-[#A1A69E]">
            {info.statusNote}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <Button variant="secondary" size="md" onClick={onClose}>
            <span>Return to Page</span>
          </Button>

          {canOpenWorkspace && onEnterMainApp && (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                onClose();
                onEnterMainApp();
              }}
            >
              <span>Enter TRCK MAIN App</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </Button>
          )}

          {canOpenWorkspace && !onEnterMainApp && onEnterDashboard && (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                onClose();
                onEnterDashboard();
              }}
            >
              <span>Open Admin Panel (Preview)</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
