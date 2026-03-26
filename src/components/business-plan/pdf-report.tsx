"use client";

import { forwardRef } from "react";
import { BusinessPlan, PlanCalculation, PlanAdvice, formatCurrency, SPECIALTY_BENCHMARKS } from "@/lib/business-plan";

interface PDFReportProps {
  plan: BusinessPlan;
  calculation: PlanCalculation;
  advice: PlanAdvice[];
}

export const PDFReport = forwardRef<HTMLDivElement, PDFReportProps>(
  ({ plan, calculation, advice }, ref) => {
    const today = new Date().toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const benchmark = SPECIALTY_BENCHMARKS[plan.basic.specialty];

    // 経費の内訳データ
    const expenseItems = [
      { label: "家賃", value: plan.expenses.rent, color: "#3B82F6" },
      { label: "人件費", value: plan.expenses.staffCost, color: "#10B981" },
      { label: "光熱費", value: plan.expenses.utilities, color: "#F59E0B" },
      { label: "医薬品", value: plan.expenses.supplies, color: "#EF4444" },
      { label: "機器", value: plan.expenses.equipment, color: "#8B5CF6" },
      { label: "広告", value: plan.expenses.marketing, color: "#EC4899" },
      { label: "ローン", value: plan.expenses.loan, color: "#6366F1" },
      { label: "その他", value: plan.expenses.other, color: "#64748B" },
    ];

    const totalExpense = expenseItems.reduce((sum, item) => sum + item.value, 0);

    // 資金調達内訳
    const fundingItems = [
      { label: "自己資金", value: plan.funding.ownCapital, color: "#10B981" },
      { label: "銀行融資", value: plan.funding.bankLoan, color: "#3B82F6" },
      { label: "公的融資", value: plan.funding.publicLoan, color: "#8B5CF6" },
      { label: "その他", value: plan.funding.other, color: "#64748B" },
    ];

    const getAdviceIcon = (type: string) => {
      switch (type) {
        case "success":
          return "✓";
        case "warning":
          return "!";
        case "danger":
          return "×";
        default:
          return "•";
      }
    };

    const getAdviceStyle = (type: string) => {
      switch (type) {
        case "success":
          return { bg: "#ECFDF5", border: "#10B981", text: "#047857", iconBg: "#D1FAE5" };
        case "warning":
          return { bg: "#FFFBEB", border: "#F59E0B", text: "#B45309", iconBg: "#FEF3C7" };
        case "danger":
          return { bg: "#FEF2F2", border: "#EF4444", text: "#B91C1C", iconBg: "#FEE2E2" };
        default:
          return { bg: "#F5F5F5", border: "#999", text: "#333", iconBg: "#E5E5E5" };
      }
    };

    return (
      <div
        ref={ref}
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "15mm",
          backgroundColor: "#FFFFFF",
          fontFamily: "sans-serif",
          fontSize: "10pt",
          color: "#111111",
          lineHeight: 1.6,
          boxSizing: "border-box",
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            backgroundColor: "#1E3A5F",
            margin: "-15mm -15mm 20px -15mm",
            padding: "20px 15mm",
            color: "#FFFFFF",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 style={{ fontSize: "24pt", fontWeight: "bold", margin: 0 }}>
                事業計画書
              </h1>
              <p style={{ fontSize: "11pt", margin: "8px 0 0 0", opacity: 0.9 }}>
                {plan.basic.clinicName || "クリニック名未設定"} | {plan.basic.specialty}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "10pt", margin: 0 }}>作成日: {today}</p>
              <p style={{ fontSize: "9pt", margin: "4px 0 0 0", opacity: 0.8 }}>
                Dr.option
              </p>
            </div>
          </div>
        </div>

        {/* サマリーカード */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          {[
            {
              label: "月間営業利益",
              value: `${calculation.monthly.operatingProfit >= 0 ? "+" : ""}${formatCurrency(calculation.monthly.operatingProfit)}万円`,
              color: calculation.monthly.operatingProfit >= 0 ? "#059669" : "#DC2626",
            },
            {
              label: "利益率",
              value: `${calculation.monthly.profitRate}%`,
              color: calculation.monthly.profitRate >= 20 ? "#059669" : calculation.monthly.profitRate >= 10 ? "#D97706" : "#DC2626",
            },
            {
              label: "投資回収期間",
              value: calculation.investment.paybackYears >= 99 ? "回収困難" : `約${calculation.investment.paybackYears}年`,
              color: calculation.investment.paybackYears <= 5 ? "#059669" : calculation.investment.paybackYears <= 10 ? "#D97706" : "#DC2626",
            },
            {
              label: "資金過不足",
              value: `${calculation.investment.fundingGap >= 0 ? "+" : ""}${formatCurrency(calculation.investment.fundingGap)}万円`,
              color: calculation.investment.fundingGap >= 0 ? "#059669" : "#DC2626",
            },
          ].map((card, index) => (
            <div
              key={index}
              style={{
                padding: "12px",
                backgroundColor: "#F8FAFC",
                borderRadius: "6px",
                border: "1px solid #E2E8F0",
              }}
            >
              <p style={{ fontSize: "9pt", color: "#64748B", margin: 0 }}>{card.label}</p>
              <p style={{ fontSize: "16pt", fontWeight: "bold", color: card.color, margin: "4px 0 0 0" }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* 基本情報 */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", borderBottom: "2px solid #1E3A5F", paddingBottom: "8px", marginBottom: "12px" }}>
            基本情報
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["クリニック名", plan.basic.clinicName || "-"],
                ["診療科", plan.basic.specialty],
                ["エリア", plan.basic.area || "-"],
                ["開業形態", plan.basic.businessType === "succession" ? "承継開業" : "新規開業"],
                ["開業予定日", plan.basic.openingDate || "-"],
              ].map(([label, value], index) => (
                <tr key={index} style={{ borderBottom: "1px solid #E2E8F0" }}>
                  <td style={{ padding: "8px 12px", width: "140px", color: "#64748B", fontWeight: 500 }}>{label}</td>
                  <td style={{ padding: "8px 12px" }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 収支グラフ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          {/* 月間収入内訳 */}
          <div>
            <h2 style={{ fontSize: "14pt", fontWeight: "bold", borderBottom: "2px solid #1E3A5F", paddingBottom: "8px", marginBottom: "12px" }}>
              月間収入内訳
            </h2>
            <div style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "9pt" }}>保険診療</span>
                <span style={{ fontSize: "9pt", fontWeight: "bold" }}>{formatCurrency(calculation.monthly.insuranceRevenue)}万円</span>
              </div>
              <div style={{ height: "20px", backgroundColor: "#E2E8F0", borderRadius: "4px", overflow: "hidden" }}>
                <div
                  style={{
                    width: calculation.monthly.totalRevenue > 0 ? `${(calculation.monthly.insuranceRevenue / calculation.monthly.totalRevenue) * 100}%` : "0%",
                    height: "100%",
                    backgroundColor: "#1E3A5F",
                  }}
                />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "9pt" }}>自費診療</span>
                <span style={{ fontSize: "9pt", fontWeight: "bold" }}>{formatCurrency(calculation.monthly.selfPayRevenue)}万円</span>
              </div>
              <div style={{ height: "20px", backgroundColor: "#E2E8F0", borderRadius: "4px", overflow: "hidden" }}>
                <div
                  style={{
                    width: calculation.monthly.totalRevenue > 0 ? `${(calculation.monthly.selfPayRevenue / calculation.monthly.totalRevenue) * 100}%` : "0%",
                    height: "100%",
                    backgroundColor: "#3B82F6",
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: "12px", padding: "8px", backgroundColor: "#F0F9FF", borderRadius: "4px", textAlign: "center" }}>
              <span style={{ fontSize: "9pt", color: "#64748B" }}>合計: </span>
              <span style={{ fontSize: "14pt", fontWeight: "bold", color: "#1E3A5F" }}>{formatCurrency(calculation.monthly.totalRevenue)}万円</span>
            </div>
          </div>

          {/* 月間収支サマリー */}
          <div>
            <h2 style={{ fontSize: "14pt", fontWeight: "bold", borderBottom: "2px solid #1E3A5F", paddingBottom: "8px", marginBottom: "12px" }}>
              月間収支
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", backgroundColor: "#F0FDF4", borderRadius: "4px" }}>
                <span>総収入</span>
                <span style={{ fontWeight: "bold", color: "#059669" }}>+{formatCurrency(calculation.monthly.totalRevenue)}万円</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", backgroundColor: "#FEF2F2", borderRadius: "4px" }}>
                <span>総経費</span>
                <span style={{ fontWeight: "bold", color: "#DC2626" }}>-{formatCurrency(calculation.monthly.totalExpenses)}万円</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#1E3A5F", borderRadius: "4px", color: "#FFFFFF" }}>
                <span style={{ fontWeight: "bold" }}>営業利益</span>
                <span style={{ fontWeight: "bold", fontSize: "14pt" }}>
                  {calculation.monthly.operatingProfit >= 0 ? "+" : ""}{formatCurrency(calculation.monthly.operatingProfit)}万円
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 経費内訳グラフ */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", borderBottom: "2px solid #1E3A5F", paddingBottom: "8px", marginBottom: "12px" }}>
            月間経費内訳
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
            <div>
              {expenseItems.map((item, index) => {
                const maxValue = Math.max(...expenseItems.map(e => e.value));
                return (
                  <div key={index} style={{ marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                      <span style={{ fontSize: "9pt", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "10px", height: "10px", backgroundColor: item.color, borderRadius: "2px", display: "inline-block" }} />
                        {item.label}
                      </span>
                      <span style={{ fontSize: "9pt" }}>{formatCurrency(item.value)}万円 ({totalExpense > 0 ? Math.round((item.value / totalExpense) * 100) : 0}%)</span>
                    </div>
                    <div style={{ height: "16px", backgroundColor: "#E2E8F0", borderRadius: "3px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : "0%",
                          height: "100%",
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ padding: "16px", backgroundColor: "#F8FAFC", borderRadius: "6px", border: "1px solid #E2E8F0", textAlign: "center" }}>
                <p style={{ fontSize: "9pt", color: "#64748B", margin: 0 }}>経費合計</p>
                <p style={{ fontSize: "20pt", fontWeight: "bold", color: "#1E3A5F", margin: "4px 0" }}>{formatCurrency(totalExpense)}万円</p>
                <div style={{ marginTop: "12px", fontSize: "9pt" }}>
                  <p style={{ margin: "4px 0", color: calculation.metrics.laborCostRatio > 40 ? "#D97706" : "#059669" }}>
                    人件費率: {calculation.metrics.laborCostRatio}%
                  </p>
                  <p style={{ margin: "4px 0", color: calculation.metrics.rentRatio > 15 ? "#D97706" : "#059669" }}>
                    家賃比率: {calculation.metrics.rentRatio}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 年間収支 */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", borderBottom: "2px solid #1E3A5F", paddingBottom: "8px", marginBottom: "12px" }}>
            年間収支予測
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                { label: "年間総収入", value: `${formatCurrency(calculation.yearly.totalRevenue)}万円`, highlight: false, isTotal: false },
                { label: "年間総経費", value: `-${formatCurrency(calculation.yearly.totalExpenses)}万円`, highlight: false, isTotal: false },
                { label: "年間営業利益", value: `${formatCurrency(calculation.yearly.operatingProfit)}万円`, highlight: true, isTotal: false },
                { label: "概算税金（30%）", value: `-${formatCurrency(calculation.yearly.estimatedTax)}万円`, highlight: false, isTotal: false },
                { label: "税引後利益", value: `${formatCurrency(calculation.yearly.netProfit)}万円`, highlight: true, isTotal: true },
              ].map((row, index) => (
                <tr key={index} style={{ backgroundColor: row.isTotal ? "#1E3A5F" : row.highlight ? "#F0F9FF" : "transparent" }}>
                  <td style={{ padding: "12px", borderBottom: "1px solid #E2E8F0", fontWeight: row.highlight ? "bold" : "normal", color: row.isTotal ? "#FFFFFF" : "#111111" }}>{row.label}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #E2E8F0", textAlign: "right", fontWeight: row.highlight ? "bold" : "normal", fontSize: row.isTotal ? "14pt" : "10pt", color: row.isTotal ? "#FFFFFF" : "#111111" }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 投資・資金調達 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          {/* 初期投資 */}
          <div>
            <h2 style={{ fontSize: "14pt", fontWeight: "bold", borderBottom: "2px solid #1E3A5F", paddingBottom: "8px", marginBottom: "12px" }}>
              初期投資
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  [plan.basic.businessType === "succession" ? "承継価格" : "開業費用", plan.initialInvestment.transferPrice],
                  ["内装工事", plan.initialInvestment.renovation],
                  ["医療機器", plan.initialInvestment.equipment],
                  ["敷金・保証金", plan.initialInvestment.deposit],
                  ["運転資金", plan.initialInvestment.workingCapital],
                  ["その他", plan.initialInvestment.other],
                ].map(([label, value], index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #E2E8F0" }}>
                    <td style={{ padding: "8px", fontSize: "9pt" }}>{label}</td>
                    <td style={{ padding: "8px", fontSize: "9pt", textAlign: "right" }}>{formatCurrency(value as number)}万円</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: "#F8FAFC" }}>
                  <td style={{ padding: "10px", fontWeight: "bold" }}>合計</td>
                  <td style={{ padding: "10px", fontWeight: "bold", textAlign: "right" }}>{formatCurrency(calculation.investment.totalInvestment)}万円</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 資金調達 */}
          <div>
            <h2 style={{ fontSize: "14pt", fontWeight: "bold", borderBottom: "2px solid #1E3A5F", paddingBottom: "8px", marginBottom: "12px" }}>
              資金調達
            </h2>
            <div style={{ marginBottom: "12px" }}>
              {fundingItems.filter(item => item.value > 0).map((item, index) => (
                <div key={index} style={{ marginBottom: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px", fontSize: "9pt" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "10px", height: "10px", backgroundColor: item.color, borderRadius: "2px", display: "inline-block" }} />
                      {item.label}
                    </span>
                    <span>{formatCurrency(item.value)}万円</span>
                  </div>
                  <div style={{ height: "12px", backgroundColor: "#E2E8F0", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: calculation.investment.totalFunding > 0 ? `${(item.value / calculation.investment.totalFunding) * 100}%` : "0%", height: "100%", backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "10px", backgroundColor: "#F8FAFC", borderRadius: "4px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "bold" }}>調達合計</span>
              <span style={{ fontWeight: "bold" }}>{formatCurrency(calculation.investment.totalFunding)}万円</span>
            </div>
          </div>
        </div>

        {/* 資金過不足 */}
        <div
          style={{
            padding: "16px",
            borderRadius: "6px",
            marginBottom: "24px",
            backgroundColor: calculation.investment.fundingGap >= 0 ? "#ECFDF5" : "#FEF2F2",
            border: `2px solid ${calculation.investment.fundingGap >= 0 ? "#10B981" : "#EF4444"}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: calculation.investment.fundingGap >= 0 ? "#D1FAE5" : "#FEE2E2",
              color: calculation.investment.fundingGap >= 0 ? "#059669" : "#DC2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "16pt"
            }}>
              {calculation.investment.fundingGap >= 0 ? "✓" : "!"}
            </span>
            <span style={{ fontWeight: "bold", fontSize: "12pt" }}>
              {calculation.investment.fundingGap >= 0 ? "資金に余裕があります" : "資金が不足しています"}
            </span>
          </div>
          <span style={{ fontWeight: "bold", fontSize: "16pt", color: calculation.investment.fundingGap >= 0 ? "#059669" : "#DC2626" }}>
            {calculation.investment.fundingGap >= 0 ? "+" : ""}{formatCurrency(calculation.investment.fundingGap)}万円
          </span>
        </div>

        {/* 経営指標 */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", borderBottom: "2px solid #1E3A5F", paddingBottom: "8px", marginBottom: "12px" }}>
            経営指標
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {[
              { label: "損益分岐患者数", value: `${calculation.investment.breakEvenPatients}名/日`, sub: `現在: ${plan.revenue.dailyPatients}名/日` },
              { label: "月間損益分岐売上", value: `${formatCurrency(calculation.metrics.monthlyBreakEven)}万円`, sub: `現在: ${formatCurrency(calculation.monthly.totalRevenue)}万円` },
              { label: "投資回収期間", value: calculation.investment.paybackYears >= 99 ? "回収困難" : `約${calculation.investment.paybackYears}年`, sub: "5年以内が目標" },
            ].map((metric, index) => (
              <div key={index} style={{ padding: "16px", backgroundColor: "#F8FAFC", borderRadius: "6px", border: "1px solid #E2E8F0", textAlign: "center" }}>
                <p style={{ fontSize: "9pt", color: "#64748B", margin: 0 }}>{metric.label}</p>
                <p style={{ fontSize: "18pt", fontWeight: "bold", color: "#1E3A5F", margin: "8px 0" }}>{metric.value}</p>
                <p style={{ fontSize: "9pt", color: "#64748B", margin: 0 }}>{metric.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 業界比較 */}
        {benchmark && (
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "14pt", fontWeight: "bold", borderBottom: "2px solid #1E3A5F", paddingBottom: "8px", marginBottom: "12px" }}>
              業界平均との比較（{plan.basic.specialty}）
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {[
                { label: "1日患者数", yours: plan.revenue.dailyPatients, avg: benchmark.avgDailyPatients, unit: "名" },
                { label: "患者単価", yours: plan.revenue.avgRevenuePerPatient, avg: benchmark.avgRevenuePerPatient, unit: "円" },
                { label: "利益率", yours: calculation.monthly.profitRate, avg: benchmark.avgProfitRate, unit: "%" },
              ].map((item, index) => {
                const ratio = item.avg > 0 ? item.yours / item.avg : 0;
                const color = ratio >= 1 ? "#059669" : ratio >= 0.8 ? "#D97706" : "#DC2626";
                return (
                  <div key={index} style={{ padding: "12px", backgroundColor: "#F8FAFC", borderRadius: "6px" }}>
                    <p style={{ fontSize: "9pt", color: "#64748B", margin: "0 0 8px 0" }}>{item.label}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div>
                        <p style={{ fontSize: "9pt", color: "#64748B", margin: 0 }}>あなた</p>
                        <p style={{ fontSize: "14pt", fontWeight: "bold", color, margin: 0 }}>{formatCurrency(item.yours)}{item.unit}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "9pt", color: "#64748B", margin: 0 }}>業界平均</p>
                        <p style={{ fontSize: "12pt", color: "#64748B", margin: 0 }}>{formatCurrency(item.avg)}{item.unit}</p>
                      </div>
                    </div>
                    <div style={{ marginTop: "8px", height: "6px", backgroundColor: "#E2E8F0", borderRadius: "3px", position: "relative" }}>
                      <div style={{ position: "absolute", left: "50%", top: "-2px", bottom: "-2px", width: "2px", backgroundColor: "#64748B" }} />
                      <div style={{ width: `${Math.min(ratio * 50, 100)}%`, height: "100%", backgroundColor: color, borderRadius: "3px" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 診断・アドバイス */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", borderBottom: "2px solid #1E3A5F", paddingBottom: "8px", marginBottom: "12px" }}>
            診断結果・アドバイス
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {advice.map((item, index) => {
              const style = getAdviceStyle(item.type);
              return (
                <div
                  key={index}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: style.bg,
                    borderLeft: `4px solid ${style.border}`,
                    borderRadius: "4px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: style.iconBg,
                      color: style.text,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "12pt"
                    }}>
                      {getAdviceIcon(item.type)}
                    </span>
                    <span style={{ fontSize: "9pt", color: "#64748B", backgroundColor: "#FFFFFF", padding: "2px 8px", borderRadius: "4px" }}>{item.category}</span>
                    <span style={{ fontWeight: "bold", color: style.text }}>{item.title}</span>
                  </div>
                  <p style={{ fontSize: "9pt", color: "#64748B", margin: 0, paddingLeft: "28px" }}>{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* フッター */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "16px",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "9pt",
            color: "#64748B",
          }}
        >
          <span>Dr.option | 事業計画書</span>
          <span>本資料は簡易シミュレーションです。詳細は専門家にご相談ください。</span>
        </div>
      </div>
    );
  }
);

PDFReport.displayName = "PDFReport";
