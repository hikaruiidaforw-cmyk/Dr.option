"use client";

import * as React from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  User,
  Users,
  FileText,
  Building2,
  Wallet,
  Settings,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  AlertTriangle,
  Flag,
  Bell,
  Download,
  Filter,
  Stethoscope,
} from "lucide-react";
import {
  createSamplePlan,
  getPhaseProgress,
  getOverallProgress,
  getDaysUntilTransfer,
  getWeeksUntilTransfer,
  formatDate,
  getPhaseColor,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  ASSIGNEE_LABELS,
  type TransitionPlan,
  type TransitionTask,
  type TaskCategory,
} from "@/lib/transition-planner";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<TaskCategory, React.ElementType> = {
  patient: Stethoscope,
  staff: Users,
  operation: Settings,
  legal: FileText,
  financial: Wallet,
  facility: Building2,
};

export default function TransitionPlannerPage() {
  const [plan, setPlan] = React.useState<TransitionPlan>(() => createSamplePlan());
  const [expandedPhase, setExpandedPhase] = React.useState<string>("phase-1");
  const [filterCategory, setFilterCategory] = React.useState<string>("");
  const [showNotifications, setShowNotifications] = React.useState(false);

  const overallProgress = getOverallProgress(plan.tasks);
  const daysUntilTransfer = getDaysUntilTransfer(plan.transferDate);
  const weeksUntilTransfer = getWeeksUntilTransfer(plan.transferDate);

  const toggleTask = (taskId: string) => {
    setPlan((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      ),
    }));
  };

  const toggleNotification = (notificationId: string) => {
    setPlan((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === notificationId ? { ...n, isCompleted: !n.isCompleted } : n
      ),
    }));
  };

  const toggleMilestone = (milestoneId: string) => {
    setPlan((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m
      ),
    }));
  };

  const filteredTasks = (phaseId: string) => {
    let tasks = plan.tasks.filter((t) => t.phaseId === phaseId);
    if (filterCategory) {
      tasks = tasks.filter((t) => t.category === filterCategory);
    }
    return tasks;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="引き継ぎプランナー"
        description="承継に向けた引き継ぎスケジュールを管理します"
      />

      {/* Plan Header */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                <User className="w-7 h-7 text-accent" />
              </div>
              <div>
                <p className="text-sm text-ink-muted">後継者</p>
                <p className="text-xl font-bold text-ink">{plan.successorName}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{daysUntilTransfer}</p>
                <p className="text-sm text-ink-muted">日後に承継</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-ink">{overallProgress}%</p>
                <p className="text-sm text-ink-muted">準備完了</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-ink-muted mb-2">
              <span>開始日: {formatDate(plan.startDate)}</span>
              <span>承継日: {formatDate(plan.transferDate)}</span>
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {plan.phases.map((phase) => {
          const progress = getPhaseProgress(phase.id, plan.tasks);
          const colors = getPhaseColor(phase.color);
          return (
            <Card key={phase.id} className={cn(expandedPhase === phase.id && "ring-2 ring-accent")}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("w-2 h-2 rounded-full", colors.bg)} />
                  <p className="text-sm font-medium text-ink">{phase.title}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-ink">{progress.completed}</span>
                  <span className="text-sm text-ink-muted">/ {progress.total}</span>
                </div>
                <div className="mt-2 h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", colors.bg)}
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Milestones Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-accent" />
            マイルストーン
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 overflow-x-auto pb-4">
            {plan.milestones.map((milestone, index) => {
              const phase = plan.phases.find((p) => p.id === milestone.phaseId);
              const colors = phase ? getPhaseColor(phase.color) : getPhaseColor("blue");
              const isPast = milestone.date < new Date();

              return (
                <div key={milestone.id} className="flex-shrink-0 w-48">
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={() => toggleMilestone(milestone.id)}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        milestone.isCompleted
                          ? "bg-success text-white"
                          : isPast
                          ? "bg-error/20 text-error"
                          : colors.bg + " text-white"
                      )}
                    >
                      {milestone.isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </button>
                    {index < plan.milestones.length - 1 && (
                      <div className={cn(
                        "flex-1 h-0.5",
                        milestone.isCompleted ? "bg-success" : "bg-border"
                      )} />
                    )}
                  </div>
                  <p className="font-medium text-ink text-sm">{milestone.title}</p>
                  <p className="text-xs text-ink-muted mt-1">{formatDate(milestone.date)}</p>
                  <p className="text-xs text-ink-muted mt-1">{milestone.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs: Tasks / Notifications */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowNotifications(false)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            !showNotifications
              ? "bg-accent text-white"
              : "bg-surface-sunken text-ink-muted hover:text-ink"
          )}
        >
          <Settings className="w-4 h-4 inline-block mr-2" />
          タスク一覧
        </button>
        <button
          onClick={() => setShowNotifications(true)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            showNotifications
              ? "bg-accent text-white"
              : "bg-surface-sunken text-ink-muted hover:text-ink"
          )}
        >
          <Bell className="w-4 h-4 inline-block mr-2" />
          届出・通知
        </button>
      </div>

      {!showNotifications ? (
        <>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory("")}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-all",
                !filterCategory
                  ? "bg-accent text-white"
                  : "bg-surface-sunken text-ink-muted hover:text-ink"
              )}
            >
              すべて
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilterCategory(filterCategory === key ? "" : key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-all",
                  filterCategory === key
                    ? "bg-accent text-white"
                    : "bg-surface-sunken text-ink-muted hover:text-ink"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Phase Task Lists */}
          <div className="space-y-4">
            {plan.phases.map((phase) => {
              const progress = getPhaseProgress(phase.id, plan.tasks);
              const colors = getPhaseColor(phase.color);
              const phaseTasks = filteredTasks(phase.id);
              const isExpanded = expandedPhase === phase.id;

              return (
                <Card key={phase.id}>
                  <button
                    onClick={() => setExpandedPhase(isExpanded ? "" : phase.id)}
                    className="w-full"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            colors.light
                          )}>
                            <span className={cn("font-bold", colors.text)}>
                              {phase.number}
                            </span>
                          </div>
                          <div className="text-left">
                            <CardTitle className="text-base">{phase.title}</CardTitle>
                            <p className="text-sm text-ink-muted">{phase.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-ink">
                              {progress.completed}/{progress.total}
                            </p>
                            <p className="text-xs text-ink-muted">{progress.percentage}% 完了</p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-ink-muted" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-ink-muted" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </button>

                  {isExpanded && (
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {phaseTasks.length === 0 ? (
                          <p className="text-sm text-ink-muted text-center py-4">
                            該当するタスクがありません
                          </p>
                        ) : (
                          phaseTasks.map((task) => (
                            <TaskItem
                              key={task.id}
                              task={task}
                              onToggle={() => toggleTask(task.id)}
                            />
                          ))
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        /* Notifications List */
        <Card>
          <CardHeader>
            <CardTitle>届出・通知チェックリスト</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.notifications.map((notification) => {
                const TargetIcon = {
                  patients: Stethoscope,
                  staff: Users,
                  suppliers: Building2,
                  government: FileText,
                  insurance: FileText,
                }[notification.target];

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border transition-all",
                      notification.isCompleted
                        ? "bg-success/5 border-success/30"
                        : "bg-white border-border"
                    )}
                  >
                    <button
                      onClick={() => toggleNotification(notification.id)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                        notification.isCompleted
                          ? "bg-success border-success text-white"
                          : "border-gray-300 hover:border-accent"
                      )}
                    >
                      {notification.isCompleted && <CheckCircle className="w-4 h-4" />}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <TargetIcon className="w-4 h-4 text-ink-muted" />
                        <p className={cn(
                          "font-medium",
                          notification.isCompleted && "line-through text-ink-muted"
                        )}>
                          {notification.title}
                        </p>
                        {notification.templateAvailable && (
                          <Badge variant="outline" className="text-xs">
                            テンプレートあり
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-ink-muted">{notification.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-4 h-4 text-warning" />
                        <span className="text-sm text-warning font-medium">
                          {notification.deadline}
                        </span>
                      </div>
                    </div>

                    {notification.templateAvailable && (
                      <Button variant="ghost" size="small">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-ink">引き継ぎ計画をエクスポート</p>
              <p className="text-sm text-ink-muted">PDF形式でダウンロードできます</p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              PDFダウンロード
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface TaskItemProps {
  task: TransitionTask;
  onToggle: () => void;
}

function TaskItem({ task, onToggle }: TaskItemProps) {
  const CategoryIcon = CATEGORY_ICONS[task.category];

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg border transition-all",
        task.isCompleted
          ? "bg-success/5 border-success/30"
          : task.priority === "high"
          ? "bg-white border-error/30"
          : "bg-white border-border"
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
          task.isCompleted
            ? "bg-success border-success text-white"
            : "border-gray-300 hover:border-accent"
        )}
      >
        {task.isCompleted && <CheckCircle className="w-4 h-4" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className={cn(
            "font-medium",
            task.isCompleted && "line-through text-ink-muted"
          )}>
            {task.title}
          </p>
          <Badge className={cn("text-xs", CATEGORY_COLORS[task.category])}>
            <CategoryIcon className="w-3 h-3 mr-1" />
            {CATEGORY_LABELS[task.category]}
          </Badge>
          {task.priority === "high" && !task.isCompleted && (
            <Badge className="bg-error text-white text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              重要
            </Badge>
          )}
        </div>
        <p className="text-sm text-ink-muted">{task.description}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-ink-muted">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {ASSIGNEE_LABELS[task.assignee]}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            承継{task.dueWeek >= 0 ? `${task.dueWeek}週間前` : `${Math.abs(task.dueWeek)}週間後`}まで
          </span>
        </div>
      </div>
    </div>
  );
}
