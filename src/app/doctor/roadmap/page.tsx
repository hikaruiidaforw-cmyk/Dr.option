"use client";

import * as React from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Target,
  Users,
  ClipboardCheck,
  FileSignature,
  Rocket,
  ChevronRight,
  ChevronDown,
  Check,
  Circle,
  Clock,
  Lightbulb,
  BookOpen,
  Video,
  Wrench,
  MessageSquare,
  ArrowRight,
  Flag,
} from "lucide-react";
import {
  ROADMAP_PHASES,
  DEFAULT_PROGRESS,
  calculatePhaseProgress,
  getOverallProgress,
  getPhaseColor,
  type RoadmapPhase,
  type UserProgress,
} from "@/lib/roadmap";
import { cn } from "@/lib/utils";
import Link from "next/link";

const PHASE_ICONS: Record<string, React.ElementType> = {
  search: Search,
  target: Target,
  users: Users,
  clipboard: ClipboardCheck,
  "file-signature": FileSignature,
  rocket: Rocket,
};

export default function RoadmapPage() {
  // In real app, this would come from API/database
  const [progress, setProgress] = React.useState<UserProgress>(DEFAULT_PROGRESS);
  const [expandedPhase, setExpandedPhase] = React.useState<string | null>("phase-1");

  const handleTaskToggle = (taskId: string) => {
    setProgress((prev) => {
      const completedTasks = prev.completedTasks.includes(taskId)
        ? prev.completedTasks.filter((id) => id !== taskId)
        : [...prev.completedTasks, taskId];
      return { ...prev, completedTasks };
    });
  };

  const handlePhaseChange = (phaseNumber: number) => {
    setProgress((prev) => ({ ...prev, currentPhase: phaseNumber }));
  };

  const overallProgress = getOverallProgress(progress.completedTasks);

  return (
    <div className="space-y-6">
      <PageHeader
        title="承継ロードマップ"
        description="承継までの道のりを6つのフェーズで可視化し、進捗を管理できます"
      />

      {/* Progress Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-ink-muted mb-1">全体の進捗</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-ink">{overallProgress}%</span>
                <span className="text-sm text-ink-muted">完了</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-accent" />
              <span className="text-sm text-ink">
                現在のフェーズ:{" "}
                <strong className="text-accent">
                  Phase {progress.currentPhase} - {ROADMAP_PHASES[progress.currentPhase - 1]?.title}
                </strong>
              </span>
            </div>
          </div>

          {/* Phase Progress Bar */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              {ROADMAP_PHASES.map((phase, index) => {
                const colors = getPhaseColor(phase.color);
                const isCompleted = phase.number < progress.currentPhase;
                const isCurrent = phase.number === progress.currentPhase;
                const Icon = PHASE_ICONS[phase.icon] || Circle;

                return (
                  <button
                    key={phase.id}
                    onClick={() => handlePhaseChange(phase.number)}
                    className={cn(
                      "relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      isCompleted && colors.bg + " text-white",
                      isCurrent && "ring-4 ring-offset-2 " + colors.bg + " text-white " + colors.border,
                      !isCompleted && !isCurrent && "bg-gray-200 text-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">{phase.number}</span>
                    )}
                  </button>
                );
              })}
            </div>
            {/* Progress Line */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 -z-0">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${((progress.currentPhase - 1) / (ROADMAP_PHASES.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Phase Labels */}
          <div className="hidden md:flex items-start justify-between mt-3">
            {ROADMAP_PHASES.map((phase) => (
              <div key={phase.id} className="w-20 text-center">
                <p className="text-xs text-ink-muted line-clamp-2">{phase.title}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phase Details */}
      <div className="space-y-4">
        {ROADMAP_PHASES.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            progress={progress}
            isExpanded={expandedPhase === phase.id}
            onToggle={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
            onTaskToggle={handleTaskToggle}
            onSetCurrent={() => handlePhaseChange(phase.number)}
          />
        ))}
      </div>
    </div>
  );
}

interface PhaseCardProps {
  phase: RoadmapPhase;
  progress: UserProgress;
  isExpanded: boolean;
  onToggle: () => void;
  onTaskToggle: (taskId: string) => void;
  onSetCurrent: () => void;
}

function PhaseCard({
  phase,
  progress,
  isExpanded,
  onToggle,
  onTaskToggle,
  onSetCurrent,
}: PhaseCardProps) {
  const colors = getPhaseColor(phase.color);
  const phaseProgress = calculatePhaseProgress(phase, progress.completedTasks);
  const isCompleted = phase.number < progress.currentPhase;
  const isCurrent = phase.number === progress.currentPhase;
  const Icon = PHASE_ICONS[phase.icon] || Circle;

  return (
    <Card
      className={cn(
        "transition-all",
        isCurrent && "border-2 " + colors.border,
        isCompleted && "opacity-75"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          {/* Phase Icon */}
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
              isCompleted || isCurrent ? colors.bg + " text-white" : "bg-gray-100 text-gray-400"
            )}
          >
            <Icon className="w-6 h-6" />
          </div>

          {/* Phase Header */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={cn(colors.light, colors.text)}>
                Phase {phase.number}
              </Badge>
              <span className="text-xs text-ink-muted flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {phase.duration}
              </span>
              {isCurrent && (
                <Badge className="bg-accent text-white">現在</Badge>
              )}
              {isCompleted && (
                <Badge className="bg-success text-white">
                  <Check className="w-3 h-3 mr-1" />
                  完了
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{phase.title}</CardTitle>
            <p className="text-sm text-ink-muted">{phase.subtitle}</p>
          </div>

          {/* Progress & Expand */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-2xl font-bold text-ink">{phaseProgress}%</p>
              <p className="text-xs text-ink-muted">完了</p>
            </div>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-surface-sunken rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-ink-muted" />
              ) : (
                <ChevronRight className="w-5 h-5 text-ink-muted" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-surface-sunken rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", colors.bg)}
            style={{ width: `${phaseProgress}%` }}
          />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          {/* Description */}
          <p className="text-sm text-ink-muted mb-6">{phase.description}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-medium text-ink flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-accent" />
                やることリスト
              </h4>
              <div className="space-y-2">
                {phase.tasks.map((task) => {
                  const isTaskCompleted = progress.completedTasks.includes(task.id);
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer",
                        isTaskCompleted
                          ? "bg-success/5 border-success/30"
                          : "bg-white border-border hover:border-accent/30"
                      )}
                      onClick={() => onTaskToggle(task.id)}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                          isTaskCompleted
                            ? "bg-success border-success text-white"
                            : "border-gray-300"
                        )}
                      >
                        {isTaskCompleted && <Check className="w-3 h-3" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={cn(
                              "font-medium text-sm",
                              isTaskCompleted && "line-through text-ink-muted"
                            )}
                          >
                            {task.title}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              task.priority === "high" && "border-red-300 text-red-600",
                              task.priority === "medium" && "border-yellow-300 text-yellow-600",
                              task.priority === "low" && "border-gray-300 text-gray-600"
                            )}
                          >
                            {task.priority === "high" && "重要"}
                            {task.priority === "medium" && "推奨"}
                            {task.priority === "low" && "任意"}
                          </Badge>
                        </div>
                        <p className="text-xs text-ink-muted mt-1">{task.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips & Resources */}
            <div className="space-y-6">
              {/* Tips */}
              <div>
                <h4 className="font-medium text-ink flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-warning" />
                  ワンポイントアドバイス
                </h4>
                <div className="space-y-2">
                  {phase.tips.map((tip, index) => (
                    <p key={index} className="text-sm text-ink-muted flex items-start gap-2">
                      <span className="text-warning">•</span>
                      {tip}
                    </p>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-medium text-ink flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-accent" />
                  関連リソース
                </h4>
                <div className="space-y-2">
                  {phase.resources.map((resource, index) => {
                    const ResourceIcon =
                      resource.type === "video"
                        ? Video
                        : resource.type === "tool"
                        ? Wrench
                        : resource.type === "consultation"
                        ? MessageSquare
                        : BookOpen;

                    const content = (
                      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-sunken transition-colors">
                        <ResourceIcon className="w-4 h-4 text-ink-muted" />
                        <span className="text-sm text-ink">{resource.title}</span>
                        {resource.url && <ArrowRight className="w-3 h-3 text-ink-muted ml-auto" />}
                      </div>
                    );

                    return resource.url ? (
                      <Link key={index} href={resource.url}>
                        {content}
                      </Link>
                    ) : (
                      <div key={index} className="opacity-50 cursor-not-allowed">
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {!isCurrent && !isCompleted && (
            <div className="mt-6 pt-4 border-t border-border">
              <Button variant="outline" onClick={onSetCurrent}>
                このフェーズを現在のフェーズに設定
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
