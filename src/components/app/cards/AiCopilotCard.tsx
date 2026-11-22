import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';
import { AppSidebarEntryId, CopilotStatusRow } from '../../../types/appHome';

interface AiCopilotCardProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
  activeGoalsPercent: number;
  rows: CopilotStatusRow[];
  adjustmentApplied: boolean;
  adjustmentDismissed: boolean;
  onApplyAdjustment: () => void;
  onDismissAdjustment: () => void;
  onNavigateEntry: (id: AppSidebarEntryId) => void;
  cardSurfaceClass: string;
}

const DOT_CLUSTER_PALETTES = [
  ['#FF9248', '#FF9248', '#FFB347', '#FF9248', '#FFB347', '#1B3A29', '#FFB347', '#1B3A29', '#1B3A29'],
  ['#FFC94A', '#FFC94A', '#C5FF62', '#FFC94A', '#C5FF62', '#3DF58B', '#1B3A29', '#3DF58B', '#1B3A29'],
  ['#3DF58B', '#6BFF9C', '#C5FF62', '#3DF58B', '#6BFF9C', '#C5FF62', '#1B3A29', '#3DF58B', '#6BFF9C'],
];

export const AiCopilotCard: React.FC<AiCopilotCardProps> = ({
  sectionRef,
  activeGoalsPercent,
  rows,
  adjustmentApplied,
  adjustmentDismissed,
  onApplyAdjustment,
  onDismissAdjustment,
  onNavigateEntry,
  cardSurfaceClass,
}) => {
  const renderRowStatus = (row: CopilotStatusRow) => {
    const isResolved = row.id === 'cp-3' && adjustmentApplied;
    const effectiveStatus = isResolved ? 'done' : row.status;
    const effectiveText = isResolved ? 'Rescheduled' : row.statusText;

    if (effectiveStatus === 'done') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6BFF9C] shrink-0">
          <CheckCircle2 size={12} aria-hidden="true" />
          <span>{effectiveText}</span>
        </span>
      );
    }
    if (effectiveStatus === 'in-progress') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#C5FF62] shrink-0">
          <Clock size={12} aria-hidden="true" />
          <span>{effectiveText}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#FFB86B] shrink-0">
        <AlertTriangle size={12} aria-hidden="true" />
        <span>{effectiveText}</span>
      </span>
    );
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="card-copilot-title"
      tabIndex={-1}
      className={`rounded-[26px] border p-5 sm:p-6 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6BFF9C] ${cardSurfaceClass}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-[#10291D] border border-[#24573C] flex items-center justify-center text-[#6BFF9C] shrink-0">
              <Bot size={18} aria-hidden="true" />
            </span>
            <div>
              <h2
                id="card-copilot-title"
                className="text-base font-semibold text-[#F5F7F2]"
              >
                AI Co-pilot
              </h2>
              <p className="text-[11px] text-[#8CA195]">
                Daily briefing · Sample rule-based review
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateEntry('ai-assistant')}
            className="text-xs font-medium text-[#6BFF9C] hover:underline cursor-pointer shrink-0 pt-1"
          >
            Open full AI
          </button>
        </div>

        <p className="mt-3 text-xs leading-[1.6] text-[#A1B0A6]">
          Priorities stay strong if afternoon study prep remains insulated from
          overlapping mentor outreach.
        </p>

        {/* Active Goals + 3x3 Dot Matrix Clusters (Inspired by Image 1 AI Co-pilot card) */}
        <div className="mt-4 rounded-2xl bg-[#07110C]/90 border border-[#1B3A29] p-3.5">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-xs text-[#8CA195] block">
                Active goals alignment
              </span>
              <div className="mt-0.5 flex items-baseline gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-bold tabular-nums text-[#F5F7F2]">
                  {activeGoalsPercent}%
                </span>
                <span className="text-[11px] text-[#6BFF9C]">
                  this week · sample
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5" aria-hidden="true">
              {DOT_CLUSTER_PALETTES.map((palette, cIdx) => (
                <div key={cIdx} className="grid grid-cols-3 gap-1">
                  {palette.map((color, dIdx) => (
                    <span
                      key={dIdx}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Rows */}
        <div className="mt-3.5 space-y-2">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between gap-2 rounded-xl bg-[#08130E] border border-[#1A3526] px-3 py-2.5"
            >
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A8D81] block">
                  {row.slotLabel}
                </span>
                <p className="text-xs font-medium text-[#F5F7F2] truncate">
                  {row.title}
                </p>
              </div>
              {renderRowStatus(row)}
            </div>
          ))}
        </div>

        {/* Explicit User-Confirmed Schedule Suggestion */}
        {!adjustmentDismissed && !adjustmentApplied && (
          <div className="mt-3.5 rounded-2xl bg-[#0E2117] border border-[#2C6143] p-3.5 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <Sparkles
                  size={14}
                  className="text-[#C5FF62] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold text-[#F5F7F2]">
                    Suggested adjustment · Needs confirmation
                  </p>
                  <p className="mt-0.5 text-[#A1B0A6]">
                    Move <span className="text-[#F5F7F2]">Mentor Follow-up</span>{' '}
                    from 16:30 to <span className="text-[#C5FF62]">17:15 – 18:00</span>{' '}
                    to protect recovery buffer.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onDismissAdjustment}
                aria-label="Dismiss suggested schedule change"
                className="text-[#8CA195] hover:text-[#F5F7F2] p-1 cursor-pointer shrink-0"
              >
                <X size={13} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onApplyAdjustment}
                className="inline-flex items-center justify-center gap-1.5 min-h-[34px] px-3.5 py-1.5 rounded-full bg-[#6BFF9C] text-[#050C08] text-xs font-semibold hover:bg-[#8CFFB4] transition-colors cursor-pointer"
              >
                <span>Approve &amp; Apply</span>
              </button>
              <button
                type="button"
                onClick={onDismissAdjustment}
                className="inline-flex items-center justify-center min-h-[34px] px-3 py-1.5 rounded-full bg-[#0A1710] border border-[#214231] text-xs text-[#A1B0A6] hover:text-[#F5F7F2] cursor-pointer"
              >
                Keep 16:30
              </button>
            </div>
          </div>
        )}

        {adjustmentApplied && (
          <div className="mt-3.5 rounded-2xl bg-[#0B2216] border border-[#3DF58B]/45 px-3.5 py-2.5 flex items-center gap-2 text-xs text-[#6BFF9C]">
            <CheckCircle2 size={14} aria-hidden="true" className="shrink-0" />
            <span>
              Applied to Today’s Schedule (Session): Mentor Follow-up moved to
              17:15.
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
        <span className="text-[11px] text-[#7A8D81]">
          Live LLM backend connected in Phase 2
        </span>
        <button
          type="button"
          onClick={() => onNavigateEntry('ai-assistant')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#C5FF62] hover:underline cursor-pointer shrink-0"
        >
          <span>Open AI Assistant</span>
          <ArrowRight size={13} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
