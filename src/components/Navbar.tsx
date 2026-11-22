import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { Button } from './Button';
import { FutureRouteId } from '../types/navigation';

interface NavbarProps {
  onOpenRoute: (route: FutureRouteId) => void;
}

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Vision', href: '#vision' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenRoute }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAnchorClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
        scrolled || mobileMenuOpen
          ? 'bg-[#050605]/95 border-b border-[#30372F]/75'
          : 'bg-[#050605]/60 border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="flex h-[68px] items-center justify-between gap-8">
          <a
            href="#top"
            onClick={(e) => handleAnchorClick(e, '#top')}
            aria-label="TRCK MAIN Home"
            className="inline-flex items-center rounded-lg py-1 focus-visible:outline-[#C5FF62] shrink-0"
          >
            <BrandMark />
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-7"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-sm font-medium text-[#A1A69E] hover:text-[#F5F7F2] transition-colors duration-150 whitespace-nowrap shrink-0 py-1.5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenRoute('sign-in')}
              className="min-h-[44px] px-4 py-2 text-sm font-medium text-[#F5F7F2]/85 hover:text-[#C5FF62] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer rounded-full"
            >
              Sign In
            </button>
            <Button
              variant="primary"
              size="md"
              onClick={() => onOpenRoute('get-started')}
            >
              Get Started
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#111411] border border-[#30372F] text-[#F5F7F2] hover:border-[rgba(0,255,120,0.45)] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="lg:hidden border-t border-[#30372F]/70 bg-[#050605] px-5 sm:px-8 pt-4 pb-7"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="min-h-[44px] flex items-center text-base font-medium text-[#F5F7F2]/90 hover:text-[#C5FF62] transition-colors py-2 border-b border-[#111411]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              size="md"
              className="w-full sm:w-auto"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRoute('sign-in');
              }}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRoute('get-started');
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
