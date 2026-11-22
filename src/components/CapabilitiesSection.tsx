import React from 'react';
import {
  Target,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Activity,
  Library,
  Sparkles,
  BrainCircuit,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { Button } from './Button';
import { FutureRouteId } from '../types/navigation';

interface CapabilitiesSectionProps {
  onOpenRoute: (route: FutureRouteId) => void;
}

const CAPABILITIES = [
  {
    title: 'Goals & Daily Planning',
    description:
      'Planned workspace to align long-term milestones with daily priorities and focused schedules.',
    icon: Target,
  },
  {
    title: 'Career & Opportunities',
    description:
      'Designed to organize role pursuits, applications, milestones, and long-term direction.',
    icon: Briefcase,
  },
  {
    title: 'Study & Skill Development',
    description:
      'Structured space planned for deliberate practice, courses, and capability growth.',
    icon: GraduationCap,
  },
  {
    title: 'Projects & Ideas',
    description:
      'Dedicated hub planned to capture concepts early and guide projects to completion.',
    icon: Lightbulb,
  },
  {
    title: 'Health & Fitness Planning',
    description:
      'Planned routines and wellbeing tracking to support steady energy alongside ambitious work.',
    icon: Activity,
  },
  {
    title: 'Reading & Knowledge',
    description:
      'Curated environment planned for books, notes, and lasting personal synthesis.',
    icon: Library,
  },
  {
    title: 'Personal Development',
    description:
      'Intentional tools planned for habits, principles, and regular reflection.',
    icon: Sparkles,
  },
  {
    title: 'Research & AI Assistance',
    description:
      'Upcoming intelligent workflows designed to assist structured inquiry across life areas.',
    icon: BrainCircuit,
  },
];

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({
  onOpenRoute,
}) => {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="py-20 sm:py-28 border-t border-[#30372F]/45 bg-[#050605]"
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <SectionHeading
            kicker="Explore the Platform"
            titleId="capabilities-heading"
            title="Everything Important Has a Place."
            description="TRCK MAIN is being designed to bring eight interconnected areas of life into one calm, coherent operating environment."
          />

          <Button
            variant="secondary"
            size="md"
            onClick={() => onOpenRoute('platform')}
            className="self-start md:self-auto"
          >
            <span>Explore the Platform</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 [perspective:1200px]">
          {CAPABILITIES.map((capability, idx) => {
            const Icon = capability.icon;
            return (
              <motion.div
                key={capability.title}
                tabIndex={0}
                initial={{ opacity: 0, y: 30, rotateX: 15, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  duration: 0.55,
                  delay: (idx % 4) * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -4, rotateX: 2 }}
                className="group rounded-[20px] bg-[#111411] border border-[#30372F]/80 hover:border-[rgba(0,255,120,0.42)] focus-visible:border-[#C5FF62] hover:bg-[#191D19] p-5 sm:p-6 flex flex-col transition-colors duration-150"
              >
                <div className="w-10 h-10 rounded-xl bg-[#191D19] border border-[#30372F] group-hover:border-[rgba(0,255,120,0.38)] flex items-center justify-center text-[#F5F7F2]/85 group-hover:text-[#C5FF62] transition-colors duration-150 mb-5">
                  <Icon size={18} strokeWidth={1.85} aria-hidden="true" />
                </div>

                <h3 className="text-base font-semibold tracking-[-0.01em] text-[#F5F7F2]">
                  {capability.title}
                </h3>
                <p className="mt-2 text-sm leading-[1.6] text-[#A1A69E] flex-1">
                  {capability.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
