// エリア市場データ 型定義とモックデータ

export interface AreaMarketData {
  id: string;
  prefecture: string;
  city: string;
  region: string; // e.g., "関東", "関西"
  population: number;
  populationTrend: "increasing" | "stable" | "decreasing";
  populationGrowthRate: number; // パーセント
  elderlyRate: number; // 65歳以上の割合
  clinicCount: number;
  doctorCount: number;
  clinicsPerCapita: number; // 人口1万人あたりの診療所数
  doctorsPerCapita: number; // 人口1万人あたりの医師数
  competitionLevel: "low" | "medium" | "high";
  demandLevel: "low" | "medium" | "high";
  averageClinicRevenue: number; // 万円/年
  averageTransferPrice: number; // 万円
  majorDepartments: DepartmentData[];
  insights: string[];
  lastUpdated: Date;
}

export interface DepartmentData {
  name: string;
  clinicCount: number;
  demandScore: number; // 1-100
  competitionScore: number; // 1-100
  growthTrend: "up" | "stable" | "down";
}

export interface RegionSummary {
  region: string;
  prefectures: string[];
  totalPopulation: number;
  averageElderlyRate: number;
  averageClinicRevenue: number;
  hotAreas: string[];
}

// モックデータ
export const MOCK_MARKET_DATA: AreaMarketData[] = [
  {
    id: "tokyo-shibuya",
    prefecture: "東京都",
    city: "渋谷区",
    region: "関東",
    population: 243000,
    populationTrend: "increasing",
    populationGrowthRate: 1.2,
    elderlyRate: 18.5,
    clinicCount: 892,
    doctorCount: 1456,
    clinicsPerCapita: 36.7,
    doctorsPerCapita: 59.9,
    competitionLevel: "high",
    demandLevel: "high",
    averageClinicRevenue: 15000,
    averageTransferPrice: 12000,
    majorDepartments: [
      { name: "内科", clinicCount: 245, demandScore: 75, competitionScore: 85, growthTrend: "stable" },
      { name: "皮膚科", clinicCount: 156, demandScore: 80, competitionScore: 90, growthTrend: "up" },
      { name: "心療内科", clinicCount: 89, demandScore: 85, competitionScore: 70, growthTrend: "up" },
      { name: "整形外科", clinicCount: 78, demandScore: 70, competitionScore: 75, growthTrend: "stable" },
    ],
    insights: [
      "若年層が多く、美容皮膚科・心療内科の需要が高い",
      "競争は激しいが、差別化できれば高収益が期待できる",
      "賃料が高いため、初期投資には注意が必要",
    ],
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "tokyo-setagaya",
    prefecture: "東京都",
    city: "世田谷区",
    region: "関東",
    population: 943000,
    populationTrend: "stable",
    populationGrowthRate: 0.3,
    elderlyRate: 21.2,
    clinicCount: 1523,
    doctorCount: 2341,
    clinicsPerCapita: 16.1,
    doctorsPerCapita: 24.8,
    competitionLevel: "medium",
    demandLevel: "high",
    averageClinicRevenue: 12000,
    averageTransferPrice: 9000,
    majorDepartments: [
      { name: "内科", clinicCount: 412, demandScore: 85, competitionScore: 70, growthTrend: "up" },
      { name: "小児科", clinicCount: 189, demandScore: 80, competitionScore: 65, growthTrend: "stable" },
      { name: "眼科", clinicCount: 134, demandScore: 75, competitionScore: 60, growthTrend: "stable" },
      { name: "整形外科", clinicCount: 156, demandScore: 80, competitionScore: 70, growthTrend: "up" },
    ],
    insights: [
      "ファミリー層が多く、小児科・内科の需要が安定",
      "高齢化も進んでおり、在宅医療へのニーズも増加傾向",
      "住宅街のため、地域密着型の経営が成功しやすい",
    ],
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "osaka-kita",
    prefecture: "大阪府",
    city: "大阪市北区",
    region: "関西",
    population: 143000,
    populationTrend: "increasing",
    populationGrowthRate: 0.8,
    elderlyRate: 17.8,
    clinicCount: 678,
    doctorCount: 1123,
    clinicsPerCapita: 47.4,
    doctorsPerCapita: 78.5,
    competitionLevel: "high",
    demandLevel: "high",
    averageClinicRevenue: 13500,
    averageTransferPrice: 10000,
    majorDepartments: [
      { name: "内科", clinicCount: 189, demandScore: 80, competitionScore: 80, growthTrend: "stable" },
      { name: "美容外科", clinicCount: 67, demandScore: 85, competitionScore: 85, growthTrend: "up" },
      { name: "心療内科", clinicCount: 56, demandScore: 80, competitionScore: 65, growthTrend: "up" },
      { name: "皮膚科", clinicCount: 98, demandScore: 75, competitionScore: 75, growthTrend: "stable" },
    ],
    insights: [
      "ビジネス街のため、働く世代向けの診療科が有望",
      "夜間・土日診療のニーズが高い",
      "大阪駅周辺は賃料が高騰中",
    ],
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "kanagawa-yokohama-aoba",
    prefecture: "神奈川県",
    city: "横浜市青葉区",
    region: "関東",
    population: 311000,
    populationTrend: "stable",
    populationGrowthRate: 0.1,
    elderlyRate: 23.5,
    clinicCount: 456,
    doctorCount: 678,
    clinicsPerCapita: 14.7,
    doctorsPerCapita: 21.8,
    competitionLevel: "medium",
    demandLevel: "high",
    averageClinicRevenue: 11000,
    averageTransferPrice: 7500,
    majorDepartments: [
      { name: "内科", clinicCount: 134, demandScore: 85, competitionScore: 60, growthTrend: "up" },
      { name: "小児科", clinicCount: 67, demandScore: 75, competitionScore: 55, growthTrend: "stable" },
      { name: "整形外科", clinicCount: 45, demandScore: 80, competitionScore: 50, growthTrend: "up" },
      { name: "眼科", clinicCount: 34, demandScore: 70, competitionScore: 45, growthTrend: "stable" },
    ],
    insights: [
      "高所得層が多く、質の高い医療への需要がある",
      "高齢化が進んでおり、内科・整形外科の需要が増加",
      "競争は比較的穏やかで、新規参入しやすい",
    ],
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "saitama-omiya",
    prefecture: "埼玉県",
    city: "さいたま市大宮区",
    region: "関東",
    population: 120000,
    populationTrend: "increasing",
    populationGrowthRate: 0.5,
    elderlyRate: 22.1,
    clinicCount: 234,
    doctorCount: 345,
    clinicsPerCapita: 19.5,
    doctorsPerCapita: 28.8,
    competitionLevel: "medium",
    demandLevel: "medium",
    averageClinicRevenue: 9500,
    averageTransferPrice: 6000,
    majorDepartments: [
      { name: "内科", clinicCount: 78, demandScore: 80, competitionScore: 65, growthTrend: "up" },
      { name: "整形外科", clinicCount: 34, demandScore: 75, competitionScore: 55, growthTrend: "up" },
      { name: "皮膚科", clinicCount: 28, demandScore: 70, competitionScore: 50, growthTrend: "stable" },
      { name: "耳鼻咽喉科", clinicCount: 23, demandScore: 65, competitionScore: 45, growthTrend: "stable" },
    ],
    insights: [
      "東京へのアクセスが良く、ベッドタウンとして人気",
      "駅周辺の再開発が進んでおり、人口増加が見込まれる",
      "承継価格は東京より低く、コストパフォーマンスが良い",
    ],
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "fukuoka-hakata",
    prefecture: "福岡県",
    city: "福岡市博多区",
    region: "九州",
    population: 255000,
    populationTrend: "increasing",
    populationGrowthRate: 1.0,
    elderlyRate: 19.8,
    clinicCount: 512,
    doctorCount: 789,
    clinicsPerCapita: 20.1,
    doctorsPerCapita: 30.9,
    competitionLevel: "medium",
    demandLevel: "high",
    averageClinicRevenue: 10500,
    averageTransferPrice: 7000,
    majorDepartments: [
      { name: "内科", clinicCount: 156, demandScore: 80, competitionScore: 60, growthTrend: "up" },
      { name: "心療内科", clinicCount: 45, demandScore: 75, competitionScore: 50, growthTrend: "up" },
      { name: "消化器内科", clinicCount: 56, demandScore: 70, competitionScore: 55, growthTrend: "stable" },
      { name: "皮膚科", clinicCount: 67, demandScore: 70, competitionScore: 60, growthTrend: "stable" },
    ],
    insights: [
      "九州の中心都市として人口増加が続いている",
      "スタートアップ企業が多く、若い世代の需要が高い",
      "東京・大阪に比べ賃料が安く、開業コストを抑えられる",
    ],
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "aichi-nagoya-naka",
    prefecture: "愛知県",
    city: "名古屋市中区",
    region: "中部",
    population: 92000,
    populationTrend: "stable",
    populationGrowthRate: 0.2,
    elderlyRate: 20.5,
    clinicCount: 345,
    doctorCount: 567,
    clinicsPerCapita: 37.5,
    doctorsPerCapita: 61.6,
    competitionLevel: "high",
    demandLevel: "medium",
    averageClinicRevenue: 11500,
    averageTransferPrice: 8000,
    majorDepartments: [
      { name: "内科", clinicCount: 98, demandScore: 75, competitionScore: 75, growthTrend: "stable" },
      { name: "皮膚科", clinicCount: 56, demandScore: 70, competitionScore: 70, growthTrend: "stable" },
      { name: "整形外科", clinicCount: 45, demandScore: 70, competitionScore: 65, growthTrend: "stable" },
      { name: "眼科", clinicCount: 34, demandScore: 65, competitionScore: 60, growthTrend: "stable" },
    ],
    insights: [
      "トヨタ関連企業が多く、製造業従事者が多い",
      "企業健診・産業医のニーズがある",
      "中心部は競争が激しいが、郊外は需要あり",
    ],
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "chiba-funabashi",
    prefecture: "千葉県",
    city: "船橋市",
    region: "関東",
    population: 645000,
    populationTrend: "stable",
    populationGrowthRate: 0.4,
    elderlyRate: 25.3,
    clinicCount: 678,
    doctorCount: 912,
    clinicsPerCapita: 10.5,
    doctorsPerCapita: 14.1,
    competitionLevel: "low",
    demandLevel: "high",
    averageClinicRevenue: 10000,
    averageTransferPrice: 5500,
    majorDepartments: [
      { name: "内科", clinicCount: 234, demandScore: 90, competitionScore: 50, growthTrend: "up" },
      { name: "整形外科", clinicCount: 89, demandScore: 85, competitionScore: 45, growthTrend: "up" },
      { name: "小児科", clinicCount: 67, demandScore: 75, competitionScore: 40, growthTrend: "stable" },
      { name: "眼科", clinicCount: 45, demandScore: 80, competitionScore: 40, growthTrend: "up" },
    ],
    insights: [
      "人口に対して医療機関が不足しており、需要が高い",
      "高齢化率が高く、在宅医療・訪問診療の需要増",
      "承継価格が比較的安く、投資回収が早い傾向",
    ],
    lastUpdated: new Date("2024-01-01"),
  },
];

