// 簡易事業計画 型定義と計算ロジック

export interface BusinessPlan {
  // 基本情報
  basic: {
    clinicName: string;
    specialty: string;
    area: string;
    openingDate: string;
    businessType: "succession" | "new"; // 承継 or 新規開業
  };

  // 収入計画
  revenue: {
    dailyPatients: number; // 1日の患者数
    avgRevenuePerPatient: number; // 患者単価（円）
    workDaysPerMonth: number; // 月間診療日数
    selfPayRatio: number; // 自費診療比率（%）
    selfPayAvgPrice: number; // 自費診療平均単価（円）
  };

  // 支出計画
  expenses: {
    rent: number; // 家賃（万円/月）
    staffCost: number; // 人件費（万円/月）
    utilities: number; // 光熱費（万円/月）
    supplies: number; // 医薬品・消耗品（万円/月）
    equipment: number; // 機器リース・保守（万円/月）
    marketing: number; // 広告宣伝費（万円/月）
    loan: number; // ローン返済（万円/月）
    other: number; // その他経費（万円/月）
  };

  // 人員計画
  staffing: {
    doctors: number;
    nurses: number;
    clerks: number;
    others: number;
  };

  // 初期投資
  initialInvestment: {
    transferPrice: number; // 承継価格（万円）
    renovation: number; // 内装工事（万円）
    equipment: number; // 医療機器（万円）
    deposit: number; // 敷金・保証金（万円）
    workingCapital: number; // 運転資金（万円）
    other: number; // その他（万円）
  };

  // 資金調達
  funding: {
    ownCapital: number; // 自己資金（万円）
    bankLoan: number; // 銀行融資（万円）
    publicLoan: number; // 公的融資（万円）
    other: number; // その他（万円）
  };
}

export interface PlanCalculation {
  // 月間収支
  monthly: {
    insuranceRevenue: number; // 保険診療収入
    selfPayRevenue: number; // 自費診療収入
    totalRevenue: number; // 総収入
    totalExpenses: number; // 総支出
    operatingProfit: number; // 営業利益
    profitRate: number; // 利益率（%）
  };

  // 年間収支
  yearly: {
    totalRevenue: number;
    totalExpenses: number;
    operatingProfit: number;
    estimatedTax: number; // 概算税金
    netProfit: number; // 税引後利益
  };

  // 投資回収
  investment: {
    totalInvestment: number; // 総投資額
    totalFunding: number; // 総調達額
    fundingGap: number; // 資金過不足
    paybackYears: number; // 投資回収年数
    breakEvenPatients: number; // 損益分岐患者数
  };

  // 経営指標
  metrics: {
    laborCostRatio: number; // 人件費率
    rentRatio: number; // 家賃比率
    monthlyBreakEven: number; // 月間損益分岐売上
  };
}

export interface PlanAdvice {
  type: "success" | "warning" | "danger";
  category: string;
  title: string;
  description: string;
}

// デフォルト値
export const DEFAULT_BUSINESS_PLAN: BusinessPlan = {
  basic: {
    clinicName: "",
    specialty: "内科",
    area: "",
    openingDate: "",
    businessType: "succession",
  },
  revenue: {
    dailyPatients: 40,
    avgRevenuePerPatient: 6000,
    workDaysPerMonth: 22,
    selfPayRatio: 10,
    selfPayAvgPrice: 15000,
  },
  expenses: {
    rent: 50,
    staffCost: 120,
    utilities: 8,
    supplies: 30,
    equipment: 15,
    marketing: 10,
    loan: 40,
    other: 15,
  },
  staffing: {
    doctors: 1,
    nurses: 2,
    clerks: 2,
    others: 0,
  },
  initialInvestment: {
    transferPrice: 5000,
    renovation: 500,
    equipment: 300,
    deposit: 100,
    workingCapital: 500,
    other: 100,
  },
  funding: {
    ownCapital: 1500,
    bankLoan: 4000,
    publicLoan: 1000,
    other: 0,
  },
};

