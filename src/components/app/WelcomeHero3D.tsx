import React, { Suspense, lazy, useState } from 'react';
import { Calendar, Check, Pencil } from 'lucide-react';
import { LifeHubFallback } from './LifeHubFallback';

const LifeHubCenterpiece = lazy(() =>
  import('../../three/LifeHubCenterpiece').then((m) => ({
    default: m.LifeHubCenterpiece,
  }))
);

interface WelcomeHero3DProps {
  dailyIntention: string;
  onUpdateIntention: (value: string) => void;
  cardSurfaceClass: string;
}

function getGreeting(): string {
  const hr = new Date().getHours();
  if (hr >= 5 && hr < 12) return 'Good morning';
  if (hr >= 12 && hr < 17) return 'Good afternoon';
  if (hr >= 17 && hr < 22) return 'Good evening';
  return 'Welcome back';
}

export const WelcomeHero3D: React.FC<WelcomeHero3DProps> = ({
  dailyIntention,
  onUpdateIntention,
  cardSurfaceClass,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(dailyIntention);

  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = draft.trim();
    if (cleaned) onUpdateIntention(cleaned);
    setEditing(false);
  };

  return (
    <section
      aria-labelledby="app-welcome-heading"
      className={`rounded-[26px] border p-5 sm:p-7 ${cardSurfaceClass}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Greeting, Headline, Daily Intention */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#8CA195]">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#6BFF9C]">
                <Calendar size={13} aria-hidden="true" />
                <span>{dateLabel}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>Isolated development entry (auth pending)</span>
            </div>

            <p className="mt-2.5 text-sm font-medium text-[#A1B0A6]">
              {getGreeting()}, Workspace Member
            </p>

            <h1
              id="app-welcome-heading"
              className="mt-1 text-2xl sm:text-3xl lg:text-[2.15rem] font-semibold tracking-[-0.025em] leading-[1.12] text-[#F5F7F2] [text-wrap:balance]"
            >
              Your life, in focus.
            </h1>

            <p className="mt-1.5 text-sm sm:text-[15px] text-[#A1B0A6]">
              Plan smart. Do more. Grow continuously.
            </p>
          </div>

          {/* Daily Intention Card */}
          <div className="rounded-2xl bg-[#07110C]/85 border border-[#1E3B2B] p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6BFF9C]">
                Daily intention
              </span>
              <span className="text-[11px] text-[#7A8D81]">
                Session preview
              </span>
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  aria-label="Edit daily intention"
                  autoFocus
                  className="flex-1 min-w-0 h-9 px-3 rounded-xl bg-[#0B1711] border border-[#6BFF9C]/60 text-sm text-[#F5F7F2] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Save daily intention"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#6BFF9C] text-[#050C08] hover:bg-[#8CFFB4] cursor-pointer shrink-0"
                >
                  <Check size={15} />
                </button>
              </form>
            ) : (
              <div className="mt-1.5 flex items-start justify-between gap-2">
                <p className="text-sm text-[#F5F7F2] leading-relaxed">
                  {dailyIntention}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(dailyIntention);
                    setEditing(true);
                  }}
                  aria-label="Edit daily intention"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[#8CA195] hover:text-[#6BFF9C] hover:bg-white/[0.04] cursor-pointer shrink-0"
                >
                  <Pencil size={13} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: 3D Elliptical Life Hub Centerpiece (Image 2 Inspired) */}
        <div className="lg:col-span-6">
          <Suspense fallback={<LifeHubFallback />}>
            <LifeHubCenterpiece />
          </Suspense>
        </div>
      </div>
    </section>
  );
};
