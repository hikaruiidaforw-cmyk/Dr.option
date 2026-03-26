// ドクター市場価値診断 算出ロジック

// ============================================================
// 型定義
// ============================================================

export type QuestionType = "single_select" | "multi_select";

export interface Option {
  value: string;
  label: string;
  [key: string]: string | number;
}

export interface Question {
  id: string;
  phase: 1 | 2;
  label: string;
  type: QuestionType;
  options: Option[];
  weight: number;
}

export interface Factor {
  label: string;
  impact: "positive" | "negative" | "neutral";
  amount: number;
  description: string;
}

export interface MarketValueResult {
  range: { min: number; max: number };
  midpoint: number;
  position: string;
  positionPercentile: number;
  monthlyEquivalent: number;
  hourlyEquivalent: number;
  factors: Factor[];
  ownerEstimate: { min: number; max: number; note: string } | null;
}

export type Answers = Record<string, string | string[]>;

// ============================================================
// 質問定義
// ============================================================

export const QUESTIONS: Question[] = [
  // Phase 1
  {
    id: "specialty",
    phase: 1,
    label: "ご専門の診療科目を教えてください",
    type: "single_select",
    weight: 10,
    options: [
      { value: "internal", label: "内科", baseScore: 1400 },
      { value: "ortho", label: "整形外科", baseScore: 1700 },
      { value: "derma", label: "皮膚科", baseScore: 1500 },
      { value: "ophthal", label: "眼科", baseScore: 1600 },
      { value: "ent", label: "耳鼻咽喉科", baseScore: 1400 },
      { value: "obgyn", label: "産婦人科", baseScore: 1600 },
      { value: "pediatrics", label: "小児科", baseScore: 1300 },
      { value: "psych", label: "精神科", baseScore: 1400 },
      { value: "dental", label: "歯科", baseScore: 1000 },
      { value: "dental_oral", label: "歯科口腔外科", baseScore: 1200 },
      { value: "surgery", label: "外科", baseScore: 1800 },
      { value: "cardio", label: "循環器内科", baseScore: 1700 },
      { value: "gastro", label: "消化器内科", baseScore: 1600 },
      { value: "uro", label: "泌尿器科", baseScore: 1600 },
      { value: "radiology", label: "放射線科", baseScore: 1700 },
      { value: "anesthesia", label: "麻酔科", baseScore: 1800 },
      { value: "plastic", label: "美容外科・形成外科", baseScore: 2200 },
      { value: "rehab", label: "リハビリテーション科", baseScore: 1300 },
      { value: "emergency", label: "救急科", baseScore: 1700 },
      { value: "other", label: "その他", baseScore: 1400 },
    ],
  },
  {
    id: "experience_years",
    phase: 1,
    label: "医師免許取得後の経験年数を教えてください",
    type: "single_select",
    weight: 8,
    options: [
      { value: "under5", label: "5年未満", multiplier: 0.75 },
      { value: "5to10", label: "5〜10年", multiplier: 0.9 },
      { value: "10to15", label: "10〜15年", multiplier: 1.0 },
      { value: "15to20", label: "15〜20年", multiplier: 1.1 },
      { value: "20to25", label: "20〜25年", multiplier: 1.15 },
      { value: "over25", label: "25年以上", multiplier: 1.1 },
    ],
  },
  {
    id: "area",
    phase: 1,
    label: "希望する勤務エリアを教えてください",
    type: "single_select",
    weight: 7,
    options: [
      { value: "tokyo_central", label: "東京23区（都心部：千代田・中央・港・渋谷・新宿）", areaMultiplier: 1.15 },
      { value: "tokyo_other", label: "東京23区（その他）", areaMultiplier: 1.1 },
      { value: "tokyo_suburban", label: "東京都下（多摩地区等）", areaMultiplier: 1.0 },
      { value: "kanagawa", label: "神奈川県", areaMultiplier: 1.05 },
      { value: "saitama", label: "埼玉県", areaMultiplier: 1.0 },
      { value: "chiba", label: "千葉県", areaMultiplier: 1.0 },
      { value: "osaka", label: "大阪府", areaMultiplier: 1.05 },
      { value: "nagoya", label: "愛知県", areaMultiplier: 1.0 },
      { value: "fukuoka", label: "福岡県", areaMultiplier: 0.95 },
      { value: "regional_city", label: "地方都市", areaMultiplier: 0.95 },
      { value: "rural", label: "郡部・へき地", areaMultiplier: 1.2 },
    ],
  },
  {
    id: "work_style",
    phase: 1,
    label: "希望する勤務形態を教えてください",
    type: "single_select",
    weight: 6,
    options: [
      { value: "full_time_hospital", label: "常勤（病院勤務）", styleMultiplier: 1.0 },
      { value: "full_time_clinic", label: "常勤（クリニック勤務）", styleMultiplier: 0.95 },
      { value: "clinic_owner", label: "開業（院長）", styleMultiplier: 1.8 },
      { value: "part_time", label: "非常勤・パート", styleMultiplier: 0.6 },
      { value: "freelance", label: "フリーランス（スポット勤務中心）", styleMultiplier: 0.85 },
      { value: "corporate", label: "企業勤務（産業医等）", styleMultiplier: 0.9 },
    ],
  },
  {
    id: "board_cert",
    phase: 1,
    label: "専門医資格の取得状況を教えてください",
    type: "single_select",
    weight: 7,
    options: [
      { value: "specialist_major", label: "基本領域の専門医あり", certBonus: 100 },
      { value: "subspecialist", label: "サブスペシャルティ専門医あり", certBonus: 200 },
      { value: "multiple", label: "複数の専門医資格あり", certBonus: 250 },
      { value: "none", label: "専門医なし", certBonus: 0 },
      { value: "in_progress", label: "取得予定・研修中", certBonus: 50 },
    ],
  },
  // Phase 2
  {
    id: "procedure_skill",
    phase: 2,
    label: "手技・オペのスキルレベルを教えてください",
    type: "single_select",
    weight: 8,
    options: [
      { value: "advanced", label: "高度な手術・手技が可能（執刀医レベル）", skillBonus: 300 },
      { value: "intermediate", label: "一般的な手術・手技が可能", skillBonus: 150 },
      { value: "basic", label: "基本的な処置のみ", skillBonus: 0 },
      { value: "not_applicable", label: "手技系の科目ではない", skillBonus: 50 },
    ],
  },
  {
    id: "night_shift",
    phase: 2,
    label: "当直・オンコールの対応可否を教えてください",
    type: "single_select",
    weight: 5,
    options: [
      { value: "available_frequent", label: "月4回以上対応可", nightBonus: 150 },
      { value: "available_moderate", label: "月2〜3回対応可", nightBonus: 100 },
      { value: "available_minimal", label: "月1回程度なら対応可", nightBonus: 50 },
      { value: "not_available", label: "対応不可", nightBonus: 0 },
    ],
  },
  {
    id: "management_exp",
    phase: 2,
    label: "マネジメント経験について教えてください",
    type: "single_select",
    weight: 5,
    options: [
      { value: "department_head", label: "部長・診療科長経験あり", mgmtBonus: 200 },
      { value: "chief", label: "医長・主任経験あり", mgmtBonus: 100 },
      { value: "leader", label: "チームリーダー経験あり", mgmtBonus: 50 },
      { value: "none", label: "マネジメント経験なし", mgmtBonus: 0 },
    ],
  },
  {
    id: "special_skills",
    phase: 2,
    label: "お持ちの特殊スキル・付加価値を選択してください",
    type: "multi_select",
    weight: 6,
    options: [
      { value: "english", label: "英語での診療が可能", bonus: 100 },
      { value: "research", label: "臨床研究・論文実績が豊富", bonus: 80 },
      { value: "teaching", label: "指導医資格あり", bonus: 60 },
      { value: "digital", label: "医療DX・遠隔診療の経験", bonus: 80 },
      { value: "cosmetic", label: "自費診療（美容・AGA等）の経験", bonus: 150 },
      { value: "oriental", label: "漢方・東洋医学の知識", bonus: 50 },
      { value: "sports", label: "スポーツドクター資格", bonus: 60 },
      { value: "none", label: "特になし", bonus: 0 },
    ],
  },
  {
    id: "work_days",
    phase: 2,
    label: "週あたりの希望勤務日数を教えてください",
    type: "single_select",
    weight: 4,
    options: [
      { value: "6days", label: "週6日", daysMultiplier: 1.15 },
      { value: "5days", label: "週5日", daysMultiplier: 1.0 },
      { value: "4days", label: "週4日", daysMultiplier: 0.85 },
      { value: "3days", label: "週3日", daysMultiplier: 0.65 },
      { value: "2days_less", label: "週2日以下", daysMultiplier: 0.45 },
    ],
  },
  {
    id: "patient_following",
    phase: 2,
    label: "患者集客力・指名患者の有無を教えてください",
    type: "single_select",
    weight: 6,
    options: [
      { value: "strong", label: "指名患者が多く、転職先にも一定数ついてくる", followBonus: 200 },
      { value: "moderate", label: "一部の患者はついてくる見込み", followBonus: 100 },
      { value: "minimal", label: "特にない", followBonus: 0 },
    ],
  },
  {
    id: "urgency",
    phase: 2,
    label: "転職・キャリア変更の緊急度を教えてください",
    type: "single_select",
    weight: 2,
    options: [
      { value: "immediate", label: "すぐにでも（1ヶ月以内）", urgencyAdjust: -0.03 },
      { value: "soon", label: "3ヶ月以内", urgencyAdjust: 0 },
      { value: "half_year", label: "半年以内", urgencyAdjust: 0 },
      { value: "exploring", label: "情報収集中（1年以上先）", urgencyAdjust: 0.02 },
    ],
  },
];

