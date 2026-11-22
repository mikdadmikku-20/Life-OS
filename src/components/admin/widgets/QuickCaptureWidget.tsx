import React, { useState } from 'react';
import { Inbox, Plus } from 'lucide-react';
import {
  AdminModuleId,
  CapturedEntry,
  CaptureItemType,
} from '../../../types/workspace';

interface QuickCaptureWidgetProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
  capturedItems: CapturedEntry[];
  onCapture: (payload: {
    text: string;
    type: CaptureItemType;
    destinationModuleId: AdminModuleId | 'universal-capture-inbox';
  }) => void;
}

const CAPTURE_TYPES: { value: CaptureItemType; label: string }[] = [
  { value: 'task', label: 'Task' },
  { value: 'idea', label: 'Idea' },
  { value: 'note', label: 'Note' },
  { value: 'opportunity', label: 'Opportunity' },
  { value: 'reminder', label: 'Reminder' },
];

const DESTINATIONS: {
  value: AdminModuleId | 'universal-capture-inbox';
  label: string;
}[] = [
  { value: 'universal-capture-inbox', label: 'Universal Capture Inbox (Default)' },
  { value: 'dashboard-daily-reflection', label: "Today's Priorities (Add to list if Task)" },
  { value: 'ideas-business-planner', label: 'Ideas & Business Planner' },
  { value: 'programs-opportunities-explorer', label: 'Programs & Opportunities Explorer' },
  { value: 'study-planner', label: 'Study Planner' },
  { value: 'project-planner', label: 'Project Planner' },
  { value: 'reading-tracker', label: 'Reading Tracker' },
];

export const QuickCaptureWidget: React.FC<QuickCaptureWidgetProps> = ({
  inputRef,
  capturedItems,
  onCapture,
}) => {
  const [text, setText] = useState('');
  const [type, setType] = useState<CaptureItemType>('task');
  const [destination, setDestination] = useState<
    AdminModuleId | 'universal-capture-inbox'
  >('universal-capture-inbox');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onCapture({
      text,
      type,
      destinationModuleId: destination,
    });
    setText('');
  };

  return (
    <section
      id="quick-capture-widget"
      aria-labelledby="widget-quick-capture-title"
      className="rounded-[24px] bg-[#17181D] border border-[#2A2D28] p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#272A26]">
          <div>
            <h2
              id="widget-quick-capture-title"
              className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#F5F6F2]"
            >
              Quick Capture
            </h2>
            <p className="mt-0.5 text-xs text-[#A0A39A]">
              Temporary session intake · Future Universal Capture Inbox slot
            </p>
          </div>
          <Inbox size={17} className="text-[#C5FF62] shrink-0" aria-hidden="true" />
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label htmlFor="quick-capture-input" className="sr-only">
              Capture an idea, task, note, opportunity, or reminder
            </label>
            <input
              ref={inputRef}
              id="quick-capture-input"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Capture an idea, task, note, opportunity, or reminder..."
              className="w-full h-11 px-4 rounded-xl bg-[#101110] border border-[#2D312C] focus:border-[#C5FF62] focus:outline-none text-sm text-[#F5F6F2] placeholder:text-[#A0A39A]/75 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
            <div className="sm:col-span-4">
              <label
                htmlFor="quick-capture-type"
                className="block text-[11px] font-medium text-[#A0A39A] mb-1"
              >
                Type
              </label>
              <select
                id="quick-capture-type"
                value={type}
                onChange={(e) => setType(e.target.value as CaptureItemType)}
                className="w-full h-10 px-3 rounded-xl bg-[#101110] border border-[#2D312C] focus:border-[#C5FF62] focus:outline-none text-xs text-[#F5F6F2]"
              >
                {CAPTURE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-5">
              <label
                htmlFor="quick-capture-destination"
                className="block text-[11px] font-medium text-[#A0A39A] mb-1"
              >
                Destination (optional)
              </label>
              <select
                id="quick-capture-destination"
                value={destination}
                onChange={(e) =>
                  setDestination(
                    e.target.value as AdminModuleId | 'universal-capture-inbox'
                  )
                }
                className="w-full h-10 px-3 rounded-xl bg-[#101110] border border-[#2D312C] focus:border-[#C5FF62] focus:outline-none text-xs text-[#F5F6F2]"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={!text.trim()}
                className="w-full inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-full bg-[#C5FF62] text-[#090A09] text-xs font-semibold hover:bg-[#D5FF8D] disabled:opacity-45 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <Plus size={14} aria-hidden="true" />
                <span>Capture</span>
              </button>
            </div>
          </div>
        </form>

        {/* Session Capture Log */}
        <div className="mt-4 pt-3.5 border-t border-[#272A26]">
          <div className="flex items-center justify-between text-[11px] text-[#A0A39A]">
            <span>Local session intake (not persisted to database)</span>
            <span className="font-mono tabular-nums">
              {capturedItems.length} item{capturedItems.length === 1 ? '' : 's'}
            </span>
          </div>

          {capturedItems.length === 0 ? (
            <p className="mt-2.5 text-xs text-[#A0A39A]/85">
              Items captured here appear in this temporary preview queue. Set
              Type to Task and Destination to Today&apos;s Priorities to add
              directly to your priority list.
            </p>
          ) : (
            <ul className="mt-2.5 space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {capturedItems.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-xl bg-[#101110]/85 border border-[#272A26] px-3 py-2 text-xs"
                >
                  <p className="text-[#F5F6F2] font-medium">{entry.text}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-[#A0A39A]">
                    <span className="capitalize text-[#C5FF62]">{entry.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>{entry.destinationLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {entry.createdAtLabel}
                    </span>
                    {entry.promotedToTasks && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#00FF78]">Added to Today&apos;s Priorities</span>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};
