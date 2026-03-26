"use client";

import * as React from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Target,
  Zap,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Users,
  DollarSign,
  Gift,
  Clock,
  ArrowUp,
  ArrowDown,
  Info,
} from "lucide-react";
import {
  MY_JOB_POSTING,
  COMPETITOR_JOBS,
  MARKET_BENCHMARK,
  calculateCompetitiveScore,
  generateSuggestions,
  getSalaryDistribution,
  getBenefitsComparison,
} from "@/lib/competitive-analysis";
import { cn } from "@/lib/utils";

export default function CompetitiveAnalysisPage() {
  const competitiveScore = calculateCompetitiveScore(
    MY_JOB_POSTING,
    COMPETITOR_JOBS,
    MARKET_BENCHMARK
  );
  const suggestions = generateSuggestions(
    MY_JOB_POSTING,
    COMPETITOR_JOBS,
    MARKET_BENCHMARK
  );
  const salaryDistribution = getSalaryDistribution(MY_JOB_POSTING, COMPETITOR_JOBS);
  const benefitsComparison = getBenefitsComparison(MY_JOB_POSTING, COMPETITOR_JOBS);

  return (
    <div className="space-y-6">
      <PageHeader
        title="採用競合分析"
        description="同エリア・同診療科の競合と比較して、あなたの求人の競争力を分析します"
      />

      {/* Current Job Info */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-ink-muted mb-1">分析対象の求人</p>
              <h3 className="text-lg font-bold text-ink">{MY_JOB_POSTING.title}</h3>
              <p className="text-sm text-ink-muted mt-1">
                {MY_JOB_POSTING.area} / {MY_JOB_POSTING.specialty} / {MY_JOB_POSTING.salaryMin}〜{MY_JOB_POSTING.salaryMax}万円
              </p>
            </div>
            <Badge variant="outline" className="text-accent border-accent">
              {COMPETITOR_JOBS.length}件の競合求人と比較
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1">
          <CardContent className="pt-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-surface-sunken"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${competitiveScore.overall * 3.52} 352`}
                  strokeLinecap="round"
                  className={cn(
                    competitiveScore.overall >= 70 ? "text-success" :
                    competitiveScore.overall >= 50 ? "text-warning" : "text-error"
                  )}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-3xl font-bold text-ink">{competitiveScore.overall}</p>
                  <p className="text-xs text-ink-muted">/ 100</p>
                </div>
              </div>
            </div>
            <p className="font-medium text-ink">総合競争力スコア</p>
            <p className="text-sm text-ink-muted mt-1">
              エリア内 {competitiveScore.ranking.position}位 / {competitiveScore.ranking.total}件
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ScoreItem
                label="給与"
                score={competitiveScore.salary}
                icon={DollarSign}
                description="市場中央値との比較"
              />
              <ScoreItem
                label="福利厚生"
                score={competitiveScore.benefits}
                icon={Gift}
                description="標準的な福利厚生の充足度"
              />
              <ScoreItem
                label="条件"
                score={competitiveScore.conditions}
                icon={Target}
                description="承継条件・勤務条件"
              />
              <ScoreItem
                label="掲載鮮度"
                score={competitiveScore.timing}
                icon={Clock}
                description="求人の新しさ"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Position */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            市場ポジション
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-surface-sunken rounded-xl">
              <p className="text-4xl font-bold text-accent mb-1">
                上位 {competitiveScore.ranking.percentile}%
              </p>
              <p className="text-sm text-ink-muted">給与水準のランキング</p>
            </div>
            <div className="text-center p-4 bg-surface-sunken rounded-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <p className="text-4xl font-bold text-ink">{MY_JOB_POSTING.applicationCount}</p>
                <span className="text-sm text-ink-muted">件</span>
              </div>
              <p className="text-sm text-ink-muted">応募数</p>
              <p className="text-xs text-ink-muted mt-1">
                市場平均: {MARKET_BENCHMARK.avgApplicationsPerJob}件
              </p>
            </div>
            <div className="text-center p-4 bg-surface-sunken rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-6 h-6 text-success" />
                <p className="text-lg font-bold text-success">需要増加中</p>
              </div>
              <p className="text-sm text-ink-muted">{MY_JOB_POSTING.specialty}医師の市場動向</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            給与比較
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Market Percentiles */}
            <div className="mb-6 p-4 bg-surface-sunken rounded-lg">
              <p className="text-sm font-medium text-ink mb-3">市場給与分布（{MARKET_BENCHMARK.area}・{MARKET_BENCHMARK.specialty}）</p>
              <div className="relative h-8 bg-white rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1/4 bg-gray-200" />
                <div className="absolute inset-y-0 left-1/4 w-1/4 bg-blue-200" />
                <div className="absolute inset-y-0 left-1/2 w-1/4 bg-blue-300" />
                <div className="absolute inset-y-0 left-3/4 w-1/4 bg-blue-400" />
                {/* My position marker */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-accent"
                  style={{
                    left: `${Math.min(100, Math.max(0, ((MY_JOB_POSTING.salaryMin + MY_JOB_POSTING.salaryMax) / 2 - 1500) / 15))}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-ink-muted mt-2">
                <span>25%: {MARKET_BENCHMARK.salaryPercentiles.p25}万</span>
                <span>50%: {MARKET_BENCHMARK.salaryPercentiles.p50}万</span>
                <span>75%: {MARKET_BENCHMARK.salaryPercentiles.p75}万</span>
                <span>90%: {MARKET_BENCHMARK.salaryPercentiles.p90}万</span>
              </div>
            </div>

            {/* Competitor Comparison */}
            <p className="text-sm font-medium text-ink mb-2">競合との比較</p>
            {salaryDistribution.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg",
                  item.isMe ? "bg-accent/10 border border-accent/30" : "bg-surface-sunken"
                )}
              >
                <div className="w-8 text-center">
                  <span className={cn(
                    "text-lg font-bold",
                    index === 0 ? "text-warning" : "text-ink-muted"
                  )}>
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={cn(
                      "font-medium",
                      item.isMe ? "text-accent" : "text-ink"
                    )}>
                      {item.name}
                    </p>
                    {item.isMe && (
                      <Badge className="bg-accent text-white text-xs">あなた</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-ink">
                    {item.min}〜{item.max}万円
                  </p>
                  <p className="text-xs text-ink-muted">
                    平均 {Math.round((item.min + item.max) / 2)}万円
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefits Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-accent" />
            福利厚生・条件の比較
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-ink-muted">福利厚生・条件</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-ink-muted">あなたの求人</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-ink-muted">競合の採用率</th>
                </tr>
              </thead>
              <tbody>
                {benefitsComparison.map((item, index) => (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-sm text-ink">{item.benefit}</td>
                    <td className="py-3 px-4 text-center">
                      {item.myJob ? (
                        <Check className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-error mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-surface-sunken rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-ink-muted w-12 text-right">
                          {item.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Improvement Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-warning" />
            改善提案
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={cn(
                  "p-4 rounded-lg border",
                  suggestion.impact === "high" && "border-error/30 bg-error/5",
                  suggestion.impact === "medium" && "border-warning/30 bg-warning/5",
                  suggestion.impact === "low" && "border-border bg-surface-sunken"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className={cn(
                          "text-xs",
                          suggestion.impact === "high" && "bg-error text-white",
                          suggestion.impact === "medium" && "bg-warning text-white",
                          suggestion.impact === "low" && "bg-gray-500 text-white"
                        )}
                      >
                        {suggestion.impact === "high" && "効果 大"}
                        {suggestion.impact === "medium" && "効果 中"}
                        {suggestion.impact === "low" && "効果 小"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.category === "salary" && "給与"}
                        {suggestion.category === "benefits" && "福利厚生"}
                        {suggestion.category === "conditions" && "条件"}
                        {suggestion.category === "description" && "求人文"}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-ink mb-1">{suggestion.title}</h4>
                    <p className="text-sm text-ink-muted">{suggestion.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-success">
                      <ArrowUp className="w-4 h-4" />
                      <span className="text-sm font-medium">{suggestion.estimatedEffect}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-ink">改善効果の試算について</p>
                <p className="text-sm text-ink-muted mt-1">
                  効果の数値は、同エリア・同診療科の過去の求人データに基づく推定値です。
                  実際の効果は、市場状況やその他の要因により異なる場合があります。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-ink mb-4">
              改善提案を反映して、求人の競争力を高めましょう
            </p>
            <div className="flex gap-3 justify-center">
              <Button>
                <Zap className="w-4 h-4 mr-2" />
                求人を編集する
              </Button>
              <Button variant="outline">
                詳細レポートをダウンロード
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ScoreItemProps {
  label: string;
  score: number;
  icon: React.ElementType;
  description: string;
}

function ScoreItem({ label, score, icon: Icon, description }: ScoreItemProps) {
  return (
    <div className="text-center p-4 bg-surface-sunken rounded-xl">
      <Icon className="w-6 h-6 text-accent mx-auto mb-2" />
      <p className="text-2xl font-bold text-ink mb-1">{score}</p>
      <p className="text-sm font-medium text-ink">{label}</p>
      <p className="text-xs text-ink-muted mt-1">{description}</p>
    </div>
  );
}
