import React, { useEffect, useRef } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  RotateCcw,
  X,
} from 'lucide-react';
import { WIDGET_METADATA } from '../../data/workspaceDemoData';
import {
  DashboardLayoutPreferences,
  DashboardWidgetId,
} from '../../types/workspace';

interface CustomizeDashboardModalProps {
  open: boolean;
  onClose: () => void;
  preferences: DashboardLayoutPreferences;
  onToggleVisibility: (id: DashboardWidgetId) => void;
  onMoveWidget: (id: DashboardWidgetId, direction: 'up' | 'down') => void;
  onRestoreDefaults: () => void;
}

export const CustomizeDashboardModal: React.FC<CustomizeDashboardModalProps> = ({
  open,
  onClose,
  preferences,
  onToggleVisibility,
  onMoveWidget,
  onRestoreDefaults,
}) => {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050605]/85"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-dashboard-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-[24px] bg-[#17181D] border border-[#34382F] shadow-[0_32px_90px_rgba(0,0,0,0.88)] p-5 sm:p-6 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#272A26]">
          <div>
            <h2
              id="customize-dashboard-title"
              className="text-lg font-semibold text-[#F5F6F2]"
            >
              Customize Dashboard
            </h2>
            <p className="mt-1 text-xs text-[#A0A39A]">
              Show or hide widgets and adjust display priority. Preferences save
              locally in this browser.
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close customization dialog"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#222329] border border-[#34382F] text-[#F5F6F2] hover:border-[#C5FF62]/50 cursor-pointer shrink-0"
          >
            <X size={17} />
          </button>
        </div>

        <ul className="mt-4 space-y-2 overflow-y-auto pr-1 flex-1">
          {preferences.widgetOrder.map((widgetId, index) => {
            const meta = WIDGET_METADATA[widgetId];
            const isHidden = preferences.hiddenWidgets.includes(widgetId);
            return (
              <li
                key={widgetId}
                className="rounded-xl bg-[#101110] border border-[#272A26] px-3.5 py-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      isHidden ? 'text-[#A0A39A] line-through' : 'text-[#F5F6F2]'
                    }`}
                  >
                    {meta.title}
                  </p>
                  <p className="text-[11px] text-[#A0A39A] truncate">
                    {meta.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => onMoveWidget(widgetId, 'up')}
                    aria-label={`Move ${meta.title} up`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#17181D] border border-[#2D312C] text-[#A0A39A] hover:text-[#F5F6F2] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={index === preferences.widgetOrder.length - 1}
                    onClick={() => onMoveWidget(widgetId, 'down')}
                    aria-label={`Move ${meta.title} down`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#17181D] border border-[#2D312C] text-[#A0A39A] hover:text-[#F5F6F2] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleVisibility(widgetId)}
                    aria-label={`${isHidden ? 'Show' : 'Hide'} ${meta.title}`}
                    className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                      isHidden
                        ? 'bg-[#17181D] border-[#2D312C] text-[#A0A39A] hover:text-[#F5F6F2]'
                        : 'bg-[#C5FF62]/15 border-[#C5FF62]/45 text-[#C5FF62]'
                    }`}
                  >
                    {isHidden ? (
                      <>
                        <EyeOff size={13} aria-hidden="true" />
                        <span>Hidden</span>
                      </>
                    ) : (
                      <>
                        <Eye size={13} aria-hidden="true" />
                        <span>Visible</span>
                      </>
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 pt-4 border-t border-[#272A26] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onRestoreDefaults}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-full bg-[#222329] border border-[#34382F] text-xs font-medium text-[#F5F6F2] hover:border-[#C5FF62]/50 cursor-pointer"
          >
            <RotateCcw size={13} aria-hidden="true" />
            <span>Restore Default Layout</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-5 py-2 rounded-full bg-[#C5FF62] text-[#090A09] text-xs font-semibold hover:bg-[#D5FF8D] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
