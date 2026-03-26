// 採用競合分析 型定義とモックデータ

export interface CompetitorJob {
  id: string;
  clinicName: string;
  area: string;
  specialty: string;
  salaryMin: number;
  salaryMax: number;
  employmentType: string;
  benefits: string[];
  transferTimeline: string;
  hasSuccessionOption: boolean;
  postedDaysAgo: number;
  applicationCount: number;
}

export interface MarketBenchmark {
  specialty: string;
  area: string;
  salaryPercentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  averageBenefits: string[];
  commonConditions: {
    condition: string;
    percentage: number;
  }[];
  demandTrend: "up" | "stable" | "down";
  avgApplicationsPerJob: number;
  avgDaysToFill: number;
}

export interface CompetitiveScore {
  overall: number; // 0-100
  salary: number;
  benefits: number;
  conditions: number;
  timing: number;
  ranking: {
    position: number;
    total: number;
    percentile: number;
  };
}

export interface ImprovementSuggestion {
  id: string;
  category: "salary" | "benefits" | "conditions" | "description";
  impact: "high" | "medium" | "low";
  title: string;
  description: string;
  estimatedEffect: string;
}

export interface MyJobPosting {
  id: string;
  title: string;
  specialty: string;
  area: string;
  salaryMin: number;
  salaryMax: number;
  employmentType: string;
  benefits: string[];
  transferTimeline: string;
  hasSuccessionOption: boolean;
  description: string;
  postedAt: Date;
  viewCount: number;
  applicationCount: number;
}

// 自社の求人データ（モック）
export const MY_JOB_POSTING: MyJobPosting = {
  id: "my-1",
  title: "内科医師募集（将来の承継あり）",
  specialty: "内科",
  area: "東京都世田谷区",
  salaryMin: 1800,
  salaryMax: 2200,
  employmentType: "常勤",
  benefits: ["社会保険完備", "学会参加費補助", "住宅手当"],
  transferTimeline: "3〜5年後",
  hasSuccessionOption: true,
  description: "地域密着型の内科クリニックです。将来的な承継を前提とした採用を行っています。",
  postedAt: new Date("2024-01-01"),
  viewCount: 234,
  applicationCount: 3,
};

// 競合求人データ（モック）
export const COMPETITOR_JOBS: CompetitorJob[] = [
  {
    id: "comp-1",
    clinicName: "A内科クリニック",
    area: "東京都世田谷区",
    specialty: "内科",
    salaryMin: 2000,
    salaryMax: 2500,
    employmentType: "常勤",
    benefits: ["社会保険完備", "学会参加費補助", "住宅手当", "研修制度充実", "退職金制度"],
    transferTimeline: "1〜3年後",
    hasSuccessionOption: true,
    postedDaysAgo: 14,
    applicationCount: 8,
  },
  {
    id: "comp-2",
    clinicName: "Bメディカルクリニック",
    area: "東京都世田谷区",
    specialty: "内科",
    salaryMin: 1900,
    salaryMax: 2300,
    employmentType: "常勤",
    benefits: ["社会保険完備", "学会参加費補助", "当直なし", "週4日勤務可"],
    transferTimeline: "3〜5年後",
    hasSuccessionOption: true,
    postedDaysAgo: 7,
    applicationCount: 5,
  },
  {
    id: "comp-3",
    clinicName: "C総合内科",
    area: "東京都世田谷区",
    specialty: "内科",
    salaryMin: 1700,
    salaryMax: 2000,
    employmentType: "常勤",
    benefits: ["社会保険完備", "交通費支給"],
    transferTimeline: "5年以上",
    hasSuccessionOption: false,
    postedDaysAgo: 30,
    applicationCount: 2,
  },
  {
    id: "comp-4",
    clinicName: "Dファミリークリニック",
    area: "東京都世田谷区",
    specialty: "内科",
    salaryMin: 2200,
    salaryMax: 2800,
    employmentType: "常勤",
    benefits: ["社会保険完備", "学会参加費補助", "住宅手当", "院長経験者優遇", "インセンティブ制度"],
    transferTimeline: "1〜3年後",
    hasSuccessionOption: true,
    postedDaysAgo: 3,
    applicationCount: 12,
  },
  {
    id: "comp-5",
    clinicName: "E内科・循環器科",
    area: "東京都世田谷区",
    specialty: "内科",
    salaryMin: 1800,
    salaryMax: 2100,
    employmentType: "常勤",
    benefits: ["社会保険完備", "学会参加費補助", "当直なし"],
    transferTimeline: "3〜5年後",
    hasSuccessionOption: true,
    postedDaysAgo: 21,
    applicationCount: 4,
  },
];

