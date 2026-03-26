"use client";

import { useState, useMemo, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Wallet,
  PiggyBank,
  Calculator,
  ChevronDown,
  ChevronUp,
  Download,
  RotateCcw,
  Loader2,
} from "lucide-react";
import {
  BusinessPlan,
  DEFAULT_BUSINESS_PLAN,
  SPECIALTY_BENCHMARKS,
  calculatePlan,
  generateAdvice,
  formatCurrency,
} from "@/lib/business-plan";
import { generateBusinessPlanPDFFromElement } from "@/lib/pdf-generator";
import { PDFReport } from "@/components/business-plan/pdf-report";

type TabType = "basic" | "revenue" | "expenses" | "investment" | "result";

const SPECIALTIES = Object.keys(SPECIALTY_BENCHMARKS);

export default function BusinessPlanPage() {
  const [plan, setPlan] = useState<BusinessPlan>(DEFAULT_BUSINESS_PLAN);
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [expandedSections, setExpandedSections] = useState<string[]>(["monthly", "yearly", "investment"]);
  const [isExporting, setIsExporting] = useState(false);
  const pdfReportRef = useRef<HTMLDivElement>(null);

  const calculation = useMemo(() => calculatePlan(plan), [plan]);
  const advice = useMemo(() => generateAdvice(plan, calculation), [plan, calculation]);

  const updateBasic = (field: keyof BusinessPlan["basic"], value: string) => {
    setPlan((prev) => ({
      ...prev,
      basic: { ...prev.basic, [field]: value },
    }));
  };

  const updateRevenue = (field: keyof BusinessPlan["revenue"], value: number) => {
    setPlan((prev) => ({
      ...prev,
      revenue: { ...prev.revenue, [field]: value },
    }));
  };

  const updateExpenses = (field: keyof BusinessPlan["expenses"], value: number) => {
    setPlan((prev) => ({
      ...prev,
      expenses: { ...prev.expenses, [field]: value },
    }));
  };

  const updateStaffing = (field: keyof BusinessPlan["staffing"], value: number) => {
    setPlan((prev) => ({
      ...prev,
      staffing: { ...prev.staffing, [field]: value },
    }));
  };

  const updateInvestment = (field: keyof BusinessPlan["initialInvestment"], value: number) => {
    setPlan((prev) => ({
      ...prev,
      initialInvestment: { ...prev.initialInvestment, [field]: value },
    }));
  };

  const updateFunding = (field: keyof BusinessPlan["funding"], value: number) => {
    setPlan((prev) => ({
      ...prev,
      funding: { ...prev.funding, [field]: value },
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const resetPlan = () => {
    setPlan(DEFAULT_BUSINESS_PLAN);
  };

  const handleExportPDF = async () => {
    if (isExporting) return;

    if (!pdfReportRef.current) {
      console.error("PDF export failed: Report element not found");
      alert("PDF生成に失敗しました。ページを再読み込みしてください。");
      return;
    }

    setIsExporting(true);
    try {
      await generateBusinessPlanPDFFromElement(pdfReportRef.current, plan);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("PDF生成中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setIsExporting(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "basic", label: "基本情報", icon: <Building2 className="w-4 h-4" /> },
    { id: "revenue", label: "収支計画", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "expenses", label: "経費・人員", icon: <Users className="w-4 h-4" /> },
    { id: "investment", label: "投資・資金", icon: <Wallet className="w-4 h-4" /> },
    { id: "result", label: "シミュレーション結果", icon: <Calculator className="w-4 h-4" /> },
  ];

  const getAdviceIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "danger":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getAdviceBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "danger":
        return "bg-red-50 border-red-200";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink font-serif">簡易事業計画</h1>
          <p className="text-ink/60 mt-1">承継・開業に向けた収支シミュレーション</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetPlan}>
            <RotateCcw className="w-4 h-4 mr-2" />
            リセット
          </Button>
          <Button variant="outline" onClick={handleExportPDF} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isExporting ? "生成中..." : "PDF出力"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-ink/60">月間営業利益</p>
          <p className={`text-2xl font-bold font-mono ${calculation.monthly.operatingProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
            {calculation.monthly.operatingProfit >= 0 ? "+" : ""}{formatCurrency(calculation.monthly.operatingProfit)}
            <span className="text-sm font-normal text-ink/60 ml-1">万円</span>
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-ink/60">利益率</p>
          <p className={`text-2xl font-bold font-mono ${calculation.monthly.profitRate >= 20 ? "text-green-600" : calculation.monthly.profitRate >= 10 ? "text-yellow-600" : "text-red-600"}`}>
            {calculation.monthly.profitRate}
            <span className="text-sm font-normal text-ink/60 ml-1">%</span>
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-ink/60">投資回収期間</p>
          <p className={`text-2xl font-bold font-mono ${calculation.investment.paybackYears <= 5 ? "text-green-600" : calculation.investment.paybackYears <= 10 ? "text-yellow-600" : "text-red-600"}`}>
            {calculation.investment.paybackYears >= 99 ? "-" : calculation.investment.paybackYears}
            <span className="text-sm font-normal text-ink/60 ml-1">年</span>
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-ink/60">資金過不足</p>
          <p className={`text-2xl font-bold font-mono ${calculation.investment.fundingGap >= 0 ? "text-green-600" : "text-red-600"}`}>
            {calculation.investment.fundingGap >= 0 ? "+" : ""}{formatCurrency(calculation.investment.fundingGap)}
            <span className="text-sm font-normal text-ink/60 ml-1">万円</span>
          </p>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="md:col-span-2">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-accent text-white"
                    : "bg-white border border-border text-ink/70 hover:border-accent"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <Card className="p-6">
            {activeTab === "basic" && (
              <div className="space-y-4">
                <h3 className="font-bold text-ink mb-4">基本情報</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1">
                      クリニック名
                    </label>
                    <Input
                      value={plan.basic.clinicName}
                      onChange={(e) => updateBasic("clinicName", e.target.value)}
                      placeholder="例：山田内科クリニック"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1">
                      診療科
                    </label>
                    <select
                      value={plan.basic.specialty}
                      onChange={(e) => updateBasic("specialty", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded bg-white text-ink focus:outline-none focus:ring-2 focus:ring-accent/20"
                    >
                      {SPECIALTIES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1">
                      エリア
                    </label>
                    <Input
                      value={plan.basic.area}
                      onChange={(e) => updateBasic("area", e.target.value)}
                      placeholder="例：東京都世田谷区"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1">
                      開業形態
                    </label>
                    <select
                      value={plan.basic.businessType}
                      onChange={(e) => updateBasic("businessType", e.target.value as "succession" | "new")}
                      className="w-full px-3 py-2 border border-border rounded bg-white text-ink focus:outline-none focus:ring-2 focus:ring-accent/20"
                    >
                      <option value="succession">承継開業</option>
                      <option value="new">新規開業</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1">
                      開業予定日
                    </label>
                    <Input
                      type="date"
                      value={plan.basic.openingDate}
                      onChange={(e) => updateBasic("openingDate", e.target.value)}
                    />
                  </div>
                </div>

                {/* Benchmark Info */}
                {plan.basic.specialty && SPECIALTY_BENCHMARKS[plan.basic.specialty] && (
                  <div className="mt-6 p-4 bg-surface rounded border border-border">
                    <p className="text-sm font-medium text-ink mb-2">
                      {plan.basic.specialty}の業界平均
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-ink/60">1日患者数</p>
                        <p className="font-mono font-medium">
                          {SPECIALTY_BENCHMARKS[plan.basic.specialty].avgDailyPatients}名
                        </p>
                      </div>
                      <div>
                        <p className="text-ink/60">患者単価</p>
                        <p className="font-mono font-medium">
                          {formatCurrency(SPECIALTY_BENCHMARKS[plan.basic.specialty].avgRevenuePerPatient)}円
                        </p>
                      </div>
                      <div>
                        <p className="text-ink/60">利益率</p>
                        <p className="font-mono font-medium">
                          {SPECIALTY_BENCHMARKS[plan.basic.specialty].avgProfitRate}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "revenue" && (
              <div className="space-y-4">
                <h3 className="font-bold text-ink mb-4">収入計画</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1">
                      1日の患者数
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={plan.revenue.dailyPatients}
                        onChange={(e) => updateRevenue("dailyPatients", parseInt(e.target.value) || 0)}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">名</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1">
                      保険診療 患者単価
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={plan.revenue.avgRevenuePerPatient}
                        onChange={(e) => updateRevenue("avgRevenuePerPatient", parseInt(e.target.value) || 0)}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">円</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1">
                      月間診療日数
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={plan.revenue.workDaysPerMonth}
                        onChange={(e) => updateRevenue("workDaysPerMonth", parseInt(e.target.value) || 0)}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">日</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1">
                      自費診療比率
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={plan.revenue.selfPayRatio}
                        onChange={(e) => updateRevenue("selfPayRatio", parseInt(e.target.value) || 0)}
                        min={0}
                        max={100}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink/70 mb-1">
                      自費診療 平均単価
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={plan.revenue.selfPayAvgPrice}
                        onChange={(e) => updateRevenue("selfPayAvgPrice", parseInt(e.target.value) || 0)}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">円</span>
                    </div>
                  </div>
                </div>

                {/* Revenue Preview */}
                <div className="mt-6 p-4 bg-surface rounded border border-border">
                  <p className="text-sm font-medium text-ink mb-3">月間収入見込み</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-ink/60">保険診療収入</span>
                      <span className="font-mono">{formatCurrency(calculation.monthly.insuranceRevenue)}万円</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-ink/60">自費診療収入</span>
                      <span className="font-mono">{formatCurrency(calculation.monthly.selfPayRevenue)}万円</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between font-medium">
                      <span>合計</span>
                      <span className="font-mono text-accent">{formatCurrency(calculation.monthly.totalRevenue)}万円</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "expenses" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-ink mb-4">月間経費</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">家賃</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.expenses.rent}
                          onChange={(e) => updateExpenses("rent", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円/月</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">人件費</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.expenses.staffCost}
                          onChange={(e) => updateExpenses("staffCost", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円/月</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">光熱費</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.expenses.utilities}
                          onChange={(e) => updateExpenses("utilities", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円/月</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">医薬品・消耗品</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.expenses.supplies}
                          onChange={(e) => updateExpenses("supplies", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円/月</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">機器リース・保守</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.expenses.equipment}
                          onChange={(e) => updateExpenses("equipment", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円/月</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">広告宣伝費</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.expenses.marketing}
                          onChange={(e) => updateExpenses("marketing", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円/月</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">ローン返済</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.expenses.loan}
                          onChange={(e) => updateExpenses("loan", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円/月</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">その他経費</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.expenses.other}
                          onChange={(e) => updateExpenses("other", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円/月</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-bold text-ink mb-4">人員計画</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">医師</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.staffing.doctors}
                          onChange={(e) => updateStaffing("doctors", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">名</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">看護師</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.staffing.nurses}
                          onChange={(e) => updateStaffing("nurses", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">名</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">事務</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.staffing.clerks}
                          onChange={(e) => updateStaffing("clerks", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">名</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">その他</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.staffing.others}
                          onChange={(e) => updateStaffing("others", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">名</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expenses Preview */}
                <div className="mt-4 p-4 bg-surface rounded border border-border">
                  <p className="text-sm font-medium text-ink mb-2">月間経費合計</p>
                  <p className="text-2xl font-bold font-mono text-ink">
                    {formatCurrency(calculation.monthly.totalExpenses)}
                    <span className="text-sm font-normal text-ink/60 ml-1">万円/月</span>
                  </p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-ink/60">
                      人件費率: <span className="font-mono">{calculation.metrics.laborCostRatio}%</span>
                    </span>
                    <span className="text-ink/60">
                      家賃比率: <span className="font-mono">{calculation.metrics.rentRatio}%</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "investment" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-ink mb-4">初期投資</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">
                        {plan.basic.businessType === "succession" ? "承継価格" : "開業費用"}
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.initialInvestment.transferPrice}
                          onChange={(e) => updateInvestment("transferPrice", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">内装工事</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.initialInvestment.renovation}
                          onChange={(e) => updateInvestment("renovation", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">医療機器</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.initialInvestment.equipment}
                          onChange={(e) => updateInvestment("equipment", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">敷金・保証金</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.initialInvestment.deposit}
                          onChange={(e) => updateInvestment("deposit", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">運転資金</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.initialInvestment.workingCapital}
                          onChange={(e) => updateInvestment("workingCapital", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">その他</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.initialInvestment.other}
                          onChange={(e) => updateInvestment("other", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-surface rounded border border-border flex justify-between items-center">
                    <span className="font-medium">初期投資合計</span>
                    <span className="text-xl font-bold font-mono">{formatCurrency(calculation.investment.totalInvestment)}万円</span>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-bold text-ink mb-4">資金調達</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">自己資金</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.funding.ownCapital}
                          onChange={(e) => updateFunding("ownCapital", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">銀行融資</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.funding.bankLoan}
                          onChange={(e) => updateFunding("bankLoan", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">公的融資（日本政策金融公庫等）</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.funding.publicLoan}
                          onChange={(e) => updateFunding("publicLoan", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-1">その他</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plan.funding.other}
                          onChange={(e) => updateFunding("other", parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">万円</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-surface rounded border border-border flex justify-between items-center">
                    <span className="font-medium">調達合計</span>
                    <span className="text-xl font-bold font-mono">{formatCurrency(calculation.investment.totalFunding)}万円</span>
                  </div>

                  {/* Funding Gap */}
                  <div className={`mt-4 p-4 rounded border ${calculation.investment.fundingGap >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <div className="flex items-center gap-2">
                      {calculation.investment.fundingGap >= 0 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium">
                        {calculation.investment.fundingGap >= 0
                          ? `${formatCurrency(calculation.investment.fundingGap)}万円の余裕があります`
                          : `${formatCurrency(Math.abs(calculation.investment.fundingGap))}万円の資金不足です`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "result" && (
              <div className="space-y-4">
                {/* Monthly */}
                <div className="border border-border rounded">
                  <button
                    onClick={() => toggleSection("monthly")}
                    className="w-full flex items-center justify-between p-4 hover:bg-surface/50"
                  >
                    <span className="font-bold text-ink">月間収支</span>
                    {expandedSections.includes("monthly") ? (
                      <ChevronUp className="w-5 h-5 text-ink/50" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-ink/50" />
                    )}
                  </button>
                  {expandedSections.includes("monthly") && (
                    <div className="p-4 border-t border-border space-y-3">
                      <div className="flex justify-between">
                        <span className="text-ink/60">保険診療収入</span>
                        <span className="font-mono">{formatCurrency(calculation.monthly.insuranceRevenue)}万円</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink/60">自費診療収入</span>
                        <span className="font-mono">{formatCurrency(calculation.monthly.selfPayRevenue)}万円</span>
                      </div>
                      <div className="flex justify-between font-medium border-t border-border pt-2">
                        <span>総収入</span>
                        <span className="font-mono">{formatCurrency(calculation.monthly.totalRevenue)}万円</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink/60">総経費</span>
                        <span className="font-mono">-{formatCurrency(calculation.monthly.totalExpenses)}万円</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-border pt-2">
                        <span>営業利益</span>
                        <span className={`font-mono ${calculation.monthly.operatingProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {calculation.monthly.operatingProfit >= 0 ? "+" : ""}{formatCurrency(calculation.monthly.operatingProfit)}万円
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink/60">利益率</span>
                        <span className="font-mono">{calculation.monthly.profitRate}%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Yearly */}
                <div className="border border-border rounded">
                  <button
                    onClick={() => toggleSection("yearly")}
                    className="w-full flex items-center justify-between p-4 hover:bg-surface/50"
                  >
                    <span className="font-bold text-ink">年間収支</span>
                    {expandedSections.includes("yearly") ? (
                      <ChevronUp className="w-5 h-5 text-ink/50" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-ink/50" />
                    )}
                  </button>
                  {expandedSections.includes("yearly") && (
                    <div className="p-4 border-t border-border space-y-3">
                      <div className="flex justify-between">
                        <span className="text-ink/60">年間総収入</span>
                        <span className="font-mono">{formatCurrency(calculation.yearly.totalRevenue)}万円</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink/60">年間総経費</span>
                        <span className="font-mono">-{formatCurrency(calculation.yearly.totalExpenses)}万円</span>
                      </div>
                      <div className="flex justify-between font-medium border-t border-border pt-2">
                        <span>年間営業利益</span>
                        <span className="font-mono">{formatCurrency(calculation.yearly.operatingProfit)}万円</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink/60">概算税金（30%）</span>
                        <span className="font-mono">-{formatCurrency(calculation.yearly.estimatedTax)}万円</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-border pt-2">
                        <span>税引後利益</span>
                        <span className={`font-mono ${calculation.yearly.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(calculation.yearly.netProfit)}万円
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Investment */}
                <div className="border border-border rounded">
                  <button
                    onClick={() => toggleSection("investment")}
                    className="w-full flex items-center justify-between p-4 hover:bg-surface/50"
                  >
                    <span className="font-bold text-ink">投資分析</span>
                    {expandedSections.includes("investment") ? (
                      <ChevronUp className="w-5 h-5 text-ink/50" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-ink/50" />
                    )}
                  </button>
                  {expandedSections.includes("investment") && (
                    <div className="p-4 border-t border-border space-y-3">
                      <div className="flex justify-between">
                        <span className="text-ink/60">総投資額</span>
                        <span className="font-mono">{formatCurrency(calculation.investment.totalInvestment)}万円</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink/60">調達額</span>
                        <span className="font-mono">{formatCurrency(calculation.investment.totalFunding)}万円</span>
                      </div>
                      <div className="flex justify-between font-medium border-t border-border pt-2">
                        <span>資金過不足</span>
                        <span className={`font-mono ${calculation.investment.fundingGap >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {calculation.investment.fundingGap >= 0 ? "+" : ""}{formatCurrency(calculation.investment.fundingGap)}万円
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink/60">投資回収期間</span>
                        <span className="font-mono">
                          {calculation.investment.paybackYears >= 99 ? "回収困難" : `約${calculation.investment.paybackYears}年`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink/60">損益分岐患者数</span>
                        <span className="font-mono">{calculation.investment.breakEvenPatients}名/日</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink/60">月間損益分岐売上</span>
                        <span className="font-mono">{formatCurrency(calculation.metrics.monthlyBreakEven)}万円</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Advice Panel */}
        <div>
          <Card className="p-4 sticky top-4">
            <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-accent" />
              診断結果
            </h3>
            <div className="space-y-3">
              {advice.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border ${getAdviceBgColor(item.type)}`}
                >
                  <div className="flex items-start gap-2">
                    {getAdviceIcon(item.type)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-sm text-ink/60 mt-1">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-ink/70 mb-3">経営指標</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink/60">人件費率</span>
                  <span className={`font-mono ${calculation.metrics.laborCostRatio > 50 ? "text-red-600" : calculation.metrics.laborCostRatio > 40 ? "text-yellow-600" : "text-green-600"}`}>
                    {calculation.metrics.laborCostRatio}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">家賃比率</span>
                  <span className={`font-mono ${calculation.metrics.rentRatio > 15 ? "text-yellow-600" : "text-green-600"}`}>
                    {calculation.metrics.rentRatio}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">月間損益分岐</span>
                  <span className="font-mono">{formatCurrency(calculation.metrics.monthlyBreakEven)}万円</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Hidden PDF Report for Export */}
      <div
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "210mm",
          zIndex: -9999,
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <PDFReport
          ref={pdfReportRef}
          plan={plan}
          calculation={calculation}
          advice={advice}
        />
      </div>
    </div>
  );
}