// 診療科別のベンチマーク
export const SPECIALTY_BENCHMARKS: Record<string, {
  avgDailyPatients: number;
  avgRevenuePerPatient: number;
  avgProfitRate: number;
}> = {
  内科: { avgDailyPatients: 45, avgRevenuePerPatient: 5500, avgProfitRate: 25 },
  小児科: { avgDailyPatients: 50, avgRevenuePerPatient: 5000, avgProfitRate: 22 },
  皮膚科: { avgDailyPatients: 55, avgRevenuePerPatient: 4500, avgProfitRate: 28 },
  整形外科: { avgDailyPatients: 40, avgRevenuePerPatient: 7000, avgProfitRate: 24 },
  眼科: { avgDailyPatients: 50, avgRevenuePerPatient: 6000, avgProfitRate: 30 },
  耳鼻咽喉科: { avgDailyPatients: 45, avgRevenuePerPatient: 5000, avgProfitRate: 26 },
  心療内科: { avgDailyPatients: 25, avgRevenuePerPatient: 8000, avgProfitRate: 35 },
  美容皮膚科: { avgDailyPatients: 15, avgRevenuePerPatient: 30000, avgProfitRate: 40 },
};

// 計算関数
export function calculatePlan(plan: BusinessPlan): PlanCalculation {
  // 月間保険診療収入
  const monthlyInsurancePatients = plan.revenue.dailyPatients * plan.revenue.workDaysPerMonth;
  const insurancePatientRatio = (100 - plan.revenue.selfPayRatio) / 100;
  const insuranceRevenue = Math.round(
    monthlyInsurancePatients * insurancePatientRatio * plan.revenue.avgRevenuePerPatient / 10000
  );

  // 月間自費診療収入
  const selfPayRevenue = Math.round(
    monthlyInsurancePatients * (plan.revenue.selfPayRatio / 100) * plan.revenue.selfPayAvgPrice / 10000
  );

  const totalRevenue = insuranceRevenue + selfPayRevenue;

  // 月間支出
  const totalExpenses =
    plan.expenses.rent +
    plan.expenses.staffCost +
    plan.expenses.utilities +
    plan.expenses.supplies +
    plan.expenses.equipment +
    plan.expenses.marketing +
    plan.expenses.loan +
    plan.expenses.other;

  const operatingProfit = totalRevenue - totalExpenses;
  const profitRate = totalRevenue > 0 ? Math.round((operatingProfit / totalRevenue) * 100) : 0;

  // 年間収支
  const yearlyRevenue = totalRevenue * 12;
  const yearlyExpenses = totalExpenses * 12;
  const yearlyOperatingProfit = operatingProfit * 12;
  const estimatedTax = Math.round(yearlyOperatingProfit * 0.3); // 概算30%
  const netProfit = yearlyOperatingProfit - estimatedTax;

  // 投資計算
  const totalInvestment =
    plan.initialInvestment.transferPrice +
    plan.initialInvestment.renovation +
    plan.initialInvestment.equipment +
    plan.initialInvestment.deposit +
    plan.initialInvestment.workingCapital +
    plan.initialInvestment.other;

  const totalFunding =
    plan.funding.ownCapital +
    plan.funding.bankLoan +
    plan.funding.publicLoan +
    plan.funding.other;

  const fundingGap = totalFunding - totalInvestment;
  const paybackYears = netProfit > 0 ? Math.round((totalInvestment / netProfit) * 10) / 10 : 99;

  // 損益分岐患者数
  const avgRevenuePerPatientTotal =
    plan.revenue.avgRevenuePerPatient * insurancePatientRatio +
    plan.revenue.selfPayAvgPrice * (plan.revenue.selfPayRatio / 100);
  const fixedCosts = (plan.expenses.rent + plan.expenses.staffCost + plan.expenses.equipment + plan.expenses.loan) * 10000;
  const variableCostRatio = 0.3; // 変動費率30%想定
  const breakEvenPatients = Math.ceil(
    fixedCosts / (avgRevenuePerPatientTotal * (1 - variableCostRatio) * plan.revenue.workDaysPerMonth)
  );

  // 経営指標
  const laborCostRatio = totalRevenue > 0 ? Math.round((plan.expenses.staffCost / totalRevenue) * 100) : 0;
  const rentRatio = totalRevenue > 0 ? Math.round((plan.expenses.rent / totalRevenue) * 100) : 0;
  const monthlyBreakEven = Math.round(totalExpenses / (1 - variableCostRatio));

  return {
    monthly: {
      insuranceRevenue,
      selfPayRevenue,
      totalRevenue,
      totalExpenses,
      operatingProfit,
      profitRate,
    },
    yearly: {
      totalRevenue: yearlyRevenue,
      totalExpenses: yearlyExpenses,
      operatingProfit: yearlyOperatingProfit,
      estimatedTax,
      netProfit,
    },
    investment: {
      totalInvestment,
      totalFunding,
      fundingGap,
      paybackYears,
      breakEvenPatients,
    },
    metrics: {
      laborCostRatio,
      rentRatio,
      monthlyBreakEven,
    },
  };
}

