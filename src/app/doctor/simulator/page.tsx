"use client";

import * as React from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  TrendingUp,
  PiggyBank,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Wallet,
  CreditCard,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import {
  runSimulation,
  formatCurrency,
  type SimulatorInput,
  type SimulatorResult,
} from "@/lib/simulator";
import { cn } from "@/lib/utils";

const DEFAULT_INPUT: SimulatorInput = {
  currentSavings: 500,
  currentAge: 35,
  annualSalary: 2000,
  workYears: 3,
  annualSavingsRate: 30,
  transferPrice: 8000,
  downPaymentRate: 20,
  loanInterestRate: 2.5,
  loanYears: 15,
  expectedAnnualRevenue: 12000,
  expectedProfitRate: 25,
};

export default function SimulatorPage() {
  const [input, setInput] = React.useState<SimulatorInput>(DEFAULT_INPUT);
  const [result, setResult] = React.useState<SimulatorResult | null>(null);
  const [activeTab, setActiveTab] = React.useState<"input" | "result">("input");

  const handleInputChange = (field: keyof SimulatorInput, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInput((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleSimulate = () => {
    const simulationResult = runSimulation(input);
    setResult(simulationResult);
    setActiveTab("result");
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setResult(null);
    setActiveTab("input");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="承継シミュレーター"
        description="いつ・いくらで承継できるかをシミュレーションします"
      />

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("input")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "input"
              ? "bg-accent text-white"
              : "bg-surface-sunken text-ink-muted hover:text-ink"
          )}
        >
          <Calculator className="w-4 h-4 inline-block mr-2" />
          条件入力
        </button>
        <button
          onClick={() => setActiveTab("result")}
          disabled={!result}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "result"
              ? "bg-accent text-white"
              : "bg-surface-sunken text-ink-muted hover:text-ink",
            !result && "opacity-50 cursor-not-allowed"
          )}
        >
          <BarChart3 className="w-4 h-4 inline-block mr-2" />
          シミュレーション結果
        </button>
      </div>

      {activeTab === "input" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 現在の状況 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="w-5 h-5 text-accent" />
                現在の状況
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-ink-muted block mb-1">
                  現在の年齢
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={input.currentAge}
                    onChange={(e) => handleInputChange("currentAge", e.target.value)}
                    className="w-24"
                  />
                  <span className="text-ink-muted">歳</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-ink-muted block mb-1">
                  現在の貯蓄額
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={input.currentSavings}
                    onChange={(e) => handleInputChange("currentSavings", e.target.value)}
                    className="w-32"
                  />
                  <span className="text-ink-muted">万円</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 勤務期間の条件 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-accent" />
                勤務期間の条件
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-ink-muted block mb-1">
                  年収
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={input.annualSalary}
                    onChange={(e) => handleInputChange("annualSalary", e.target.value)}
                    className="w-32"
                  />
                  <span className="text-ink-muted">万円</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-ink-muted block mb-1">
                  勤務予定年数
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={input.workYears}
                    onChange={(e) => handleInputChange("workYears", e.target.value)}
                    className="w-24"
                  />
                  <span className="text-ink-muted">年</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-ink-muted block mb-1">
                  年間貯蓄率
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={input.annualSavingsRate}
                    onChange={(e) => handleInputChange("annualSavingsRate", e.target.value)}
                    className="w-24"
                  />
                  <span className="text-ink-muted">%</span>
                  <span className="text-xs text-ink-muted">
                    （年間 {formatCurrency(input.annualSalary * input.annualSavingsRate / 100)}万円）
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 承継条件 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="w-5 h-5 text-accent" />
                承継条件
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-ink-muted block mb-1">
                  承継価格
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={input.transferPrice}
                    onChange={(e) => handleInputChange("transferPrice", e.target.value)}
                    className="w-32"
                  />
                  <span className="text-ink-muted">万円</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-ink-muted block mb-1">
                  頭金比率
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={input.downPaymentRate}
                    onChange={(e) => handleInputChange("downPaymentRate", e.target.value)}
                    className="w-24"
                  />
                  <span className="text-ink-muted">%</span>
                  <span className="text-xs text-ink-muted">
                    （{formatCurrency(input.transferPrice * input.downPaymentRate / 100)}万円）
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ローン条件 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-accent" />
                ローン条件
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-ink-muted block mb-1">
                  金利（年利）
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={input.loanInterestRate}
                    onChange={(e) => handleInputChange("loanInterestRate", e.target.value)}
                    className="w-24"
                  />
                  <span className="text-ink-muted">%</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-ink-muted block mb-1">
                  返済年数
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={input.loanYears}
                    onChange={(e) => handleInputChange("loanYears", e.target.value)}
                    className="w-24"
                  />
                  <span className="text-ink-muted">年</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 承継後の収入 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PiggyBank className="w-5 h-5 text-accent" />
                承継後の予想収入
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-ink-muted block mb-1">
                    年間売上見込み
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={input.expectedAnnualRevenue}
                      onChange={(e) => handleInputChange("expectedAnnualRevenue", e.target.value)}
                      className="w-32"
                    />
                    <span className="text-ink-muted">万円</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-ink-muted block mb-1">
                    利益率
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={input.expectedProfitRate}
                      onChange={(e) => handleInputChange("expectedProfitRate", e.target.value)}
                      className="w-24"
                    />
                    <span className="text-ink-muted">%</span>
                    <span className="text-xs text-ink-muted">
                      （年間利益 {formatCurrency(input.expectedAnnualRevenue * input.expectedProfitRate / 100)}万円）
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* シミュレーションボタン */}
          <div className="lg:col-span-2 flex gap-4">
            <Button onClick={handleSimulate} size="large" className="flex-1">
              <Calculator className="w-5 h-5 mr-2" />
              シミュレーション実行
            </Button>
            <Button onClick={handleReset} variant="outline" size="large">
              リセット
            </Button>
          </div>
        </div>
      )}

      {activeTab === "result" && result && (
        <SimulationResult input={input} result={result} onBack={() => setActiveTab("input")} />
      )}
    </div>
  );
}

