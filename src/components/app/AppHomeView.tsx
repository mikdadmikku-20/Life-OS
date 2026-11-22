import React from 'react';
import {
  ActivityTimelineEvent,
  AppSidebarEntryId,
  CopilotStatusRow,
  GrowthLifeArea,
  LifeRingMetric,
  PreviewDocumentItem,
  QuickCapturedRecord,
  QuickRecordType,
  ScheduleSlotItem,
  ScoreWeightConfig,
} from '../../types/appHome';
import {
  UpcomingCommitment,
  WorkspaceGoal,
  WorkspaceProject,
  WorkspaceTask,
} from '../../types/workspace';
import { WelcomeHero3D } from './WelcomeHero3D';
import { TodayScheduleCard } from './cards/TodayScheduleCard';
import { GrowthAreasCard } from './cards/GrowthAreasCard';
import { DocumentsResourcesCard } from './cards/DocumentsResourcesCard';
import { ScoreProgressCard } from './cards/ScoreProgressCard';
import { MainTaskCard } from './cards/MainTaskCard';
import { AiCopilotCard } from './cards/AiCopilotCard';
import { GoalsProjectsCard } from './cards/GoalsProjectsCard';
import { LifeSnapshotCard } from './cards/LifeSnapshotCard';
import { QuickCaptureCard } from './cards/QuickCaptureCard';
import { RecentActivityCard } from './cards/RecentActivityCard';

interface AppHomeViewProps {
  cardSurfaceClass: string;
  dailyIntention: string;
  onUpdateIntention: (value: string) => void;
  selectedDayOffset: number;
  onChangeDayOffset: (offset: number) => void;
  scheduleSlots: ScheduleSlotItem[];
  growthAreas: GrowthLifeArea[];
  selectedGrowthAreaId: string;
  onSelectGrowthArea: (id: string) => void;
  documents: PreviewDocumentItem[];
  computedScore: number;
  scoreWeights: ScoreWeightConfig;
  onChangeScoreWeights: (next: ScoreWeightConfig) => void;
  mainTask: WorkspaceTask | undefined;
  tasks: WorkspaceTask[];
  onToggleTask: (id: string) => void;
  focusRunning: boolean;
  onToggleFocus: () => void;
  focusSecondsLeft: number;
  onResetFocus: () => void;
  activeGoalsPercent: number;
  copilotRows: CopilotStatusRow[];
  copilotAdjustmentApplied: boolean;
  copilotAdjustmentDismissed: boolean;
  onApplyCopilotFix: () => void;
  onDismissCopilotFix: () => void;
  goals: WorkspaceGoal[];
  projects: WorkspaceProject[];
  commitments: UpcomingCommitment[];
  lifeRings: LifeRingMetric[];
  capturedRecords: QuickCapturedRecord[];
  onSubmitCapture: (payload: { type: QuickRecordType; content: string }) => void;
  recentActivity: ActivityTimelineEvent[];
  onNavigateEntry: (id: AppSidebarEntryId) => void;
  quickCaptureInputRef: React.RefObject<HTMLInputElement | null>;
  copilotSectionRef: React.RefObject<HTMLElement | null>;
}

