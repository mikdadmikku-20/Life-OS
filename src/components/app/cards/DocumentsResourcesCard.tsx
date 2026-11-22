import React, { useState } from 'react';
import { ArrowUpRight, FileText, X } from 'lucide-react';
import { AppSidebarEntryId, PreviewDocumentItem } from '../../../types/appHome';

interface DocumentsResourcesCardProps {
  documents: PreviewDocumentItem[];
  onNavigateEntry: (id: AppSidebarEntryId) => void;
  cardSurfaceClass: string;
}

export const DocumentsResourcesCard: React.FC<DocumentsResourcesCardProps> = ({
  documents,
  onNavigateEntry,
  cardSurfaceClass,
}) => {
  const [viewAllOpen, setViewAllOpen] = useState(false);

  return (
    <>
      <section
        aria-labelledby="card-documents-title"
        className={`rounded-[26px] border p-5 sm:p-6 flex flex-col justify-between ${cardSurfaceClass}`}
      >
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2
                id="card-documents-title"
                className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#F5F7F2]"
              >
                Documents &amp; Resources
              </h2>
              <p className="mt-0.5 text-xs text-[#8CA195]">
                Sample previews · Future Import &amp; Resource Center
              </p>
            </div>

            <button
              type="button"
              onClick={() => setViewAllOpen(true)}
              className="px-3 py-1 rounded-full bg-[#0E1E16] border border-[#214231] text-xs font-medium text-[#F5F7F2] hover:border-[#6BFF9C]/55 hover:text-[#6BFF9C] transition-colors cursor-pointer shrink-0"
            >
              View all
            </button>
          </div>

          {/* 3-Thumbnail Preview Strip Inspired by Image 1 Documents Card */}
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {documents.slice(0, 3).map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => setViewAllOpen(true)}
                className="group text-left rounded-xl bg-[#07110C] border border-[#1E3B2B] hover:border-[#6BFF9C]/55 p-2 transition-colors cursor-pointer"
              >
                {/* Miniature Document Sheet Thumbnail */}
                <div className="aspect-[4/3] rounded-lg bg-[#F5F7F2] text-[#0B1711] p-2 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between text-[7px] font-bold uppercase tracking-wider text-[#134E2E]">
                    <span>{doc.fileType}</span>
                    <span>Preview</span>
                  </div>
                  <div className="space-y-1">
                    {doc.previewLines.slice(0, 3).map((line, i) => (
                      <p
                        key={i}
                        className="text-[7px] leading-tight truncate text-[#14221B]/80"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                <p className="mt-2 text-[11px] font-medium text-[#F5F7F2] group-hover:text-[#6BFF9C] truncate">
                  {doc.title}
                </p>
                <p className="text-[10px] text-[#8CA195] truncate">
                  {doc.updatedLabel}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs">
          <span className="text-[#8CA195] truncate">
            No files uploaded or persisted yet
          </span>
          <button
            type="button"
            onClick={() => onNavigateEntry('reading-tracker')}
            className="inline-flex items-center gap-1 font-medium text-[#6BFF9C] hover:underline shrink-0 cursor-pointer"
          >
            <span>Resources</span>
            <ArrowUpRight size={12} aria-hidden="true" />
          </button>
        </div>
      </section>

      {viewAllOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040906]/85"
          role="dialog"
          aria-modal="true"
          aria-labelledby="docs-modal-title"
          onClick={() => setViewAllOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-[24px] bg-[#0B1711] border border-[#234734] p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#1E3B2B]">
              <div>
                <h3
                  id="docs-modal-title"
                  className="text-lg font-semibold text-[#F5F7F2]"
                >
                  Documents &amp; Resources (Sample Preview)
                </h3>
                <p className="mt-0.5 text-xs text-[#8CA195]">
                  Connects in a later build phase to the Universal Document
                  &amp; Import Center and Resource Center.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewAllOpen(false)}
                aria-label="Close documents modal"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#11251B] border border-[#234734] text-[#F5F7F2] hover:border-[#6BFF9C]/50 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <ul className="mt-4 divide-y divide-[#1E3B2B]">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#11251B] border border-[#234734] flex items-center justify-center text-[#6BFF9C] shrink-0">
                      <FileText size={16} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#F5F7F2] truncate">
                        {doc.title}
                      </p>
                      <p className="text-xs text-[#8CA195]">
                        {doc.fileType} · {doc.linkedModule} · {doc.updatedLabel}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-4 rounded-xl bg-[#07110C] border border-[#1E3B2B] p-3 text-xs text-[#8CA195]">
              Preview notice: No files have been imported or stored yet.
              Real document ingestion will arrive with the Universal Document
              &amp; Import Center.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
