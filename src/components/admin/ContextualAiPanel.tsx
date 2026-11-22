import React, { useState } from 'react';
import { ArrowUpRight, Bot, Send } from 'lucide-react';
import { AssistantExchange } from '../../hooks/useWorkspaceState';
import { AdminModuleId } from '../../types/workspace';

interface ContextualAiPanelProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
  history: AssistantExchange[];
  onRunPrompt: (prompt: string) => void;
  onOpenFullModule: (id: AdminModuleId) => void;
}

const SUGGESTED_ACTIONS = [
  'Help me plan today',
  'Find my next priority',
  'Review my active goals',
  'Help me organize an idea',
  'Identify possible schedule conflicts',
];

export const ContextualAiPanel: React.FC<ContextualAiPanelProps> = ({
  inputRef,
  history,
  onRunPrompt,
  onOpenFullModule,
}) => {
  const [promptInput, setPromptInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    onRunPrompt(promptInput);
    setPromptInput('');
  };

  return (
    <section
      id="contextual-ai-panel"
      aria-labelledby="widget-contextual-ai-title"
      className="rounded-[24px] bg-[#17181D] border border-[#2A2D28] p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#272A26]">
          <div>
            <div className="flex items-center gap-2">
              <Bot size={17} className="text-[#C5FF62]" aria-hidden="true" />
              <h2
                id="widget-contextual-ai-title"
                className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#F5F6F2]"
              >
                What would you like to make progress on?
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-[#A0A39A]">
              Contextual workspace preview · Demonstration responses (AI backend not connected)
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenFullModule('ai-assistant')}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#C5FF62] hover:underline whitespace-nowrap cursor-pointer py-1"
          >
            <span>Open Full AI Assistant</span>
            <ArrowUpRight size={13} aria-hidden="true" />
          </button>
        </div>

        {/* Suggested Workspace Actions */}
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Suggested AI prompts">
          {SUGGESTED_ACTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onRunPrompt(suggestion)}
              className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-[#222329] border border-[#30342E] hover:border-[#C5FF62]/55 hover:text-[#C5FF62] text-xs font-medium text-[#F5F6F2] transition-colors cursor-pointer text-left"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
          <label htmlFor="contextual-ai-input" className="sr-only">
            Ask the contextual workspace assistant
          </label>
          <input
            ref={inputRef}
            id="contextual-ai-input"
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Ask about today's priorities, goals, or schedule..."
            className="flex-1 min-w-0 h-10 px-4 rounded-full bg-[#101110] border border-[#2D312C] focus:border-[#C5FF62] focus:outline-none text-sm text-[#F5F6F2] placeholder:text-[#A0A39A]/75"
          />
          <button
            type="submit"
            disabled={!promptInput.trim()}
            aria-label="Send prompt to demonstration assistant"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#C5FF62] text-[#090A09] hover:bg-[#D5FF8D] disabled:opacity-45 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
          >
            <Send size={15} aria-hidden="true" />
          </button>
        </form>

        {/* Demonstration Output Area */}
        <div className="mt-4 space-y-3">
          {history.length === 0 ? (
            <div className="rounded-2xl bg-[#101110]/70 border border-[#272A26] p-4 text-xs text-[#A0A39A] leading-relaxed">
              Select any suggested action above or enter a question to see how
              TRCK MAIN synthesizes priorities, goals, and schedule data. Live
              AI model responses will connect through the Specialized AI Team
              capability in a later phase.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#101110]/90 border border-[#272A26] p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] text-[#A0A39A]">
                    <span className="font-medium text-[#C5FF62]">
                      Prompt: {item.prompt}
                    </span>
                    <span className="font-mono tabular-nums shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-[#F5F6F2]">
                    {item.responseTitle}
                  </h3>
                  <ul className="space-y-1 text-xs leading-relaxed text-[#F5F6F2]/90">
                    {item.responseBody.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                  <p className="pt-1.5 border-t border-[#272A26] text-[11px] text-[#A0A39A]">
                    {item.basis}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