// アドバイス生成
export function generateAdvice(plan: BusinessPlan, calc: PlanCalculation): PlanAdvice[] {
  const advice: PlanAdvice[] = [];
  const benchmark = SPECIALTY_BENCHMARKS[plan.basic.specialty] || SPECIALTY_BENCHMARKS["内科"];

  // 収益性チェック
  if (calc.monthly.profitRate >= 25) {
    advice.push({
      type: "success",
      category: "収益性",
      title: "良好な利益率です",
      description: `利益率${calc.monthly.profitRate}%は業界平均を上回っています。`,
    });
  } else if (calc.monthly.profitRate >= 15) {
    advice.push({
      type: "warning",
      category: "収益性",
      title: "利益率の改善余地があります",
      description: `利益率${calc.monthly.profitRate}%は平均的です。経費削減や単価向上を検討しましょう。`,
    });
  } else {
    advice.push({
      type: "danger",
      category: "収益性",
      title: "利益率が低水準です",
      description: `利益率${calc.monthly.profitRate}%は低い水準です。収支計画の見直しが必要です。`,
    });
  }

  // 人件費率チェック
  if (calc.metrics.laborCostRatio > 50) {
    advice.push({
      type: "danger",
      category: "人件費",
      title: "人件費率が高すぎます",
      description: `人件費率${calc.metrics.laborCostRatio}%は高い水準です。40%以下を目指しましょう。`,
    });
  } else if (calc.metrics.laborCostRatio > 40) {
    advice.push({
      type: "warning",
      category: "人件費",
      title: "人件費率に注意が必要です",
      description: `人件費率${calc.metrics.laborCostRatio}%はやや高めです。`,
    });
  }

  // 家賃比率チェック
  if (calc.metrics.rentRatio > 15) {
    advice.push({
      type: "warning",
      category: "家賃",
      title: "家賃比率が高めです",
      description: `家賃比率${calc.metrics.rentRatio}%は高い水準です。10%以下が理想です。`,
    });
  }

  // 資金調達チェック
  if (calc.investment.fundingGap < 0) {
    advice.push({
      type: "danger",
      category: "資金調達",
      title: "資金が不足しています",
      description: `${Math.abs(calc.investment.fundingGap)}万円の資金不足があります。追加調達を検討してください。`,
    });
  } else if (calc.investment.fundingGap < 300) {
    advice.push({
      type: "warning",
      category: "資金調達",
      title: "予備資金が少なめです",
      description: "予期せぬ出費に備え、もう少し余裕を持った資金計画をおすすめします。",
    });
  } else {
    advice.push({
      type: "success",
      category: "資金調達",
      title: "資金計画は適切です",
      description: `${calc.investment.fundingGap}万円の余裕があります。`,
    });
  }

  // 投資回収チェック
  if (calc.investment.paybackYears <= 5) {
    advice.push({
      type: "success",
      category: "投資回収",
      title: "良好な投資回収期間です",
      description: `約${calc.investment.paybackYears}年で投資回収が見込めます。`,
    });
  } else if (calc.investment.paybackYears <= 10) {
    advice.push({
      type: "warning",
      category: "投資回収",
      title: "投資回収に時間がかかります",
      description: `約${calc.investment.paybackYears}年の投資回収期間です。収益向上策を検討しましょう。`,
    });
  } else {
    advice.push({
      type: "danger",
      category: "投資回収",
      title: "投資回収が困難です",
      description: "現在の計画では投資回収に10年以上かかる見込みです。計画の見直しが必要です。",
    });
  }

  // 患者数チェック
  if (plan.revenue.dailyPatients < benchmark.avgDailyPatients * 0.7) {
    advice.push({
      type: "warning",
      category: "患者数",
      title: "患者数見込みが控えめです",
      description: `${plan.basic.specialty}の平均は1日${benchmark.avgDailyPatients}名程度です。`,
    });
  }

  return advice;
}

// フォーマット関数
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP").format(value);
}