export const AppHomeView: React.FC<AppHomeViewProps> = ({
  cardSurfaceClass,
  dailyIntention,
  onUpdateIntention,
  selectedDayOffset,
  onChangeDayOffset,
  scheduleSlots,
  growthAreas,
  selectedGrowthAreaId,
  onSelectGrowthArea,
  documents,
  computedScore,
  scoreWeights,
  onChangeScoreWeights,
  mainTask,
  tasks,
  onToggleTask,
  focusRunning,
  onToggleFocus,
  focusSecondsLeft,
  onResetFocus,
  activeGoalsPercent,
  copilotRows,
  copilotAdjustmentApplied,
  copilotAdjustmentDismissed,
  onApplyCopilotFix,
  onDismissCopilotFix,
  goals,
  projects,
  commitments,
  lifeRings,
  capturedRecords,
  onSubmitCapture,
  recentActivity,
  onNavigateEntry,
  quickCaptureInputRef,
  copilotSectionRef,
}) => {
  return (
    <div className="space-y-5">
      {/* Top Hero Welcome + 3D Life Hub Centerpiece */}
      <WelcomeHero3D
        dailyIntention={dailyIntention}
        onUpdateIntention={onUpdateIntention}
        cardSurfaceClass={cardSurfaceClass}
      />

      {/* Row 1: Wide Today's Schedule (8 cols) + Emerald Growth & Life Areas (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-8 flex flex-col [&>section]:flex-1">
          <TodayScheduleCard
            selectedDayOffset={selectedDayOffset}
            onChangeDayOffset={onChangeDayOffset}
            slots={scheduleSlots}
            onNavigateEntry={onNavigateEntry}
            cardSurfaceClass={cardSurfaceClass}
          />
        </div>

        <div className="xl:col-span-4 flex flex-col [&>section]:flex-1">
          <GrowthAreasCard
            areas={growthAreas}
            selectedAreaId={selectedGrowthAreaId}
            onSelectArea={onSelectGrowthArea}
            onNavigateEntry={onNavigateEntry}
          />
        </div>
      </div>

      {/* Row 2: Documents (4 cols) + Score & Main Task Stack (4 cols) + AI Co-pilot (4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5 items-stretch">
        <div className="md:col-span-1 xl:col-span-4 flex flex-col [&>section]:flex-1">
          <DocumentsResourcesCard
            documents={documents}
            onNavigateEntry={onNavigateEntry}
            cardSurfaceClass={cardSurfaceClass}
          />
        </div>

        <div className="md:col-span-1 xl:col-span-4 flex flex-col gap-5">
          <ScoreProgressCard
            score={computedScore}
            weights={scoreWeights}
            onChangeWeights={onChangeScoreWeights}
            cardSurfaceClass={cardSurfaceClass}
          />

          <div className="flex-1 flex flex-col [&>section]:flex-1">
            <MainTaskCard
              task={mainTask}
              tasks={tasks}
              onToggleTask={onToggleTask}
              focusRunning={focusRunning}
              onToggleFocus={onToggleFocus}
              focusSecondsLeft={focusSecondsLeft}
              onResetFocus={onResetFocus}
              onNavigateEntry={onNavigateEntry}
              cardSurfaceClass={cardSurfaceClass}
            />
          </div>
        </div>

        <div className="md:col-span-2 xl:col-span-4 flex flex-col [&>section]:flex-1">
          <AiCopilotCard
            sectionRef={copilotSectionRef}
            activeGoalsPercent={activeGoalsPercent}
            rows={copilotRows}
            adjustmentApplied={copilotAdjustmentApplied}
            adjustmentDismissed={copilotAdjustmentDismissed}
            onApplyAdjustment={onApplyCopilotFix}
            onDismissAdjustment={onDismissCopilotFix}
            onNavigateEntry={onNavigateEntry}
            cardSurfaceClass={cardSurfaceClass}
          />
        </div>
      </div>

      {/* Row 3: Goals, Projects & Deadlines (6 cols) + Life Snapshot Progress Rings (6 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-6 flex flex-col [&>section]:flex-1">
          <GoalsProjectsCard
            goals={goals}
            projects={projects}
            commitments={commitments}
            onNavigateEntry={onNavigateEntry}
            cardSurfaceClass={cardSurfaceClass}
          />
        </div>

        <div className="xl:col-span-6 flex flex-col [&>section]:flex-1">
          <LifeSnapshotCard
            rings={lifeRings}
            onNavigateEntry={onNavigateEntry}
            cardSurfaceClass={cardSurfaceClass}
          />
        </div>
      </div>

      {/* Row 4: Quick Capture (6 cols) + Recent Activity Timeline (6 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-6 flex flex-col [&>section]:flex-1">
          <QuickCaptureCard
            inputRef={quickCaptureInputRef}
            capturedRecords={capturedRecords}
            onSubmitCapture={onSubmitCapture}
            cardSurfaceClass={cardSurfaceClass}
          />
        </div>

        <div className="xl:col-span-6 flex flex-col [&>section]:flex-1">
          <RecentActivityCard
            events={recentActivity}
            cardSurfaceClass={cardSurfaceClass}
          />
        </div>
      </div>
    </div>
  );
};