export const PHASE1_QUESTIONS = QUESTIONS.filter((q) => q.phase === 1);
export const PHASE2_QUESTIONS = QUESTIONS.filter((q) => q.phase === 2);

// ============================================================
// 市場分布テーブル
// ============================================================

const MARKET_DISTRIBUTION: Record<string, { p10: number; p25: number; p50: number; p75: number; p90: number }> = {
  internal:     { p10: 900,  p25: 1100, p50: 1400, p75: 1700, p90: 2000 },
  ortho:        { p10: 1100, p25: 1400, p50: 1700, p75: 2100, p90: 2500 },
  derma:        { p10: 1000, p25: 1200, p50: 1500, p75: 1800, p90: 2200 },
  ophthal:      { p10: 1000, p25: 1300, p50: 1600, p75: 1900, p90: 2300 },
  obgyn:        { p10: 1100, p25: 1300, p50: 1600, p75: 2000, p90: 2400 },
  pediatrics:   { p10: 800,  p25: 1000, p50: 1300, p75: 1600, p90: 1900 },
  psych:        { p10: 900,  p25: 1100, p50: 1400, p75: 1700, p90: 2000 },
  dental:       { p10: 500,  p25: 700,  p50: 1000, p75: 1400, p90: 1800 },
  dental_oral:  { p10: 600,  p25: 800,  p50: 1200, p75: 1600, p90: 2000 },
  surgery:      { p10: 1200, p25: 1500, p50: 1800, p75: 2200, p90: 2700 },
  cardio:       { p10: 1100, p25: 1400, p50: 1700, p75: 2100, p90: 2500 },
  gastro:       { p10: 1000, p25: 1300, p50: 1600, p75: 2000, p90: 2400 },
  uro:          { p10: 1000, p25: 1300, p50: 1600, p75: 2000, p90: 2300 },
  radiology:    { p10: 1100, p25: 1400, p50: 1700, p75: 2100, p90: 2500 },
  anesthesia:   { p10: 1200, p25: 1500, p50: 1800, p75: 2200, p90: 2600 },
  plastic:      { p10: 1400, p25: 1800, p50: 2200, p75: 3000, p90: 4000 },
  rehab:        { p10: 800,  p25: 1000, p50: 1300, p75: 1600, p90: 1900 },
  emergency:    { p10: 1100, p25: 1400, p50: 1700, p75: 2100, p90: 2500 },
  ent:          { p10: 900,  p25: 1100, p50: 1400, p75: 1700, p90: 2000 },
  other:        { p10: 900,  p25: 1100, p50: 1400, p75: 1700, p90: 2000 },
};