// 市場ベンチマーク（モック）
export const MARKET_BENCHMARK: MarketBenchmark = {
  specialty: "内科",
  area: "東京都世田谷区",
  salaryPercentiles: {
    p25: 1800,
    p50: 2000,
    p75: 2300,
    p90: 2600,
  },
  averageBenefits: [
    "社会保険完備",
    "学会参加費補助",
    "住宅手当",
    "退職金制度",
    "研修制度",
  ],
  commonConditions: [
    { condition: "承継オプションあり", percentage: 65 },
    { condition: "当直なし", percentage: 45 },
    { condition: "週4日勤務可", percentage: 30 },
    { condition: "インセンティブ制度", percentage: 25 },
    { condition: "院長経験不問", percentage: 80 },
  ],
  demandTrend: "up",
  avgApplicationsPerJob: 5.2,
  avgDaysToFill: 45,
};

// 競争力スコア計算
export function calculateCompetitiveScore(
  myJob: MyJobPosting,
  competitors: CompetitorJob[],
  benchmark: MarketBenchmark
): CompetitiveScore {
  // 給与スコア（中央値との比較）
  const avgSalary = (myJob.salaryMin + myJob.salaryMax) / 2;
  const marketMedian = benchmark.salaryPercentiles.p50;
  const salaryScore = Math.min(100, Math.round((avgSalary / marketMedian) * 80));

  // 福利厚生スコア
  const benefitMatch = myJob.benefits.filter((b) =>
    benchmark.averageBenefits.includes(b)
  ).length;
  const benefitsScore = Math.round((benefitMatch / benchmark.averageBenefits.length) * 100);

  // 条件スコア
  let conditionsScore = 50;
  if (myJob.hasSuccessionOption) conditionsScore += 20;
  if (myJob.transferTimeline === "1〜3年後") conditionsScore += 15;
  else if (myJob.transferTimeline === "3〜5年後") conditionsScore += 10;

  // タイミングスコア（新しいほど高い）
  const daysSincePosted = Math.floor(
    (new Date().getTime() - myJob.postedAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  const timingScore = Math.max(0, 100 - daysSincePosted * 2);

  // 総合スコア
  const overall = Math.round(
    salaryScore * 0.35 + benefitsScore * 0.25 + conditionsScore * 0.25 + timingScore * 0.15
  );

  // ランキング計算
  const allSalaries = competitors.map((c) => (c.salaryMin + c.salaryMax) / 2);
  allSalaries.push(avgSalary);
  allSalaries.sort((a, b) => b - a);
  const position = allSalaries.indexOf(avgSalary) + 1;

  return {
    overall,
    salary: salaryScore,
    benefits: benefitsScore,
    conditions: conditionsScore,
    timing: timingScore,
    ranking: {
      position,
      total: competitors.length + 1,
      percentile: Math.round(((competitors.length + 1 - position) / competitors.length) * 100),
    },
  };
}

// 改善提案を生成
export function generateSuggestions(
  myJob: MyJobPosting,
  competitors: CompetitorJob[],
  benchmark: MarketBenchmark
): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];

  // 給与に関する提案
  const avgSalary = (myJob.salaryMin + myJob.salaryMax) / 2;
  if (avgSalary < benchmark.salaryPercentiles.p50) {
    const increase = benchmark.salaryPercentiles.p50 - avgSalary;
    suggestions.push({
      id: "salary-1",
      category: "salary",
      impact: "high",
      title: `給与を${increase}万円アップ`,
      description: `現在の給与は市場中央値を下回っています。${increase}万円の増額で競争力が大幅に向上します。`,
      estimatedEffect: "応募率 +40〜60%",
    });
  }

  if (avgSalary < benchmark.salaryPercentiles.p75) {
    suggestions.push({
      id: "salary-2",
      category: "salary",
      impact: "medium",
      title: "インセンティブ制度の導入",
      description: "基本給に加え、業績連動のインセンティブを設けることで、実質的な報酬アップを実現できます。",
      estimatedEffect: "応募率 +20〜30%",
    });
  }

  // 福利厚生に関する提案
  const missingBenefits = benchmark.averageBenefits.filter(
    (b) => !myJob.benefits.includes(b)
  );
  if (missingBenefits.length > 0) {
    suggestions.push({
      id: "benefits-1",
      category: "benefits",
      impact: missingBenefits.length > 2 ? "high" : "medium",
      title: `福利厚生の追加（${missingBenefits.slice(0, 2).join("、")}など）`,
      description: `競合と比較して「${missingBenefits.slice(0, 3).join("」「")}」が不足しています。これらを追加することで魅力度が向上します。`,
      estimatedEffect: "応募率 +15〜25%",
    });
  }

  // 条件に関する提案
  const topCompetitor = competitors.reduce((prev, curr) =>
    curr.applicationCount > prev.applicationCount ? curr : prev
  );
  if (!myJob.benefits.some((b) => b.includes("当直なし")) &&
      topCompetitor.benefits.includes("当直なし")) {
    suggestions.push({
      id: "conditions-1",
      category: "conditions",
      impact: "medium",
      title: "「当直なし」の明記",
      description: "当直がない場合は、求人に明記することで、ワークライフバランスを重視する医師へのアピールになります。",
      estimatedEffect: "応募率 +15〜20%",
    });
  }

  if (myJob.transferTimeline !== "1〜3年後") {
    suggestions.push({
      id: "conditions-2",
      category: "conditions",
      impact: "medium",
      title: "承継時期の柔軟化",
      description: "「1〜3年後」の承継を希望する医師が多い傾向にあります。柔軟な対応が可能であれば、求人に記載しましょう。",
      estimatedEffect: "応募率 +10〜20%",
    });
  }

  // 求人説明に関する提案
  if (myJob.description.length < 200) {
    suggestions.push({
      id: "description-1",
      category: "description",
      impact: "low",
      title: "求人説明文の充実",
      description: "クリニックの特徴、診療方針、地域での役割などを詳しく記載することで、応募者の理解を深められます。",
      estimatedEffect: "応募率 +5〜10%",
    });
  }

  return suggestions.sort((a, b) => {
    const impactOrder = { high: 0, medium: 1, low: 2 };
    return impactOrder[a.impact] - impactOrder[b.impact];
  });
}

