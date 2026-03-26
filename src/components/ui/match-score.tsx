"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { type MatchResult, getMatchLabel } from "@/lib/matching";
import { CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

interface MatchScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

/**
 * マッチ度スコアバッジ（シンプル表示）
 */
export function MatchScoreBadge({
  score,
  size = "md",
  showLabel = true,
  className,
}: MatchScoreProps) {
  const { color } = getMatchLabel(score);

  const colorClasses = {
    high: "bg-success-soft text-success",
    medium: "bg-warning-soft text-warning",
    low: "bg-surface-sunken text-ink-muted",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium",
        colorClasses[color],
        sizeClasses[size],
        className
      )}
    >
      <span className="font-bold">{score}%</span>
      {showLabel && <span className="opacity-80">マッチ</span>}
    </span>
  );
}

interface MatchScoreCircleProps {
  score: number;
  size?: number;
  className?: string;
}

/**
 * マッチ度スコア（円形表示）
 */
export function MatchScoreCircle({
  score,
  size = 80,
  className,
}: MatchScoreCircleProps) {
  const { text, color } = getMatchLabel(score);

  const colorClasses = {
    high: "text-success",
    medium: "text-warning",
    low: "text-ink-muted",
  };

  const strokeColor = {
    high: "#10B981",
    medium: "#F59E0B",
    low: "#94A3B8",
  };

  const circumference = 2 * Math.PI * 36; // radius = 36
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("relative inline-flex", className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size} viewBox="0 0 80 80">
        {/* Background circle */}
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-surface-sunken"
        />
        {/* Progress circle */}
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke={strokeColor[color]}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-2xl font-bold", colorClasses[color])}>{score}</span>
        <span className="text-[10px] text-ink-muted">マッチ度</span>
      </div>
    </div>
  );
}

interface MatchScoreDetailProps {
  result: MatchResult;
  className?: string;
  defaultOpen?: boolean;
}

/**
 * マッチ度スコア詳細表示（展開可能）
 */
export function MatchScoreDetail({
  result,
  className,
  defaultOpen = false,
}: MatchScoreDetailProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const { text, color } = getMatchLabel(result.score);

  const colorClasses = {
    high: "border-success/30 bg-success-soft/30",
    medium: "border-warning/30 bg-warning-soft/30",
    low: "border-border bg-surface-sunken/30",
  };

  return (
    <div className={cn("rounded-xl border", colorClasses[color], className)}>
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-4">
          <MatchScoreCircle score={result.score} size={64} />
          <div>
            <p className="font-medium text-ink">マッチ度: {text}</p>
            <p className="text-sm text-ink-muted mt-0.5">
              {result.reasons.filter((r) => r.matched).length}/{result.reasons.length} の条件が一致
            </p>
          </div>
        </div>
        <div className="text-ink-muted">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Detail */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          <div className="border-t border-border/50 pt-4">
            {result.reasons.map((reason, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  {reason.matched ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-border" />
                  )}
                  <span className="text-sm text-ink">{reason.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-muted">{reason.detail}</span>
                  <div className="w-16 h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        reason.score >= 70 ? "bg-success" : reason.score >= 40 ? "bg-warning" : "bg-ink-muted"
                      )}
                      style={{ width: `${reason.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="bg-warning-soft/50 rounded-lg p-3">
              {result.warnings.map((warning, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-warning">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface MatchScoreCardProps {
  result: MatchResult;
  className?: string;
}

/**
 * マッチ度スコアカード（コンパクト版）
 */
export function MatchScoreCard({ result, className }: MatchScoreCardProps) {
  const matchedCount = result.reasons.filter((r) => r.matched).length;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <MatchScoreCircle score={result.score} size={48} />
      <div className="flex flex-wrap gap-1.5">
        {result.reasons.slice(0, 3).map((reason, index) => (
          <span
            key={index}
            className={cn(
              "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded",
              reason.matched
                ? "bg-success-soft text-success"
                : "bg-surface-sunken text-ink-muted"
            )}
          >
            {reason.matched && <CheckCircle className="w-3 h-3" />}
            {reason.label}
          </span>
        ))}
      </div>
    </div>
  );
}