export const REGION_SUMMARIES: RegionSummary[] = [
  {
    region: "関東",
    prefectures: ["東京都", "神奈川県", "埼玉県", "千葉県", "茨城県", "栃木県", "群馬県"],
    totalPopulation: 43500000,
    averageElderlyRate: 24.8,
    averageClinicRevenue: 11200,
    hotAreas: ["世田谷区", "船橋市", "横浜市青葉区"],
  },
  {
    region: "関西",
    prefectures: ["大阪府", "京都府", "兵庫県", "奈良県", "和歌山県", "滋賀県"],
    totalPopulation: 20500000,
    averageElderlyRate: 27.2,
    averageClinicRevenue: 10500,
    hotAreas: ["大阪市北区", "神戸市中央区", "京都市中京区"],
  },
  {
    region: "中部",
    prefectures: ["愛知県", "岐阜県", "三重県", "静岡県", "長野県", "山梨県", "新潟県", "富山県", "石川県", "福井県"],
    totalPopulation: 21500000,
    averageElderlyRate: 28.5,
    averageClinicRevenue: 9500,
    hotAreas: ["名古屋市中区", "静岡市葵区", "金沢市"],
  },
  {
    region: "九州",
    prefectures: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"],
    totalPopulation: 14500000,
    averageElderlyRate: 29.8,
    averageClinicRevenue: 8800,
    hotAreas: ["福岡市博多区", "北九州市小倉北区", "那覇市"],
  },
];