// ============================================================
// ヘルパー関数
// ============================================================

function getOptionValue(questionId: string, answerValue: string, key: string): number {
  const question = QUESTIONS.find((q) => q.id === questionId);
  if (!question) return 0;
  const option = question.options.find((o) => o.value === answerValue);
  if (!option) return 0;
  return (option[key] as number) ?? 0;
}

function getMarketPosition(value: number, specialty: string): { label: string; percentile: number } {
  const dist = MARKET_DISTRIBUTION[specialty] || MARKET_DISTRIBUTION.other;
  if (value >= dist.p90) return { label: "上位10%", percentile: 90 };
  if (value >= dist.p75) return { label: "上位25%", percentile: 75 };
  if (value >= dist.p50) return { label: "中央値以上", percentile: 50 };
  if (value >= dist.p25) return { label: "中央値以下", percentile: 25 };
  return { label: "下位25%", percentile: 10 };
}

// ============================================================
// Phase 1 算出
// ============================================================

export function calculatePhase1(answers: Answers): { min: number; max: number } {
  const base = getOptionValue("specialty", answers.specialty as string, "baseScore");
  const expMultiplier = getOptionValue("experience_years", answers.experience_years as string, "multiplier");
  const areaMultiplier = getOptionValue("area", answers.area as string, "areaMultiplier");
  const styleMultiplier = getOptionValue("work_style", answers.work_style as string, "styleMultiplier");
  const certBonus = getOptionValue("board_cert", answers.board_cert as string, "certBonus");

  const withCert = base * expMultiplier * areaMultiplier * styleMultiplier + certBonus;

  const min = Math.round((withCert * 0.85) / 10) * 10;
  const max = Math.round((withCert * 1.15) / 10) * 10;

  return { min, max };
}