// 給与分布のデータを取得
export function getSalaryDistribution(
  myJob: MyJobPosting,
  competitors: CompetitorJob[]
): { name: string; min: number; max: number; isMe: boolean }[] {
  const data = competitors.map((c) => ({
    name: c.clinicName,
    min: c.salaryMin,
    max: c.salaryMax,
    isMe: false,
  }));

  data.push({
    name: "あなたの求人",
    min: myJob.salaryMin,
    max: myJob.salaryMax,
    isMe: true,
  });

  return data.sort((a, b) => (b.min + b.max) / 2 - (a.min + a.max) / 2);
}

// 福利厚生の比較データを取得
export function getBenefitsComparison(
  myJob: MyJobPosting,
  competitors: CompetitorJob[]
): { benefit: string; myJob: boolean; competitors: number; percentage: number }[] {
  const allBenefits = new Set<string>();
  competitors.forEach((c) => c.benefits.forEach((b) => allBenefits.add(b)));
  myJob.benefits.forEach((b) => allBenefits.add(b));

  return Array.from(allBenefits).map((benefit) => {
    const competitorCount = competitors.filter((c) => c.benefits.includes(benefit)).length;
    return {
      benefit,
      myJob: myJob.benefits.includes(benefit),
      competitors: competitorCount,
      percentage: Math.round((competitorCount / competitors.length) * 100),
    };
  }).sort((a, b) => b.percentage - a.percentage);
}
