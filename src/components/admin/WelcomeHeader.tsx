import React, { useState } from 'react';
import { Calendar, Check, Pencil, SlidersHorizontal } from 'lucide-react';

interface WelcomeHeaderProps {
  dailyIntention: string;
  onUpdateIntention: (value: string) => void;
  pendingTaskCount: number;
  totalTaskCount: number;
  upcomingCommitmentCount: number;
  onOpenCustomize: () => void;
}

function getLocalGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 22) return 'Good evening';
  return 'Welcome back';
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  dailyIntention,
  onUpdateIntention,
  pendingTaskCount,
  totalTaskCount,
  upcomingCommitmentCount,
  onOpenCustomize,
}) => {
  const [editingIntention, setEditingIntention] = useState(false);
  const [draftIntention, setDraftIntention] = useState(dailyIntention);

  const greeting = getLocalGreeting();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const saveIntention = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draftIntention.trim();
    if (trimmed) {
      onUpdateIntention(trimmed);
    }
    setEditingIntention(false);
  };

  return (
    <section
      aria-labelledby="workspace-greeting-heading"
      className="rounded-[24px] bg-[#17181D] border border-[#2A2D28] p-5 sm:p-7"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#A0A39A]">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#C5FF62]">
              <Calendar size={13} aria-hidden="true" />
              <span>{formattedDate}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Development preview · Sample workspace data</span>
          </div>

          <p className="mt-2.5 text-sm font-medium text-[#A0A39A]">
            {greeting}, Workspace Member
          </p>

          <h1
            id="workspace-greeting-heading"
            className="mt-1 text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#F5F6F2] [text-wrap:balance]"
          >
            Your day, in focus.
          </h1>

          <p className="mt-1.5 text-sm sm:text-[15px] text-[#A0A39A] max-w-[60ch]">
            See what matters, make progress, and adjust your plan with clarity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCustomize}
            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-full bg-[#222329] border border-[#34382F] text-xs sm:text-sm font-medium text-[#F5F6F2] hover:border-[#C5FF62]/55 hover:text-[#C5FF62] transition-colors cursor-pointer whitespace-nowrap"
          >
            <SlidersHorizontal size={15} aria-hidden="true" />
            <span>Customize Dashboard</span>
          </button>
        </div>
      </div>

      {/* Daily Intention + Priorities & Commitments Summary */}
      <div className="mt-5 pt-4 border-t border-[#272A26] grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A0A39A]">
            <span>Daily intention</span>
            <span className="font-normal normal-case tracking-normal text-[#A0A39A]/80">
              (Local session)
            </span>
          </div>

          {editingIntention ? (
            <form onSubmit={saveIntention} className="mt-1.5 flex items-center gap-2">
              <input
                type="text"
                value={draftIntention}
                onChange={(e) => setDraftIntention(e.target.value)}
                aria-label="Edit daily intention"
                autoFocus
                className="flex-1 min-w-0 h-9 px-3 rounded-lg bg-[#101110] border border-[#C5FF62]/60 text-sm text-[#F5F6F2] focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Save daily intention"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#C5FF62] text-[#090A09] hover:bg-[#D5FF8D] cursor-pointer shrink-0"
              >
                <Check size={15} />
              </button>
            </form>
          ) : (
            <div className="mt-1 flex items-center gap-2">
              <p className="text-sm text-[#F5F6F2] leading-snug">
                {dailyIntention}
              </p>
              <button
                type="button"
                onClick={() => {
                  setDraftIntention(dailyIntention);
                  setEditingIntention(true);
                }}
                aria-label="Edit daily intention"
                className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[#A0A39A] hover:text-[#C5FF62] hover:bg-[#222329] transition-colors cursor-pointer shrink-0"
              >
                <Pencil size={13} />
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 flex flex-wrap lg:justify-end items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-[#A0A39A]">
          <div>
            <span className="font-mono font-semibold tabular-nums text-[#F5F6F2]">
              {pendingTaskCount}/{totalTaskCount}
            </span>{' '}
            <span>priorities open</span>
          </div>
          <span aria-hidden="true" className="text-[#34382F]">
            ·
          </span>
          <div>
            <span className="font-mono font-semibold tabular-nums text-[#C5FF62]">
              {upcomingCommitmentCount}
            </span>{' '}
            <span>upcoming commitments ahead</span>
          </div>
        </div>
      </div>
    </section>
  );
};