// ヘルパー関数
export function getMarketDataById(id: string): AreaMarketData | undefined {
  return MOCK_MARKET_DATA.find((data) => data.id === id);
}

export function getMarketDataByPrefecture(prefecture: string): AreaMarketData[] {
  return MOCK_MARKET_DATA.filter((data) => data.prefecture === prefecture);
}

export function getMarketDataByRegion(region: string): AreaMarketData[] {
  return MOCK_MARKET_DATA.filter((data) => data.region === region);
}

export function getCompetitionColor(level: "low" | "medium" | "high"): string {
  switch (level) {
    case "low":
      return "text-green-600 bg-green-50";
    case "medium":
      return "text-yellow-600 bg-yellow-50";
    case "high":
      return "text-red-600 bg-red-50";
  }
}

export function getDemandColor(level: "low" | "medium" | "high"): string {
  switch (level) {
    case "low":
      return "text-gray-600 bg-gray-50";
    case "medium":
      return "text-blue-600 bg-blue-50";
    case "high":
      return "text-green-600 bg-green-50";
  }
}

export function getTrendIcon(trend: "up" | "stable" | "down" | "increasing" | "decreasing"): string {
  switch (trend) {
    case "up":
    case "increasing":
      return "↑";
    case "down":
    case "decreasing":
      return "↓";
    case "stable":
      return "→";
  }
}

export function getTrendColor(trend: "up" | "stable" | "down" | "increasing" | "decreasing"): string {
  switch (trend) {
    case "up":
    case "increasing":
      return "text-green-600";
    case "down":
    case "decreasing":
      return "text-red-600";
    case "stable":
      return "text-gray-600";
  }
}

export function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "万";
  }
  return num.toLocaleString();
}

export function formatCurrency(num: number): string {
  return num.toLocaleString() + "万円";
}
