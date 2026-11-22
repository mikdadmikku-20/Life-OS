import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  HelpCircle,
  RefreshCw,
  Sliders,
  Sparkles,
  X,
} from 'lucide-react';
import { AiDailyBriefing } from '../../../types/workspace';

interface AiBriefingWidgetProps {
  briefing: AiDailyBriefing;
  onRefresh: () => void;
  onApproveAdjustment: () => void;
  onDismissAdjustment: () => void;
}

export const AiBriefingWidget: React.FC<AiBriefingWidgetProps> = ({
  briefing,
  onRefresh,
  onApproveAdjustment,
  onDismissAdjustment,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [reviewingChanges, setReviewingChanges] = useState(false);

  const adjustment = briefing.suggestedAdjustment;

  return (
    <section
      aria-labelledby="widget-ai-briefing-title"
      className="rounded-[24px] bg-[#17181D] border border-[rgba(197,255,98,0.28)] p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#272A26]">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={17} className="text-[#C5FF62]" aria-hidden="true" />
              <h2
                id="widget-ai-briefing-title"
                className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#F5F6F2]"
              >
                AI Daily Briefing
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#A0A39A]">
              Demonstration briefing (no live AI connected) · Updated{' '}
              <span className="font-mono tabular-nums text-[#F5F6F2]">
                {briefing.generatedAtLabel}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-full bg-[#222329] border border-[#34382F] text-xs font-medium text-[#F5F6F2] hover:border-[#C5FF62]/55 hover:text-[#C5FF62] transition-colors cursor-pointer"
            >
              <RefreshCw size={13} aria-hidden="true" />
              <span>Refresh Briefing</span>
            </button>
            <button
              type="button"
              onClick={() => setShowExplanation((prev) => !prev)}
              aria-expanded={showExplanation}
              className={`inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
                showExplanation
                  ? 'bg-[#C5FF62]/15 border-[#C5FF62]/50 text-[#C5FF62]'
                  : 'bg-[#222329] border-[#34382F] text-[#F5F6F2] hover:border-[#C5FF62]/45'
              }`}
            >
              <HelpCircle size={13} aria-hidden="true" />
              <span>Explain Recommendation</span>
            </button>
          </div>
        </div>

        {/* Four Structured Briefing Areas */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* 1. What matters today */}
          <div className="rounded-2xl bg-[#101110]/85 border border-[#272A26] p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#C5FF62]">
              What matters today
            </h3>
            <p className="mt-2 text-sm leading-[1.55] text-[#F5F6F2]">
              {briefing.whatMatters.summary}
            </p>
            {showExplanation && (
              <p className="mt-2 pt-2 border-t border-[#272A26] text-xs text-[#A0A39A]">
                Basis: {briefing.whatMatters.basis}
              </p>
            )}
          </div>

          {/* 2. Potential conflicts */}
          <div className="rounded-2xl bg-[#101110]/85 border border-[#272A26] p-4">
            <div className="flex items-center gap-1.5">
              {briefing.potentialConflicts.hasConflict && (
                <AlertTriangle
                  size={13}
                  className="text-amber-400 shrink-0"
                  aria-hidden="true"
                />
              )}
              <h3
                className={`text-xs font-semibold uppercase tracking-[0.08em] ${
                  briefing.potentialConflicts.hasConflict
                    ? 'text-amber-400'
                    : 'text-[#00FF78]'
                }`}
              >
                Potential conflicts
              </h3>
            </div>
            <p className="mt-2 text-sm leading-[1.55] text-[#F5F6F2]">
              {briefing.potentialConflicts.summary}
            </p>
            {showExplanation && (
              <p className="mt-2 pt-2 border-t border-[#272A26] text-xs text-[#A0A39A]">
                Basis: {briefing.potentialConflicts.basis}
              </p>
            )}
          </div>

          {/* 3. Recommended next action */}
          <div className="rounded-2xl bg-[#101110]/85 border border-[#272A26] p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#00FF78]">
              Recommended next action
            </h3>
            <p className="mt-2 text-sm leading-[1.55] text-[#F5F6F2]">
              {briefing.recommendedNextAction.summary}
            </p>
            {showExplanation && (
              <p className="mt-2 pt-2 border-t border-[#272A26] text-xs text-[#A0A39A]">
                Basis: {briefing.recommendedNextAction.basis}
              </p>
            )}
          </div>

          {/* 4. Suggested adjustment */}
          <div className="rounded-2xl bg-[#101110]/85 border border-[#272A26] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#A0A39A]">
                  Suggested adjustment
                </h3>
                {adjustment?.applied && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#C5FF62]">
                    <Check size={12} aria-hidden="true" />
                    <span>Approved &amp; applied</span>
                  </span>
                )}
              </div>

              {adjustment ? (
                <p className="mt-2 text-sm leading-[1.55] text-[#F5F6F2]">
                  {adjustment.summary}
                </p>
              ) : (
                <p className="mt-2 text-sm leading-[1.55] text-[#A0A39A]">
                  No schedule adjustment needed right now. Your current timeline has
                  clear boundaries.
                </p>
              )}

              {showExplanation && adjustment && (
                <p className="mt-2 pt-2 border-t border-[#272A26] text-xs text-[#A0A39A]">
                  Basis: {adjustment.rationale}
                </p>
              )}
            </div>

            {adjustment && !adjustment.applied && (
              <div className="mt-3 pt-2.5 border-t border-[#272A26]">
                <button
                  type="button"
                  onClick={() => setReviewingChanges((prev) => !prev)}
                  aria-expanded={reviewingChanges}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5FF62] hover:underline cursor-pointer"
                >
                  <Sliders size={13} aria-hidden="true" />
                  <span>
                    {reviewingChanges
                      ? 'Hide Change Review'
                      : 'Review Suggested Changes'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Explicit User Approval Panel for AI-Proposed Schedule Changes */}
        {adjustment && !adjustment.applied && reviewingChanges && (
          <div
            role="region"
            aria-label="Review suggested schedule change"
            className="mt-4 rounded-2xl bg-[#222329] border border-[#C5FF62]/45 p-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#C5FF62]">
                  User confirmation required before modifying schedule
                </p>
                <p className="mt-1 text-xs text-[#A0A39A]">
                  {adjustment.rationale}
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="rounded-xl bg-[#101110] border border-[#2D312C] p-3">
                <span className="block text-[11px] font-medium text-[#A0A39A]">
                  Current block
                </span>
                <span className="mt-1 block font-mono text-[#F5F6F2]">
                  {adjustment.beforeState}
                </span>
              </div>
              <div className="rounded-xl bg-[#101110] border border-[#C5FF62]/35 p-3">
                <span className="block text-[11px] font-medium text-[#C5FF62]">
                  Proposed update
                </span>
                <span className="mt-1 block font-mono text-[#F5F6F2]">
                  {adjustment.afterState}
                </span>
              </div>
            </div>

            <div className="mt-3.5 flex flex-wrap items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onDismissAdjustment();
                  setReviewingChanges(false);
                }}
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-full bg-[#17181D] border border-[#34382F] text-xs font-medium text-[#A0A39A] hover:text-[#F5F6F2] cursor-pointer"
              >
                <X size={13} aria-hidden="true" />
                <span>Dismiss Suggestion</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onApproveAdjustment();
                  setReviewingChanges(false);
                }}
                className="inline-flex items-center gap-1.5 min-h-[38px] px-4 py-1.5 rounded-full bg-[#C5FF62] text-[#090A09] text-xs font-semibold hover:bg-[#D5FF8D] cursor-pointer"
              >
                <Check size={14} aria-hidden="true" />
                <span>Approve &amp; Apply Change</span>
                <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 pt-3 border-t border-[#272A26] text-[11px] text-[#A0A39A]">
        {briefing.basisNote} AI suggestions never alter tasks or commitments
        without your explicit approval.
      </p>
    </section>
  );
};
