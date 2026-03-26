"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Building2,
  Share2,
  ChevronRight,
  Sparkles,
  Target,
  Clock,
  DollarSign,
  BarChart3,
  Info,
} from "lucide-react";
import {
  QUESTIONS,
  PHASE1_QUESTIONS,
  PHASE2_QUESTIONS,
  calculatePhase1,
  calculateFinalResult,
  getSpecialtyLabel,
  getDistributionForSpecialty,
  type Answers,
  type MarketValueResult,
  type Factor,
} from "@/lib/market-value";
import { cn } from "@/lib/utils";

// ============================================================
// 画面ステート
// ============================================================

type Screen = "top" | "question" | "phase1_result" | "final_result";

export default function MarketValuePage() {
  const [screen, setScreen] = React.useState<Screen>("top");
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({});
  const [phase1Result, setPhase1Result] = React.useState<{ min: number; max: number } | null>(null);
  const [finalResult, setFinalResult] = React.useState<MarketValueResult | null>(null);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const allQuestions = React.useMemo(() => {
    return [...PHASE1_QUESTIONS, ...PHASE2_QUESTIONS];
  }, []);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const isPhase1Complete = currentQuestionIndex >= PHASE1_QUESTIONS.length;
  const totalQuestions = allQuestions.length;

  // Phase 1 が終わったタイミングで中間結果を計算
  const showPhase1Result = React.useCallback(() => {
    const result = calculatePhase1(answers);
    setPhase1Result(result);
    setScreen("phase1_result");
  }, [answers]);

  // 最終結果を計算
  const showFinalResult = React.useCallback(() => {
    const result = calculateFinalResult(answers);
    setFinalResult(result);
    setScreen("final_result");
  }, [answers]);

  // 質問への回答処理
  const handleAnswer = React.useCallback(
    (value: string) => {
      if (currentQuestion.type === "multi_select") return; // multi_selectは別ハンドリング

      setIsAnimating(true);
      const newAnswers = { ...answers, [currentQuestion.id]: value };
      setAnswers(newAnswers);

      setTimeout(() => {
        // Phase 1最後の質問に回答した場合
        if (currentQuestionIndex === PHASE1_QUESTIONS.length - 1) {
          const result = calculatePhase1(newAnswers);
          setPhase1Result(result);
          setScreen("phase1_result");
        }
        // Phase 2最後の質問に回答した場合
        else if (currentQuestionIndex === totalQuestions - 1) {
          const result = calculateFinalResult(newAnswers);
          setFinalResult(result);
          setScreen("final_result");
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
        setIsAnimating(false);
      }, 300);
    },
    [answers, currentQuestion, currentQuestionIndex, totalQuestions]
  );

  // multi_select のトグル
  const handleMultiToggle = React.useCallback(
    (value: string) => {
      const current = (answers[currentQuestion.id] as string[]) || [];
      let updated: string[];

      if (value === "none") {
        updated = ["none"];
      } else {
        const withoutNone = current.filter((v) => v !== "none");
        if (withoutNone.includes(value)) {
          updated = withoutNone.filter((v) => v !== value);
        } else {
          updated = [...withoutNone, value];
        }
      }

      setAnswers({ ...answers, [currentQuestion.id]: updated });
    },
    [answers, currentQuestion]
  );

  // multi_select の次へ
  const handleMultiNext = React.useCallback(() => {
    const current = (answers[currentQuestion.id] as string[]) || [];
    if (current.length === 0) return;

    if (currentQuestionIndex === totalQuestions - 1) {
      showFinalResult();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [answers, currentQuestion, currentQuestionIndex, totalQuestions, showFinalResult]);

  // 戻る
  const handleBack = React.useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Phase 2 開始
  const startPhase2 = React.useCallback(() => {
    setScreen("question");
    setCurrentQuestionIndex(PHASE1_QUESTIONS.length);
  }, []);

  // リセット
  const reset = React.useCallback(() => {
    setScreen("top");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setPhase1Result(null);
    setFinalResult(null);
  }, []);

  // ============================================================
  // トップ画面
  // ============================================================
  if (screen === "top") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">約3分で完了</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-ink leading-tight">
              あなたのドクターとしての
              <br />
              <span className="text-accent">市場価値</span>、知っていますか？
            </h1>
            <p className="text-ink-muted text-lg">
              12の質問に答えるだけで、年収レンジと市場ポジションがわかります
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-surface-raised border border-border rounded-xl">
              <Target className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-sm font-medium text-ink">年収レンジ</p>
              <p className="text-xs text-ink-muted">万円単位で算出</p>
            </div>
            <div className="p-4 bg-surface-raised border border-border rounded-xl">
              <BarChart3 className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-sm font-medium text-ink">市場ポジション</p>
              <p className="text-xs text-ink-muted">同科目内での位置</p>
            </div>
            <div className="p-4 bg-surface-raised border border-border rounded-xl">
              <Building2 className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-sm font-medium text-ink">開業想定</p>
              <p className="text-xs text-ink-muted">開業時の参考年収</p>
            </div>
          </div>

          <Button
            size="large"
            className="px-12"
            onClick={() => {
              setScreen("question");
              setCurrentQuestionIndex(0);
            }}
          >
            診断を始める
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // ============================================================
  // 質問画面
  // ============================================================
  if (screen === "question" && currentQuestion) {
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    const phaseLabel = currentQuestion.phase === 1 ? "Phase 1: 基本属性" : "Phase 2: 詳細属性";
    const phaseProgress = currentQuestion.phase === 1
      ? `${currentQuestionIndex + 1} / ${PHASE1_QUESTIONS.length}`
      : `${currentQuestionIndex - PHASE1_QUESTIONS.length + 1} / ${PHASE2_QUESTIONS.length}`;

    const isMulti = currentQuestion.type === "multi_select";
    const multiSelected = isMulti ? ((answers[currentQuestion.id] as string[]) || []) : [];

    return (
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-muted">{phaseLabel}</span>
            <span className="text-ink-muted">{phaseProgress}</span>
          </div>
          <div className="h-2 bg-surface-sunken rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div
          className={cn(
            "transition-all duration-300",
            isAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
          )}
        >
          <h2 className="text-xl md:text-2xl font-bold text-ink mb-2">
            Q{currentQuestionIndex + 1}. {currentQuestion.label}
          </h2>
          {isMulti && (
            <p className="text-sm text-ink-muted mb-6">複数選択可能です</p>
          )}

          {/* Options */}
          <div className="space-y-3 mt-6">
            {currentQuestion.options.map((option) => {
              const isSelected = isMulti
                ? multiSelected.includes(option.value)
                : answers[currentQuestion.id] === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() =>
                    isMulti ? handleMultiToggle(option.value) : handleAnswer(option.value)
                  }
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-200",
                    "hover:border-accent/50 hover:bg-accent/5",
                    "min-h-[52px] flex items-center gap-3",
                    isSelected
                      ? "border-accent bg-accent/10 shadow-sm"
                      : "border-border bg-surface-raised"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      isMulti ? "rounded" : "rounded-full",
                      isSelected ? "border-accent bg-accent" : "border-border"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={cn("text-sm", isSelected ? "text-ink font-medium" : "text-ink")}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Multi-select Next button */}
          {isMulti && (
            <div className="mt-6">
              <Button
                onClick={handleMultiNext}
                disabled={multiSelected.length === 0}
                className="w-full"
              >
                次へ
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>

        {/* Back button */}
        {currentQuestionIndex > 0 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            前の質問に戻る
          </button>
        )}
      </div>
    );
  }

  // ============================================================
  // Phase 1 中間結果
  // ============================================================
  if (screen === "phase1_result" && phase1Result) {
    const specialty = answers.specialty as string;
    const dist = getDistributionForSpecialty(specialty);
    const specialtyLabel = getSpecialtyLabel(specialty);

    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Badge variant="accent" className="text-sm px-4 py-1">
            Phase 1 完了
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-ink">
            まずは概算結果です
          </h2>
        </div>

        {/* Range Display */}
        <Card className="border-accent/30">
          <CardContent className="py-8 text-center">
            <p className="text-sm text-ink-muted mb-3">推定年収レンジ</p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl md:text-5xl font-bold text-accent">
                {phase1Result.min.toLocaleString()}
              </span>
              <span className="text-2xl text-ink-muted">〜</span>
              <span className="text-4xl md:text-5xl font-bold text-accent">
                {phase1Result.max.toLocaleString()}
              </span>
              <span className="text-lg text-ink-muted">万円</span>
            </div>
          </CardContent>
        </Card>

        {/* Distribution Visual */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium text-ink mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent" />
              {specialtyLabel}の年収分布
            </h3>
            <DistributionBar
              distribution={dist}
              currentMin={phase1Result.min}
              currentMax={phase1Result.max}
            />
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="py-6 text-center space-y-4">
            <p className="text-ink font-medium">
              さらに7つの質問に答えると、<span className="text-accent font-bold">±8%</span>の精度でレンジを絞り込めます
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={startPhase2} size="large">
                精緻化する
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="large"
                onClick={() => {
                  // Phase 1だけの結果で簡易的な最終結果を表示
                  const result = calculateFinalResult({
                    ...answers,
                    procedure_skill: "basic",
                    night_shift: "available_minimal",
                    management_exp: "none",
                    special_skills: ["none"],
                    work_days: "5days",
                    patient_following: "minimal",
                    urgency: "soon",
                  });
                  setFinalResult(result);
                  setScreen("final_result");
                }}
              >
                この結果で十分
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================
  // 最終結果画面
  // ============================================================
  if (screen === "final_result" && finalResult) {
    const specialty = answers.specialty as string;
    const specialtyLabel = getSpecialtyLabel(specialty);
    const dist = getDistributionForSpecialty(specialty);

    return (
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="accent" className="text-sm px-4 py-1">
            診断結果
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-ink">
            あなたの市場価値診断結果
          </h2>
        </div>

        {/* Main Result */}
        <Card className="border-accent/30 overflow-hidden">
          <div className="bg-gradient-to-r from-accent/10 to-accent/5 px-6 py-4 border-b border-accent/20">
            <p className="text-sm text-accent font-medium">推定年収レンジ</p>
          </div>
          <CardContent className="py-8 text-center space-y-6">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl md:text-6xl font-bold text-accent">
                {finalResult.range.min.toLocaleString()}
              </span>
              <span className="text-2xl text-ink-muted">〜</span>
              <span className="text-4xl md:text-6xl font-bold text-accent">
                {finalResult.range.max.toLocaleString()}
              </span>
              <span className="text-xl text-ink-muted">万円</span>
            </div>

            {/* Market Position */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
              <Award className="w-5 h-5 text-accent" />
              <span className="font-medium text-ink">
                {specialtyLabel}として<span className="text-accent">{finalResult.position}</span>に位置しています
              </span>
            </div>

            {/* Monthly / Hourly */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="p-3 bg-surface-sunken rounded-lg">
                <p className="text-xs text-ink-muted">月額換算</p>
                <p className="text-lg font-bold text-ink">
                  {finalResult.monthlyEquivalent.toLocaleString()}
                  <span className="text-xs text-ink-muted ml-1">万円</span>
                </p>
              </div>
              <div className="p-3 bg-surface-sunken rounded-lg">
                <p className="text-xs text-ink-muted">時給換算</p>
                <p className="text-lg font-bold text-ink">
                  {Math.round(finalResult.hourlyEquivalent).toLocaleString()}
                  <span className="text-xs text-ink-muted ml-1">円</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribution */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium text-ink mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent" />
              {specialtyLabel}の年収分布上のポジション
            </h3>
            <DistributionBar
              distribution={dist}
              currentMin={finalResult.range.min}
              currentMax={finalResult.range.max}
              midpoint={finalResult.midpoint}
            />
          </CardContent>
        </Card>

        {/* Factor Analysis */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium text-ink mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              要因分析
            </h3>
            <div className="space-y-3">
              {finalResult.factors.map((factor, index) => (
                <FactorRow key={index} factor={factor} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Owner Estimate */}
        {finalResult.ownerEstimate && (
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50">
            <CardContent className="pt-6">
              <h3 className="font-medium text-ink mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                開業した場合の想定年収
              </h3>
              <div className="text-center py-4">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-3xl font-bold text-amber-700">
                    {finalResult.ownerEstimate.min.toLocaleString()}
                  </span>
                  <span className="text-xl text-amber-600/70">〜</span>
                  <span className="text-3xl font-bold text-amber-700">
                    {finalResult.ownerEstimate.max.toLocaleString()}
                  </span>
                  <span className="text-sm text-amber-600/70">万円</span>
                </div>
              </div>
              <p className="text-xs text-amber-700/60 flex items-start gap-1.5 mt-2">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                {finalResult.ownerEstimate.note}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="text-xs text-ink-muted space-y-1 px-4">
          <p>※ 本診断は、厚生労働省「医師の勤務実態調査」、各種求人サイトの公開データ、G.C FACTORYの医療機関M&A・開業支援実績に基づく独自の算出ロジックで算出しています。</p>
          <p>※ 実際の報酬は、個別の交渉・雇用条件・医療機関の経営状況により異なります。</p>
          <p>※ 本診断結果は参考情報であり、特定の報酬を保証するものではありません。</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button onClick={reset} variant="outline">
            もう一度診断する
          </Button>
          <Button onClick={() => {
            if (typeof navigator !== "undefined" && navigator.share) {
              navigator.share({
                title: "ドクター市場価値診断結果",
                text: `私の推定年収レンジは${finalResult.range.min.toLocaleString()}〜${finalResult.range.max.toLocaleString()}万円（${finalResult.position}）でした。`,
                url: window.location.href,
              }).catch(() => {});
            }
          }}>
            <Share2 className="w-4 h-4 mr-2" />
            結果をシェア
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

// ============================================================
// サブコンポーネント: 分布バー
// ============================================================

function DistributionBar({
  distribution,
  currentMin,
  currentMax,
  midpoint,
}: {
  distribution: { p10: number; p25: number; p50: number; p75: number; p90: number };
  currentMin: number;
  currentMax: number;
  midpoint?: number;
}) {
  const absMin = distribution.p10 * 0.8;
  const absMax = distribution.p90 * 1.2;
  const range = absMax - absMin;

  const toPercent = (val: number) => Math.max(0, Math.min(100, ((val - absMin) / range) * 100));

  const percentiles = [
    { label: "P10", value: distribution.p10 },
    { label: "P25", value: distribution.p25 },
    { label: "P50", value: distribution.p50 },
    { label: "P75", value: distribution.p75 },
    { label: "P90", value: distribution.p90 },
  ];

  return (
    <div className="space-y-4">
      <div className="relative h-16">
        {/* Background bar */}
        <div className="absolute top-6 left-0 right-0 h-4 bg-surface-sunken rounded-full" />

        {/* Percentile markers */}
        {percentiles.map((p) => (
          <div
            key={p.label}
            className="absolute top-6 w-0.5 h-4 bg-border"
            style={{ left: `${toPercent(p.value)}%` }}
          >
            <span className="absolute -top-5 -translate-x-1/2 text-[10px] text-ink-muted whitespace-nowrap">
              {p.value.toLocaleString()}
            </span>
            <span className="absolute top-5 -translate-x-1/2 text-[10px] text-ink-muted">
              {p.label}
            </span>
          </div>
        ))}

        {/* Current range highlight */}
        <div
          className="absolute top-6 h-4 bg-accent/30 rounded-full"
          style={{
            left: `${toPercent(currentMin)}%`,
            width: `${toPercent(currentMax) - toPercent(currentMin)}%`,
          }}
        />

        {/* Midpoint marker */}
        {midpoint && (
          <div
            className="absolute top-4 w-3 h-3 bg-accent rounded-full border-2 border-white shadow-md z-10 -translate-x-1/2"
            style={{ left: `${toPercent(midpoint)}%` }}
          />
        )}
      </div>
      <div className="flex justify-between text-xs text-ink-muted">
        <span>低い</span>
        <span>高い</span>
      </div>
    </div>
  );
}

// ============================================================
// サブコンポーネント: 要因行
// ============================================================

function FactorRow({ factor }: { factor: Factor }) {
  const isPositive = factor.impact === "positive";
  const isNegative = factor.impact === "negative";
  const maxAmount = 400;
  const barWidth = Math.min(100, (Math.abs(factor.amount) / maxAmount) * 100);

  return (
    <div className="p-3 bg-surface-sunken rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : isNegative ? (
            <TrendingDown className="w-4 h-4 text-red-500" />
          ) : (
            <Minus className="w-4 h-4 text-ink-muted" />
          )}
          <span className="text-sm font-medium text-ink">{factor.label}</span>
        </div>
        <span
          className={cn(
            "text-sm font-bold",
            isPositive ? "text-green-600" : isNegative ? "text-red-500" : "text-ink-muted"
          )}
        >
          {factor.amount > 0 ? "+" : ""}
          {factor.amount}万円
        </span>
      </div>
      <div className="h-1.5 bg-white rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            isPositive ? "bg-green-500" : isNegative ? "bg-red-400" : "bg-gray-400"
          )}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <p className="text-xs text-ink-muted">{factor.description}</p>
    </div>
  );
}