// ============================================================
// Phase 2 算出（最終結果）
// ============================================================

export function calculateFinalResult(answers: Answers): MarketValueResult {
  const phase1 = calculatePhase1(answers);
  const midpoint = (phase1.min + phase1.max) / 2;

  // Phase 2 ボーナス合算
  let totalBonus = 0;
  totalBonus += getOptionValue("procedure_skill", answers.procedure_skill as string, "skillBonus");
  totalBonus += getOptionValue("night_shift", answers.night_shift as string, "nightBonus");
  totalBonus += getOptionValue("management_exp", answers.management_exp as string, "mgmtBonus");
  totalBonus += getOptionValue("patient_following", answers.patient_following as string, "followBonus");

  // 特殊スキル（multi_select: 合算）
  const specialSkills = answers.special_skills as string[] | undefined;
  if (specialSkills && Array.isArray(specialSkills)) {
    for (const skill of specialSkills) {
      if (skill !== "none") {
        totalBonus += getOptionValue("special_skills", skill, "bonus");
      }
    }
  }

  const daysMultiplier = getOptionValue("work_days", answers.work_days as string, "daysMultiplier") || 1;
  const urgencyAdjust = getOptionValue("urgency", answers.urgency as string, "urgencyAdjust");

  const refined = (midpoint + totalBonus) * daysMultiplier * (1 + urgencyAdjust);

  const min = Math.round((refined * 0.92) / 10) * 10;
  const max = Math.round((refined * 1.08) / 10) * 10;
  const mid = Math.round(refined / 10) * 10;

  const specialty = answers.specialty as string;
  const position = getMarketPosition(mid, specialty);

  const factors = generateFactorAnalysis(answers);

  const ownerEstimate = calculateOwnerEstimate(mid, specialty);

  return {
    range: { min, max },
    midpoint: mid,
    position: position.label,
    positionPercentile: position.percentile,
    monthlyEquivalent: Math.round(mid / 12),
    hourlyEquivalent: Math.round((mid / 12 / 22 / 8) * 10000) / 10000 * 10000,
    factors,
    ownerEstimate,
  };
}

// ============================================================
// 要因分析
// ============================================================

