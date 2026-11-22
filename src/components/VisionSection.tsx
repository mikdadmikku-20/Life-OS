import React, { Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';

const VisionNetworkCanvas = lazy(() =>
  import('../three/VisionNetworkCanvas').then((m) => ({
    default: m.VisionNetworkCanvas,
  }))
);

export const VisionSection: React.FC = () => {
  return (
    <section
      id="vision"
      aria-labelledby="vision-heading"
      className="py-20 sm:py-28 border-t border-[#30372F]/45 bg-[#050605]"
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 [perspective:1200px]">
        <motion.div
          initial={{ opacity: 0, y: 34, rotateX: 12, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[28px] bg-[#111411] border border-[rgba(0,255,120,0.18)] px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20"
        >
          {/* Subtle emerald ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full bg-[#00FF78]/[0.045] blur-[110px]"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <SectionHeading
                kicker="Product Vision"
                titleId="vision-heading"
                title="Build a Life That Moves Forward."
              />

              <p className="mt-6 text-base sm:text-[17px] leading-[1.7] text-[#A1A69E] max-w-[60ch]">
                TRCK MAIN is being designed as a connected personal
                life-management environment that helps you organize
                responsibilities, develop capabilities, manage meaningful
                projects, and translate long-term ambitions into practical daily
                action.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex items-center justify-center rounded-2xl bg-[#0A0D0A]/90 border border-[#30372F]/75 p-3"
            >
              <Suspense
                fallback={
                  <div className="w-full h-[260px] flex items-center justify-center text-xs text-[#A1A69E]">
                    Connected system network
                  </div>
                }
              >
                <VisionNetworkCanvas />
              </Suspense>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
