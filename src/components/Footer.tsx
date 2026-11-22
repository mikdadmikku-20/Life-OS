import React from 'react';
import { BrandMark } from './BrandMark';
import { FutureRouteId } from '../types/navigation';

interface FooterProps {
  onOpenRoute: (route: FutureRouteId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRoute }) => {
  const currentYear = new Date().getFullYear();

  const handleScrollLink = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="border-t border-[#30372F]/45 bg-[#050605] pt-14 pb-12">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#30372F]/40">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <a
              href="#top"
              onClick={(e) => handleScrollLink(e, '#top')}
              aria-label="Back to top"
              className="inline-flex items-center rounded-lg py-1"
            >
              <BrandMark />
            </a>
            <p className="mt-4 text-sm leading-[1.65] text-[#A1A69E] max-w-[38ch]">
              Connect your ambitions, plans, projects, learning, and personal
              growth in one unified personal life-management system.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-[#A1A69E] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#product"
                  onClick={(e) => handleScrollLink(e, '#product')}
                  className="text-[#F5F7F2]/80 hover:text-[#C5FF62] transition-colors inline-block py-0.5"
                >
                  Product
                </a>
              </li>
              <li>
                <a
                  href="#capabilities"
                  onClick={(e) => handleScrollLink(e, '#capabilities')}
                  className="text-[#F5F7F2]/80 hover:text-[#C5FF62] transition-colors inline-block py-0.5"
                >
                  Capabilities
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleScrollLink(e, '#how-it-works')}
                  className="text-[#F5F7F2]/80 hover:text-[#C5FF62] transition-colors inline-block py-0.5"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#vision"
                  onClick={(e) => handleScrollLink(e, '#vision')}
                  className="text-[#F5F7F2]/80 hover:text-[#C5FF62] transition-colors inline-block py-0.5"
                >
                  Vision
                </a>
              </li>
            </ul>
          </div>

          {/* Account Entry Points */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-[#A1A69E] mb-4">
              Access
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenRoute('get-started')}
                  className="text-[#F5F7F2]/80 hover:text-[#C5FF62] transition-colors inline-block py-0.5 cursor-pointer text-left"
                >
                  Get Started
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenRoute('sign-in')}
                  className="text-[#F5F7F2]/80 hover:text-[#C5FF62] transition-colors inline-block py-0.5 cursor-pointer text-left"
                >
                  Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Placeholders */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-[#A1A69E] mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenRoute('privacy')}
                  className="text-[#F5F7F2]/80 hover:text-[#C5FF62] transition-colors inline-block py-0.5 cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenRoute('terms')}
                  className="text-[#F5F7F2]/80 hover:text-[#C5FF62] transition-colors inline-block py-0.5 cursor-pointer text-left"
                >
                  Terms
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#A1A69E]">
          <p>© {currentYear} TRCK MAIN. All rights reserved.</p>
          <p>Your Life. Your Goals. One System.</p>
        </div>
      </div>
    </footer>
  );
};
