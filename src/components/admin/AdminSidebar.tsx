import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  X,
} from 'lucide-react';
import { BrandMark } from '../BrandMark';
import { ADMIN_MODULES, MODULE_CATEGORIES } from '../../data/adminModules';
import { AdminModuleId, ModuleCategoryId } from '../../types/workspace';
import { ModuleIcon } from './ModuleIcon';

interface AdminSidebarProps {
  activeModuleId: AdminModuleId;
  onSelectModule: (id: AdminModuleId) => void;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onExitToLanding: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeModuleId,
  onSelectModule,
  collapsed,
  mobileOpen,
  onCloseMobile,
  onExitToLanding,
}) => {
  const [openCategories, setOpenCategories] = useState<
    Record<ModuleCategoryId, boolean>
  >(() => {
    const initial = {} as Record<ModuleCategoryId, boolean>;
    for (const cat of MODULE_CATEGORIES) {
      initial[cat.id] = Boolean(cat.defaultOpen);
    }
    return initial;
  });

  // Ensure the category containing the active module opens automatically
  useEffect(() => {
    const activeMod = ADMIN_MODULES.find((m) => m.id === activeModuleId);
    if (activeMod) {
      setOpenCategories((prev) =>
        prev[activeMod.categoryId]
          ? prev
          : { ...prev, [activeMod.categoryId]: true }
      );
    }
  }, [activeModuleId]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseMobile();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, onCloseMobile]);

  const toggleCategory = (catId: ModuleCategoryId) => {
    setOpenCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleModuleClick = (id: AdminModuleId) => {
    onSelectModule(id);
    onCloseMobile();
  };

  const renderNavBody = (isCollapsedDesktop: boolean) => (
    <div className="flex flex-col h-full bg-[#101110] border-r border-[#272A26]">
      {/* Brand Lockup */}
      <div
        className={`h-[68px] flex items-center border-b border-[#272A26]/80 shrink-0 ${
          isCollapsedDesktop ? 'justify-center px-3' : 'justify-between px-5'
        }`}
      >
        <button
          type="button"
          onClick={() => handleModuleClick('dashboard-daily-reflection')}
          className="inline-flex items-center rounded-lg py-1 cursor-pointer text-left"
          aria-label="TRCK MAIN Dashboard Home"
        >
          <BrandMark showWordmark={!isCollapsedDesktop} />
        </button>

        {mobileOpen && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation drawer"
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#17181D] border border-[#2D312C] text-[#F5F6F2] hover:border-[#C5FF62]/50 cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Scrollable Navigation Architecture (All 23 Original Modules) */}
      <nav
        aria-label="Admin workspace modules"
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-4"
      >
        {MODULE_CATEGORIES.map((category) => {
          const categoryModules = ADMIN_MODULES.filter(
            (m) => m.categoryId === category.id
          );
          const isOpen = openCategories[category.id];

          return (
            <div key={category.id} className="space-y-1">
              {!isCollapsedDesktop ? (
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.09em] uppercase text-[#A0A39A] hover:text-[#F5F6F2] transition-colors cursor-pointer rounded-lg"
                >
                  <span className="truncate">{category.label}</span>
                  {isOpen ? (
                    <ChevronDown size={13} aria-hidden="true" className="shrink-0 opacity-75" />
                  ) : (
                    <ChevronRight size={13} aria-hidden="true" className="shrink-0 opacity-75" />
                  )}
                </button>
              ) : (
                <div
                  className="mx-auto w-6 h-px bg-[#272A26] my-2"
                  aria-hidden="true"
                />
              )}

              {(isCollapsedDesktop || isOpen) && (
                <ul className="space-y-1">
                  {categoryModules.map((mod) => {
                    const isActive = activeModuleId === mod.id;
                    return (
                      <li key={mod.id} className="relative group/nav">
                        <button
                          type="button"
                          onClick={() => handleModuleClick(mod.id)}
                          aria-current={isActive ? 'page' : undefined}
                          aria-label={isCollapsedDesktop ? mod.name : undefined}
                          title={isCollapsedDesktop ? `${mod.name} (${category.label})` : undefined}
                          className={`w-full flex items-center rounded-xl transition-all duration-150 cursor-pointer min-h-[40px] ${
                            isCollapsedDesktop
                              ? 'justify-center px-2 py-2'
                              : 'justify-between gap-2.5 px-3 py-2 text-left'
                          } ${
                            isActive
                              ? 'bg-[#C5FF62] text-[#090A09] font-semibold shadow-[0_6px_20px_rgba(197,255,98,0.16)]'
                              : 'text-[#A0A39A] hover:text-[#F5F6F2] hover:bg-[#17181D]'
                          }`}
                        >
                          <span
                            className={`flex items-center min-w-0 ${
                              isCollapsedDesktop ? 'justify-center' : 'gap-2.5'
                            }`}
                          >
                            <ModuleIcon
                              iconName={mod.iconName}
                              size={17}
                              className={
                                isActive
                                  ? 'text-[#090A09] shrink-0'
                                  : 'text-[#A0A39A] group-hover/nav:text-[#C5FF62] shrink-0 transition-colors'
                              }
                            />
                            {!isCollapsedDesktop && (
                              <span className="text-[13px] leading-tight truncate">
                                {mod.name}
                              </span>
                            )}
                          </span>

                          {!isCollapsedDesktop && isActive && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#090A09]/12 text-[#090A09] shrink-0">
                              <ArrowUpRight size={13} aria-hidden="true" />
                            </span>
                          )}
                        </button>

                        {/* Accessible tooltip when collapsed on desktop */}
                        {isCollapsedDesktop && (
                          <div
                            role="tooltip"
                            className="pointer-events-none opacity-0 group-hover/nav:opacity-100 group-focus-within/nav:opacity-100 transition-opacity duration-150 hidden lg:block fixed left-[82px] -translate-y-9 z-50 px-3 py-1.5 rounded-lg bg-[#222329] border border-[#34382F] text-xs font-medium text-[#F5F6F2] whitespace-nowrap shadow-xl"
                          >
                            {mod.name}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-[#272A26]/80 shrink-0 space-y-1">
        {!isCollapsedDesktop && (
          <p className="px-2.5 py-1 text-[11px] text-[#A0A39A]">
            Development preview · 23 modules mapped
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            onCloseMobile();
            onExitToLanding();
          }}
          title={isCollapsedDesktop ? 'Public Landing Page' : undefined}
          className={`w-full flex items-center rounded-xl min-h-[40px] text-xs font-medium text-[#A0A39A] hover:text-[#C5FF62] hover:bg-[#17181D] transition-colors cursor-pointer ${
            isCollapsedDesktop ? 'justify-center px-2' : 'gap-2.5 px-3'
          }`}
        >
          <ExternalLink size={15} aria-hidden="true" className="shrink-0" />
          {!isCollapsedDesktop && (
            <span className="truncate">Public Landing Page</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Collapsible Sidebar */}
      <aside
        aria-label="Workspace sidebar"
        className={`hidden lg:block shrink-0 sticky top-0 h-screen transition-[width] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] z-30 ${
          collapsed ? 'w-[76px]' : 'w-[272px]'
        }`}
      >
        {renderNavBody(collapsed)}
      </aside>

      {/* Mobile Accessible Drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile workspace navigation"
        >
          <div
            className="fixed inset-0 bg-[#050605]/80"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-[290px] max-w-[85vw] h-full shadow-2xl">
            {renderNavBody(false)}
          </aside>
        </div>
      )}
    </>
  );
};