interface SimulationResultProps {
  input: SimulatorInput;
  result: SimulatorResult;
  onBack: () => void;
}

function SimulationResult({ input, result, onBack }: SimulationResultProps) {
  const { summary, yearlyProjection, postTransfer, advice } = result;

  // Find max savings for chart scaling
  const maxSavings = Math.max(
    ...yearlyProjection.map((d) => Math.max(d.savingsEnd, d.cumulativeProfit || 0))
  );

  return (
    <div className="space-y-6">
      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={summary.canAfford ? "border-success/30" : "border-error/30"}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              {summary.canAfford ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <AlertCircle className="w-5 h-5 text-error" />
              )}
              <span className="text-sm text-ink-muted">実現可能性</span>
            </div>
            <p className={cn("text-2xl font-bold", summary.canAfford ? "text-success" : "text-error")}>
              {summary.canAfford ? "実現可能" : "要検討"}
            </p>
            {!summary.canAfford && (
              <p className="text-sm text-error mt-1">
                {formatCurrency(summary.shortfall)}万円 不足
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-ink-muted mb-2">承継時の貯蓄額</p>
            <p className="text-2xl font-bold text-ink">
              {formatCurrency(summary.totalSavingsAtTransfer)}
              <span className="text-base font-normal text-ink-muted">万円</span>
            </p>
            <p className="text-xs text-ink-muted mt-1">
              {input.workYears}年後（{summary.ageAtTransfer}歳時点）
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-ink-muted mb-2">月々の返済額</p>
            <p className="text-2xl font-bold text-ink">
              {formatCurrency(summary.monthlyLoanPayment)}
              <span className="text-base font-normal text-ink-muted">万円</span>
            </p>
            <p className="text-xs text-ink-muted mt-1">
              {input.loanYears}年間（{summary.ageAtLoanComplete}歳で完済）
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-ink-muted mb-2">承継後の月収</p>
            <p className={cn(
              "text-2xl font-bold",
              postTransfer.monthlyNetIncome >= 100 ? "text-success" : "text-warning"
            )}>
              {formatCurrency(postTransfer.monthlyNetIncome)}
              <span className="text-base font-normal text-ink-muted">万円</span>
            </p>
            <p className="text-xs text-ink-muted mt-1">
              年収 {formatCurrency(postTransfer.annualNetIncome)}万円
            </p>
          </CardContent>
        </Card>
      </div>

      {/* タイムライン */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            資産推移タイムライン
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {yearlyProjection.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                {/* Year label */}
                <div className="w-20 flex-shrink-0 text-right">
                  <p className="text-sm font-medium">{data.age}歳</p>
                  <p className="text-xs text-ink-muted">
                    {data.phase === "working" && `${data.year}年目`}
                    {data.phase === "transfer" && "承継"}
                    {data.phase === "post-transfer" && `承継+${data.year - input.workYears - 1}年`}
                  </p>
                </div>

                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      data.phase === "working" && "bg-accent",
                      data.phase === "transfer" && "bg-warning",
                      data.phase === "post-transfer" && "bg-success"
                    )}
                  />
                  {index < yearlyProjection.length - 1 && (
                    <div className="w-0.5 h-8 bg-border" />
                  )}
                </div>

                {/* Bar and value */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-6 bg-surface-sunken rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          data.phase === "working" && "bg-accent",
                          data.phase === "transfer" && "bg-warning",
                          data.phase === "post-transfer" && "bg-success"
                        )}
                        style={{
                          width: `${Math.max(5, ((data.phase === "post-transfer" ? data.cumulativeProfit || 0 : data.savingsEnd) / maxSavings) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="w-24 text-right text-sm font-medium">
                      {formatCurrency(data.phase === "post-transfer" ? data.cumulativeProfit || 0 : data.savingsEnd)}万円
                    </span>
                  </div>
                  {data.phase === "post-transfer" && data.loanBalance !== undefined && (
                    <p className="text-xs text-ink-muted mt-1">
                      ローン残高: {formatCurrency(data.loanBalance)}万円
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 承継後の月次収支 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            承継後の月次収支
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-ink-muted">月間売上</span>
              <span className="text-lg font-medium">{formatCurrency(postTransfer.monthlyRevenue)}万円</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-ink-muted">月間利益（経費控除後）</span>
              <span className="text-lg font-medium">{formatCurrency(postTransfer.monthlyProfit)}万円</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-ink-muted">ローン返済</span>
              <span className="text-lg font-medium text-error">-{formatCurrency(postTransfer.monthlyLoanPayment)}万円</span>
            </div>
            <div className="flex items-center justify-between py-3 bg-surface-sunken rounded-lg px-4 -mx-4">
              <span className="font-medium">手取り収入</span>
              <span className={cn(
                "text-xl font-bold",
                postTransfer.monthlyNetIncome >= 100 ? "text-success" : "text-warning"
              )}>
                {formatCurrency(postTransfer.monthlyNetIncome)}万円
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* アドバイス */}
      {advice.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-warning" />
              アドバイス
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {advice.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-ink-muted">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 戻るボタン */}
      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline" size="large">
          条件を変更する
        </Button>
      </div>
    </div>
  );
}
