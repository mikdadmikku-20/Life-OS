import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { FutureRouteId } from '../types/navigation';

interface FinalCtaSectionProps {
  onOpenRoute: (route: FutureRouteId) => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onOpenRoute,
}) => {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="py-20 sm:py-28 border-t border-[#30372F]/45 bg-[#0A0D0A]"
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 [perspective:1200px]">
        <motion.div
          initial={{ opacity: 0, y: 36, rotateX: 12, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[28px] bg-[#111411] border border-[#30372F]/85 px-6 py-14 sm:px-12 sm:py-20 text-center"
        >
          {/* Stage 5 visual continuity: simplified glowing elliptical ring motif */}
          <svg
            viewBox="0 0 800 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full opacity-55"
          >
            <ellipse
              cx="400"
              cy="170"
              rx="290"
              ry="96"
              stroke="rgba(0, 255, 120, 0.16)"
              strokeWidth="1.5"
            />
            <ellipse
              cx="400"
              cy="170"
              rx="290"
              ry="96"
              stroke="url(#ctaRingGrad)"
              strokeWidth="2.2"
              strokeDasharray="240 900"
            />
            <defs>
              <linearGradient
                id="ctaRingGrad"
                x1="110"
                y1="170"
                x2="690"
                y2="170"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#00A85A" stopOpacity="0" />
                <stop offset="0.5" stopColor="#C5FF62" stopOpacity="0.8" />
                <stop offset="1" stopColor="#00FF78" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 -top-24 -translate-x-1/2 w-[480px] h-[240px] rounded-full bg-[#00FF78]/[0.055] blur-[110px]"
          />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mx-auto max-w-2xl flex flex-col items-center"
          >
            <h2
              id="final-cta-heading"
              className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.025em] leading-[1.14] text-[#F5F7F2] [text-wrap:balance]"
            >
              Your Next Chapter Starts With a Clearer Plan.
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-[1.65] text-[#A1A69E] max-w-[46ch]">
              Bring your ambitions, priorities, and plans into one connected
              system.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onOpenRoute('get-started')}
                className="w-full sm:w-auto"
              >
                <span>Get Started</span>
                <ArrowRight size={17} aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => onOpenRoute('sign-in')}
                className="w-full sm:w-auto"
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
