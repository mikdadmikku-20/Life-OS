import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';

const STEPS = [
  {
    step: '01',
    title: 'Capture',
    description:
      'Bring your ideas, tasks, resources, and opportunities into one organized place.',
  },
  {
    step: '02',
    title: 'Connect',
    description:
      'Link priorities to goals, schedules, projects, and learning plans.',
  },
  {
    step: '03',
    title: 'Progress',
    description:
      'Take action, review results, and adjust your approach as life changes.',
  },
];

export const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [lineRevealed, setLineRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setLineRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setLineRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="py-20 sm:py-28 border-t border-[#30372F]/45 bg-[#0A0D0A]"
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionHeading
            kicker="How It Works"
            titleId="how-it-works-heading"
            title="From Intention to Action."
            description="A clear three-step rhythm built to keep what matters connected as priorities evolve."
          />
        </motion.div>

        <div className="mt-14 relative">
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-5 left-5 right-5 h-px bg-[#30372F]/70 overflow-hidden"
          >
            <div
              className={`h-full bg-gradient-to-r from-[#00A85A] via-[#00FF78] to-[#C5FF62] origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                lineRevealed ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-7 [perspective:1200px]">
            {STEPS.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 32, rotateX: 14, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.58,
                  delay: idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative flex flex-col items-start"
              >
                <div className="relative z-10 inline-flex items-center gap-3 bg-[#0A0D0A] pr-4 mb-5">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#111411] border border-[rgba(0,255,120,0.42)] font-mono text-sm font-medium tabular-nums text-[#C5FF62]">
                    {item.step}
                  </span>
                  <span className="text-xs font-medium tracking-[0.12em] uppercase text-[#A1A69E]">
                    Step {item.step}
                  </span>
                </div>

                <div className="w-full rounded-[22px] bg-[#111411] border border-[#30372F]/80 p-6 sm:p-7 hover:border-[rgba(0,255,120,0.38)] transition-colors duration-150">
                  <h3 className="text-xl font-semibold tracking-[-0.015em] text-[#F5F7F2]">
                    {item.step} — {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.65] text-[#A1A69E]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