function generateFactorAnalysis(answers: Answers): Factor[] {
  const factors: Factor[] = [];

  // 専門医資格
  const cert = answers.board_cert as string;
  if (cert === "subspecialist") {
    factors.push({ label: "サブスペシャルティ専門医", impact: "positive", amount: 200, description: "高度な専門性が評価され、年収+200万円程度の上乗せ効果" });
  } else if (cert === "multiple") {
    factors.push({ label: "複数の専門医資格", impact: "positive", amount: 250, description: "複数資格保有により、年収+250万円程度の上乗せ効果" });
  } else if (cert === "specialist_major") {
    factors.push({ label: "基本領域の専門医", impact: "positive", amount: 100, description: "専門医資格により、年収+100万円程度の上乗せ効果" });
  } else if (cert === "none") {
    factors.push({ label: "専門医資格なし", impact: "negative", amount: -100, description: "専門医資格保有者と比べ、年収に差が出る傾向があります" });
  }

  // 手技スキル
  const skill = answers.procedure_skill as string;
  if (skill === "advanced") {
    factors.push({ label: "高度な手術スキル", impact: "positive", amount: 300, description: "執刀医レベルの手技力は大きなプレミアム要素です" });
  } else if (skill === "intermediate") {
    factors.push({ label: "一般的な手技スキル", impact: "positive", amount: 150, description: "手術・手技が可能なことで市場価値が向上しています" });
  }

  // 当直
  const night = answers.night_shift as string;
  if (night === "available_frequent") {
    factors.push({ label: "当直対応（月4回以上）", impact: "positive", amount: 150, description: "積極的な当直対応で年収+150万円程度の効果" });
  } else if (night === "not_available") {
    factors.push({ label: "当直対応不可", impact: "negative", amount: -150, description: "当直対応可能な医師と比べ、年収-100〜150万円の差が出る傾向" });
  }

  // マネジメント
  const mgmt = answers.management_exp as string;
  if (mgmt === "department_head") {
    factors.push({ label: "部長・診療科長経験", impact: "positive", amount: 200, description: "マネジメント実績が年収+200万円程度の効果をもたらしています" });
  } else if (mgmt === "chief") {
    factors.push({ label: "医長・主任経験", impact: "positive", amount: 100, description: "管理職経験により年収+100万円程度の上乗せ効果" });
  }

  // 患者集客力
  const follow = answers.patient_following as string;
  if (follow === "strong") {
    factors.push({ label: "高い患者集客力", impact: "positive", amount: 200, description: "指名患者の多さはクリニックにとって大きな付加価値です" });
  }

  // 特殊スキル
  const specialSkills = answers.special_skills as string[] | undefined;
  if (specialSkills && Array.isArray(specialSkills)) {
    let skillTotal = 0;
    const skillLabels: string[] = [];
    for (const s of specialSkills) {
      if (s !== "none") {
        const bonus = getOptionValue("special_skills", s, "bonus");
        skillTotal += bonus;
        const opt = QUESTIONS.find((q) => q.id === "special_skills")?.options.find((o) => o.value === s);
        if (opt) skillLabels.push(opt.label);
      }
    }
    if (skillTotal > 0) {
      factors.push({
        label: `特殊スキル（${skillLabels.join("、")}）`,
        impact: "positive",
        amount: skillTotal,
        description: `付加価値のあるスキルにより年収+${skillTotal}万円程度の効果`,
      });
    }
  }

  // 勤務日数
  const days = answers.work_days as string;
  if (days === "3days" || days === "2days_less") {
    factors.push({ label: "勤務日数が少ない", impact: "negative", amount: -300, description: "週あたりの勤務日数が少ないため、年収は比例して減少します" });
  } else if (days === "6days") {
    factors.push({ label: "週6日勤務", impact: "positive", amount: 200, description: "週6日勤務で年収+15%程度のプレミアム" });
  }

  // エリア
  const area = answers.area as string;
  if (area === "rural") {
    factors.push({ label: "郡部・へき地勤務", impact: "positive", amount: 250, description: "医師不足エリアのため、高いプレミアムが付きます" });
  } else if (area === "tokyo_central") {
    factors.push({ label: "都心部勤務", impact: "positive", amount: 150, description: "東京都心部は生活コストが高い分、年収も高めに設定される傾向" });
  }

  // 緊急度
  const urgency = answers.urgency as string;
  if (urgency === "immediate") {
    factors.push({ label: "転職希望が緊急", impact: "negative", amount: -50, description: "急いでいると交渉余地が狭まり、年収がやや下がる傾向があります" });
  } else if (urgency === "exploring") {
    factors.push({ label: "余裕を持った転職活動", impact: "positive", amount: 30, description: "時間に余裕がある分、強気の交渉が可能です" });
  }

  return factors.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
}

// ============================================================
// 開業時の想定年収
// ============================================================

const OWNER_MULTIPLIERS: Record<string, number> = {
  dental: 1.5,
  dental_oral: 1.6,
  internal: 1.6,
  derma: 2.0,
  ophthal: 2.0,
  ortho: 1.8,
  plastic: 2.5,
  psych: 1.5,
  surgery: 1.7,
  cardio: 1.7,
  gastro: 1.7,
  uro: 1.7,
  ent: 1.6,
  obgyn: 1.7,
  pediatrics: 1.5,
  radiology: 1.6,
  anesthesia: 1.6,
  rehab: 1.5,
  emergency: 1.5,
  other: 1.7,
};

function calculateOwnerEstimate(
  employedMidpoint: number,
  specialty: string
): { min: number; max: number; note: string } {
  const multiplier = OWNER_MULTIPLIERS[specialty] || 1.7;
  const ownerEstimate = employedMidpoint * multiplier;

  return {
    min: Math.round((ownerEstimate * 0.8) / 10) * 10,
    max: Math.round((ownerEstimate * 1.2) / 10) * 10,
    note: "開業医の年収は立地・経営手腕により大きく変動します。あくまで参考値としてご覧ください。",
  };
}

// ============================================================
// 診療科ラベル取得
// ============================================================

export function getSpecialtyLabel(value: string): string {
  const opt = QUESTIONS[0].options.find((o) => o.value === value);
  return opt?.label ?? value;
}

// ============================================================
// 分布データの取得（ビジュアル用）
// ============================================================

export function getDistributionForSpecialty(specialty: string) {
  return MARKET_DISTRIBUTION[specialty] || MARKET_DISTRIBUTION.other;
}
