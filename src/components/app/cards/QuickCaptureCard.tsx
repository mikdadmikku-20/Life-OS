import React, { useState } from 'react';
import { CheckCircle2, Plus, Sparkles } from 'lucide-react';
import { QuickCapturedRecord, QuickRecordType } from '../../../types/appHome';

interface QuickCaptureCardProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
  capturedRecords: QuickCapturedRecord[];
  onSubmitCapture: (payload: { type: QuickRecordType; content: string }) => void;
  cardSurfaceClass: string;
}

const CAPTURE_TYPES: { id: QuickRecordType; label: string }[] = [
  { id: 'thought', label: 'Thought' },
  { id: 'task', label: 'Task' },
  { id: 'idea', label: 'Idea' },
  { id: 'goal', label: 'Goal' },
  { id: 'note', label: 'Note' },
  { id: 'reminder', label: 'Reminder' },
  { id: 'opportunity', label: 'Opportunity' },
];

export const QuickCaptureCard: React.FC<QuickCaptureCardProps> = ({
  inputRef,
  capturedRecords,
  onSubmitCapture,
  cardSurfaceClass,
}) => {
  const [selectedType, setSelectedType] = useState<QuickRecordType>('thought');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmitCapture({ type: selectedType, content });
    setContent('');
  };

  return (
    <section
      aria-labelledby="card-quick-capture-title"
      className={`rounded-[26px] border p-5 sm:p-6 flex flex-col justify-between ${cardSurfaceClass}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="card-quick-capture-title"
              className="text-base sm:text-lg font-semibold text-[#F5F7F2]"
            >
              Quick Capture
            </h2>
            <p className="text-xs text-[#8CA195]">
              Fast intake into Universal Capture Inbox (session-only state)
            </p>
          </div>
          <Sparkles size={16} className="text-[#C5FF62] shrink-0 mt-1" aria-hidden="true" />
        </div>

        {/* Type Selector */}
        <div
          role="radiogroup"
          aria-label="Capture record type"
          className="mt-4 flex flex-wrap gap-1.5"
        >
          {CAPTURE_TYPES.map((typeItem) => {
            const active = selectedType === typeItem.id;
            return (
              <button
                key={typeItem.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelectedType(typeItem.id)}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#6BFF9C] border-[#6BFF9C] text-[#050C08] font-semibold'
                    : 'bg-[#08130E] border-[#1E3B2B] text-[#A1B0A6] hover:text-[#F5F7F2]'
                }`}
              >
                {typeItem.label}
              </button>
            );
          })}
        </div>

        {/* Capture Input Form */}
        <form onSubmit={handleSubmit} className="mt-3.5 flex flex-col sm:flex-row gap-2">
          <label htmlFor="quick-capture-input" className="sr-only">
            Capture text
          </label>
          <input
            ref={inputRef}
            id="quick-capture-input"
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Capture a ${selectedType}...`}
            className="flex-1 min-h-[42px] px-4 rounded-full bg-[#07110C] border border-[#204230] focus:border-[#6BFF9C] focus:outline-none text-sm text-[#F5F7F2] placeholder:text-[#7A8D81]"
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-5 rounded-full bg-[#C5FF62] text-[#050C08] text-xs font-semibold hover:bg-[#d7ff91] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
          >
            <Plus size={14} aria-hidden="true" />
            <span>Capture</span>
          </button>
        </form>

        {/* Session Captured Queue */}
        <div className="mt-4 space-y-2">
          {capturedRecords.length === 0 ? (
            <div className="rounded-2xl bg-[#07120C]/70 border border-dashed border-[#1E3B2B] px-4 py-4 text-xs text-[#8CA195]">
              No session items captured yet. Submitting a{' '}
              <span className="text-[#F5F7F2]">Task</span> automatically updates
              your Main Task priorities and Recent Activity timeline.
            </div>
          ) : (
            <ul className="space-y-2 max-h-[168px] overflow-y-auto pr-1">
              {capturedRecords.slice(0, 4).map((record) => (
                <li
                  key={record.id}
                  className="rounded-xl bg-[#07120C] border border-[#1B3A29] px-3.5 py-2.5 flex items-start justify-between gap-2"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <CheckCircle2
                      size={14}
                      className="text-[#6BFF9C] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#F5F7F2] truncate">
                        {record.content}
                      </p>
                      <p className="text-[11px] text-[#8CA195]">
                        {record.type.toUpperCase()} · {record.destinationHint}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-[#7A8D81] shrink-0">
                    {record.createdAtLabel}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-[#7A8D81]">
        Session prototype only · Refreshing clears temporary captures
      </p>
    </section>
  );
};
