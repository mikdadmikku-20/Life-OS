import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { SectionHeading } from './SectionHeading';
import { LifeWorldFallback } from './LifeWorldFallback';
import { FutureRouteId } from '../types/navigation';

const LifeWorldCanvas = lazy(() =>
  import('../three/LifeWorldCanvas').then((m) => ({
    default: m.LifeWorldCanvas,
  }))
);

interface HeroAndConnectedStageProps {
  onOpenRoute: (route: FutureRouteId) => void;
}

interface BenefitItem {
  id: string;
  index: string;
  title: string;
  description: string;
}

const BENEFITS: BenefitItem[] = [
  {
    id: 'bigger-picture',
    index: '01',
    title: 'See the bigger picture',
    description:
      'Understand how daily priorities relate to long-term ambitions.',
  },
  {
    id: 'plans-to-action',
    index: '02',
    title: 'Turn plans into action',
    description:
      'Connect goals to milestones, projects, and practical next steps.',
  },
  {
    id: 'improve-continuously',
    index: '03',
    title: 'Improve continuously',
    description:
      'Use reflection, knowledge, and progress tracking to refine your approach.',
  },
];

export const HeroAndConnectedStage: React.FC<HeroAndConnectedStageProps> = ({
  onOpenRoute,
}) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<number>(0);
  const [heroFade, setHeroFade] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalScrollable = Math.max(el.offsetHeight - window.innerHeight, 360);
      const progress = Math.min(1, Math.max(0, -rect.top / totalScrollable));
      scrollProgressRef.current = progress;

      const fadeProgress = Math.min(1, Math.max(0, (progress - 0.85) / 0.15));
      setHeroFade(fadeProgress);
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  const handleExploreClick = () => {
    const target = document.querySelector('#product');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={stageRef} className="relative bg-[#050605]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-120px] right-[-80px] w-[620px] h-[620px] rounded-full bg-[#00FF78]/[0.04] blur-[150px]"
      />

      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-start">
          {/* Left Scrolling Column */}
          <div className="lg:col-span-5 relative z-10 flex flex-col">
            <section
              id="top"
              aria-labelledby="hero-heading"
              className="pt-8 pb-8 sm:pt-14 sm:pb-12 lg:min-h-[calc(100vh-88px)] lg:flex lg:flex-col lg:justify-center lg:py-16"
            >
              <p className="text-xs font-semibold tracking-[0.15em] text-[#C5FF62] uppercase mb-5">
                YOUR PERSONAL LIFE MANAGEMENT SYSTEM
              </p>

              <h1
                id="hero-heading"
                className="text-[clamp(2.4rem,4.3vw,3.85rem)] font-semibold tracking-[-0.03em] leading-[1.07] text-[#F5F7F2] [text-wrap:balance]"
              >
                Your Life. Your Goals. One System.
              </h1>

              <p className="mt-5 text-base sm:text-[17px] leading-[1.65] text-[#A1A69E] max-w-[48ch]">
                Bring your priorities, projects, learning, opportunities, and
                personal development together in one connected workspace. Build
                clarity, take meaningful action, and keep moving toward the
                future you want.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
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
                  variant="secondary"
                  size="lg"
                  onClick={handleExploreClick}
                  className="w-full sm:w-auto"
                >
                  Explore TRCK MAIN
                </Button>
              </div>

              <p className="mt-5 text-xs sm:text-sm text-[#A1A69E]">
                One connected system. Built around your life.
              </p>
            </section>

            {/* Mobile 3D Scene */}
            <div className="lg:hidden pb-12">
              <Suspense fallback={<LifeWorldFallback reason="loading" />}>
                <LifeWorldCanvas scrollProgressRef={scrollProgressRef} />
              </Suspense>
            </div>

            {/* Section Two: Your Life Is Connected with 3D perspective card reveals */}
            <section
              id="product"
              aria-labelledby="connected-life-heading"
              className="py-12 sm:py-16 lg:py-28 border-t border-[#30372F]/45 lg:border-t-0"
            >
              <SectionHeading
                kicker="Your Life Is Connected"
                titleId="connected-life-heading"
                title="Your Life Doesn't Happen in Separate Categories."
                description="Your goals influence your schedule. Your skills shape your opportunities. Your projects turn ideas into results. TRCK MAIN is designed to connect these areas instead of treating them as isolated activities."
              />

              <div className="mt-9 space-y-4 [perspective:1100px]">
                {BENEFITS.map((benefit, idx) => (
                  <motion.div
                    key={benefit.id}
                    initial={{ opacity: 0, y: 28, rotateX: 14, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.55,
                      delay: idx * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="rounded-[20px] bg-[#111411] border border-[#30372F]/75 p-5 sm:p-6 transition-colors duration-150 hover:border-[#00FF78]/45"
                  >
                    <div className="flex items-start gap-4">
                      <span className="font-mono text-xs sm:text-sm font-medium tabular-nums text-[#C5FF62] pt-0.5 shrink-0">
                        {benefit.index}
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#F5F7F2]">
                          {benefit.title}
                        </h3>
                        <p className="mt-1.5 text-sm sm:text-[15px] leading-[1.6] text-[#A1A69E]">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Desktop Right/Center Sticky 3D World */}
          <div
            className="hidden lg:block lg:col-span-7 lg:sticky lg:top-[76px] lg:-ml-4 pt-4 pb-8 transition-opacity duration-300"
            style={{ opacity: 1 - heroFade * 0.5 }}
          >
            <Suspense fallback={<LifeWorldFallback reason="loading" />}>
              <LifeWorldCanvas scrollProgressRef={scrollProgressRef} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};
