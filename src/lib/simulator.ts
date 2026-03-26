// 承継シミュレーター計算ロジック

export interface SimulatorInput {
  // 現在の状況
  currentSavings: number; // 現在の貯蓄（万円）
  currentAge: number; // 現在の年齢

  // 勤務期間の条件
  annualSalary: number; // 年収（万円）
  workYears: number; // 勤務予定年数
  annualSavingsRate: number; // 年間貯蓄率（%）

  // 承継条件
  transferPrice: number; // 承継価格（万円）
  downPaymentRate: number; // 頭金比率（%）

  // ローン条件
  loanInterestRate: number; // 金利（%）
  loanYears: number; // 返済年数

  // 承継後の収入
  expectedAnnualRevenue: number; // 承継後の年間売上（万円）
  expectedProfitRate: number; // 利益率（%）
}

export interface SimulatorResult {
  // サマリー
  summary: {
    totalSavingsAtTransfer: number; // 承継時の貯蓄額
    downPayment: number; // 頭金
    loanAmount: number; // 借入額
    monthlyLoanPayment: number; // 月々の返済額
    ageAtTransfer: number; // 承継時の年齢
    ageAtLoanComplete: number; // 返済完了時の年齢
    canAfford: boolean; // 資金的に可能か
    shortfall: number; // 不足額（マイナスなら余裕あり）
  };

  // 年次推移
  yearlyProjection: YearlyData[];

  // 承継後の収支
  postTransfer: {
    monthlyRevenue: number;
    monthlyProfit: number;
    monthlyLoanPayment: number;
    monthlyNetIncome: number;
    annualNetIncome: number;
  };

  // アドバイス
  advice: string[];
}

export interface YearlyData {
  year: number;
  age: number;
  phase: "working" | "transfer" | "post-transfer";
  savingsStart: number;
  annualIncome: number;
  annualSavings: number;
  savingsEnd: number;
  loanBalance?: number;
  cumulativeProfit?: number;
}

/**
 * 承継シミュレーションを実行
 */
export function runSimulation(input: SimulatorInput): SimulatorResult {
  const {
    currentSavings,
    currentAge,
    annualSalary,
    workYears,
    annualSavingsRate,
    transferPrice,
    downPaymentRate,
    loanInterestRate,
    loanYears,
    expectedAnnualRevenue,
    expectedProfitRate,
  } = input;

  // 年間貯蓄額
  const annualSavingsAmount = annualSalary * (annualSavingsRate / 100);

  // 承継時の貯蓄額
  const totalSavingsAtTransfer = currentSavings + annualSavingsAmount * workYears;

  // 頭金と借入額
  const downPayment = transferPrice * (downPaymentRate / 100);
  const loanAmount = transferPrice - downPayment;

  // 月々の返済額（元利均等返済）
  const monthlyInterestRate = loanInterestRate / 100 / 12;
  const numberOfPayments = loanYears * 12;
  const monthlyLoanPayment =
    loanAmount > 0
      ? (loanAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      : 0;

  // 資金的に可能か
  const shortfall = downPayment - totalSavingsAtTransfer;
  const canAfford = shortfall <= 0;

  // 承継後の収支
  const monthlyRevenue = expectedAnnualRevenue / 12;
  const monthlyProfit = monthlyRevenue * (expectedProfitRate / 100);
  const monthlyNetIncome = monthlyProfit - monthlyLoanPayment;
  const annualNetIncome = monthlyNetIncome * 12;

  // 年次推移を計算
  const yearlyProjection: YearlyData[] = [];
  let currentSavingsBalance = currentSavings;

  // 勤務期間
  for (let i = 0; i < workYears; i++) {
    const savingsStart = currentSavingsBalance;
    const savingsEnd = savingsStart + annualSavingsAmount;
    currentSavingsBalance = savingsEnd;

    yearlyProjection.push({
      year: i + 1,
      age: currentAge + i,
      phase: "working",
      savingsStart,
      annualIncome: annualSalary,
      annualSavings: annualSavingsAmount,
      savingsEnd,
    });
  }

  // 承継年
  yearlyProjection.push({
    year: workYears + 1,
    age: currentAge + workYears,
    phase: "transfer",
    savingsStart: currentSavingsBalance,
    annualIncome: 0,
    annualSavings: -downPayment,
    savingsEnd: currentSavingsBalance - downPayment,
  });

  // 承継後（ローン返済期間）
  let loanBalance = loanAmount;
  let cumulativeProfit = 0;

  for (let i = 0; i < Math.min(loanYears, 10); i++) {
    const annualPayment = monthlyLoanPayment * 12;
    const annualProfitAfterLoan = annualNetIncome;
    cumulativeProfit += annualProfitAfterLoan;

    // ローン残高の減少（簡易計算）
    const principalPayment = annualPayment - loanBalance * (loanInterestRate / 100);
    loanBalance = Math.max(0, loanBalance - principalPayment);

    yearlyProjection.push({
      year: workYears + 2 + i,
      age: currentAge + workYears + 1 + i,
      phase: "post-transfer",
      savingsStart: 0,
      annualIncome: expectedAnnualRevenue * (expectedProfitRate / 100),
      annualSavings: annualProfitAfterLoan,
      savingsEnd: cumulativeProfit,
      loanBalance,
      cumulativeProfit,
    });
  }

  // アドバイス生成
  const advice: string[] = [];

  if (!canAfford) {
    advice.push(
      `頭金が${Math.round(shortfall)}万円不足しています。勤務期間を延ばすか、貯蓄率を上げることを検討してください。`
    );
  }

  if (monthlyNetIncome < 50) {
    advice.push(
      "承継後の月々の手取りが少なめです。売上向上策や経費削減を検討してください。"
    );
  }

  if (monthlyLoanPayment > monthlyProfit * 0.5) {
    advice.push(
      "返済負担が大きいため、返済期間を延ばすか頭金を増やすことを検討してください。"
    );
  }

  if (canAfford && monthlyNetIncome >= 100) {
    advice.push("現在のプランは実現可能性が高いです。");
  }

  if (currentAge + workYears > 55) {
    advice.push(
      "承継時の年齢が高めです。早めの行動をおすすめします。"
    );
  }

  if (loanYears > 15) {
    advice.push(
      "返済期間が長いため、金利負担が大きくなります。可能であれば期間短縮を検討してください。"
    );
  }

  return {
    summary: {
      totalSavingsAtTransfer: Math.round(totalSavingsAtTransfer),
      downPayment: Math.round(downPayment),
      loanAmount: Math.round(loanAmount),
      monthlyLoanPayment: Math.round(monthlyLoanPayment),
      ageAtTransfer: currentAge + workYears,
      ageAtLoanComplete: currentAge + workYears + loanYears,
      canAfford,
      shortfall: Math.round(shortfall),
    },
    yearlyProjection,
    postTransfer: {
      monthlyRevenue: Math.round(monthlyRevenue),
      monthlyProfit: Math.round(monthlyProfit),
      monthlyLoanPayment: Math.round(monthlyLoanPayment),
      monthlyNetIncome: Math.round(monthlyNetIncome),
      annualNetIncome: Math.round(annualNetIncome),
    },
    advice,
  };
}

/**
 * 数値をフォーマット
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP").format(Math.round(value));
}
