import React from 'react';
import { Compass, Zap, BookOpen, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';

const APPROACH_PILLARS = [
  {
    number: '01',
    title: 'PLAN',
    description: 'Organize goals, schedules, priorities, and commitments.',
    icon: Compass,
  },
  {
    number: '02',
    title: 'EXECUTE',
    description:
      'Turn plans into focused work, practical actions, and completed projects.',
    icon: Zap,
  },
  {
    number: '03',
    title: 'LEARN',
    description:
      'Build knowledge, study effectively, and develop valuable skills.',
    icon: BookOpen,
  },
  {
    number: '04',
    title: 'GROW',
    description:
      'Review progress, pursue opportunities, and improve over time.',
    icon: TrendingUp,
  },
];

export const ApproachSection: React.FC = () => {
  return (
    <section
      aria-labelledby="approach-heading"
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
            kicker="Four Core Pillars"
            titleId="approach-heading"
            title="Plan With Purpose. Move With Clarity."
            description="A clear structure for connecting long-term direction with focused execution and steady growth."
          />
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 [perspective:1200px]">
          {APPROACH_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.article
                key={pillar.title}
                tabIndex={0}
                initial={{ opacity: 0, y: 34, rotateX: 16, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -4, rotateX: 2, rotateY: -2 }}
                className="group rounded-[22px] bg-[#111411] border border-[#30372F]/80 hover:border-[rgba(0,255,120,0.45)] focus-visible:border-[#C5FF62] hover:bg-[#191D19] p-6 sm:p-7 flex flex-col justify-between transition-colors duration-150"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-7">
                    <div className="w-11 h-11 rounded-2xl bg-[#191D19] border border-[#30372F] group-hover:border-[rgba(0,255,120,0.4)] flex items-center justify-center text-[#C5FF62] transition-transform duration-150 group-hover:scale-[1.04]">
                      <Icon size={20} strokeWidth={1.85} aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs font-medium tabular-nums text-[#A1A69E] group-hover:text-[#00FF78] transition-colors duration-150">
                      {pillar.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold tracking-[0.04em] text-[#F5F7F2]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-[1.6] text-[#A1A69E]">
                    {pillar.description}
                  </p>
                </div>

                <div
                  aria-hidden="true"
                  className="mt-7 h-px w-8 bg-[#30372F] group-hover:w-14 group-hover:bg-[#00FF78]/75 transition-all duration-200"
                />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
