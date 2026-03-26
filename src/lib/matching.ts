// マッチ度スコア計算ロジック

export interface DoctorProfile {
  specialties: string[];
  desiredAreas: string[];
  independenceTimeline: string;
  minSalary?: number;
  maxSalary?: number;
  preferredWorkStyle?: string; // "フルタイム" | "週4日" | "週3日以下"
  managementExperience?: boolean;
}

export interface JobPosting {
  specialties: string[];
  area: string;
  transferTimeline: string;
  salaryMin: number;
  salaryMax: number;
  employmentType: string;
  requiresManagementExperience?: boolean;
}

export interface MatchResult {
  score: number; // 0-100
  reasons: MatchReason[];
  warnings: string[];
}

export interface MatchReason {
  label: string;
  score: number; // 各項目のスコア（0-100）
  matched: boolean;
  detail?: string;
}

// 独立時期のマッピング
const timelineOrder: Record<string, number> = {
  "すぐに": 0,
  "1年以内": 1,
  "1〜3年後": 2,
  "3〜5年後": 3,
  "5年以上先": 4,
  "未定": 5,
};

/**
 * ドクターと求人のマッチ度を計算
 */
export function calculateMatchScore(
  doctor: DoctorProfile,
  job: JobPosting
): MatchResult {
  const reasons: MatchReason[] = [];
  const warnings: string[] = [];

  // 1. 診療科目のマッチング (30点)
  const specialtyMatch = calculateSpecialtyMatch(doctor.specialties, job.specialties);
  reasons.push({
    label: "診療科目",
    score: specialtyMatch.score,
    matched: specialtyMatch.score >= 70,
    detail: specialtyMatch.detail,
  });

  // 2. エリアのマッチング (25点)
  const areaMatch = calculateAreaMatch(doctor.desiredAreas, job.area);
  reasons.push({
    label: "希望エリア",
    score: areaMatch.score,
    matched: areaMatch.score >= 70,
    detail: areaMatch.detail,
  });

  // 3. 独立時期のマッチング (20点)
  const timelineMatch = calculateTimelineMatch(
    doctor.independenceTimeline,
    job.transferTimeline
  );
  reasons.push({
    label: "承継時期",
    score: timelineMatch.score,
    matched: timelineMatch.score >= 70,
    detail: timelineMatch.detail,
  });

  // 4. 給与のマッチング (15点)
  const salaryMatch = calculateSalaryMatch(
    doctor.minSalary,
    doctor.maxSalary,
    job.salaryMin,
    job.salaryMax
  );
  reasons.push({
    label: "給与条件",
    score: salaryMatch.score,
    matched: salaryMatch.score >= 70,
    detail: salaryMatch.detail,
  });

  // 5. 勤務形態のマッチング (10点)
  const workStyleMatch = calculateWorkStyleMatch(
    doctor.preferredWorkStyle,
    job.employmentType
  );
  reasons.push({
    label: "勤務形態",
    score: workStyleMatch.score,
    matched: workStyleMatch.score >= 70,
    detail: workStyleMatch.detail,
  });

  // 重み付けスコア計算
  const weights = [0.30, 0.25, 0.20, 0.15, 0.10];
  const totalScore = Math.round(
    reasons.reduce((sum, reason, index) => sum + reason.score * weights[index], 0)
  );

  // 警告の追加
  if (job.requiresManagementExperience && !doctor.managementExperience) {
    warnings.push("この求人は管理経験が必要です");
  }

  if (specialtyMatch.score < 50) {
    warnings.push("診療科目が一致していません");
  }

  return {
    score: totalScore,
    reasons,
    warnings,
  };
}

function calculateSpecialtyMatch(
  doctorSpecialties: string[],
  jobSpecialties: string[]
): { score: number; detail: string } {
  if (!doctorSpecialties.length || !jobSpecialties.length) {
    return { score: 50, detail: "情報不足" };
  }

  const matches = doctorSpecialties.filter((s) =>
    jobSpecialties.some((js) => js.includes(s) || s.includes(js))
  );

  if (matches.length === 0) {
    return { score: 20, detail: "一致なし" };
  }

  const matchRate = matches.length / jobSpecialties.length;
  const score = Math.min(100, Math.round(matchRate * 100 + 20));

  return {
    score,
    detail: `${matches.join("、")}が一致`,
  };
}

function calculateAreaMatch(
  desiredAreas: string[],
  jobArea: string
): { score: number; detail: string } {
  if (!desiredAreas.length || !jobArea) {
    return { score: 50, detail: "情報不足" };
  }

  // 完全一致
  const exactMatch = desiredAreas.some(
    (area) => jobArea.includes(area) || area.includes(jobArea)
  );

  if (exactMatch) {
    return { score: 100, detail: "希望エリア内" };
  }

  // 同じ地方かチェック（簡易版）
  const regions: Record<string, string[]> = {
    関東: ["東京都", "神奈川県", "千葉県", "埼玉県", "茨城県", "栃木県", "群馬県"],
    関西: ["大阪府", "京都府", "兵庫県", "奈良県", "和歌山県", "滋賀県"],
    中部: ["愛知県", "静岡県", "岐阜県", "三重県", "長野県", "山梨県", "新潟県", "富山県", "石川県", "福井県"],
  };

  for (const [region, prefectures] of Object.entries(regions)) {
    const doctorInRegion = desiredAreas.some((a) =>
      prefectures.some((p) => a.includes(p))
    );
    const jobInRegion = prefectures.some((p) => jobArea.includes(p));

    if (doctorInRegion && jobInRegion) {
      return { score: 70, detail: `同じ${region}エリア` };
    }
  }

  return { score: 30, detail: "希望エリア外" };
}

function calculateTimelineMatch(
  doctorTimeline: string,
  jobTimeline: string
): { score: number; detail: string } {
  const doctorOrder = timelineOrder[doctorTimeline] ?? 3;
  const jobOrder = timelineOrder[jobTimeline] ?? 3;

  const diff = Math.abs(doctorOrder - jobOrder);

  if (diff === 0) {
    return { score: 100, detail: "時期が一致" };
  } else if (diff === 1) {
    return { score: 80, detail: "時期が近い" };
  } else if (diff === 2) {
    return { score: 50, detail: "時期にややズレあり" };
  } else {
    return { score: 20, detail: "時期が合わない可能性" };
  }
}

function calculateSalaryMatch(
  doctorMin?: number,
  doctorMax?: number,
  jobMin?: number,
  jobMax?: number
): { score: number; detail: string } {
  if (!jobMin || !jobMax) {
    return { score: 50, detail: "情報不足" };
  }

  if (!doctorMin && !doctorMax) {
    return { score: 70, detail: "希望条件なし" };
  }

  const min = doctorMin || 0;
  const max = doctorMax || Infinity;

  // 範囲が重なっているか
  if (jobMax >= min && jobMin <= max) {
    // 完全に範囲内
    if (jobMin >= min && jobMax <= max) {
      return { score: 100, detail: "希望範囲内" };
    }
    return { score: 80, detail: "条件に近い" };
  }

  // 範囲外だが近い
  const gap = Math.min(Math.abs(jobMax - min), Math.abs(jobMin - max));
  if (gap <= 200) {
    return { score: 50, detail: "やや条件外" };
  }

  return { score: 20, detail: "条件外" };
}

function calculateWorkStyleMatch(
  preferredStyle?: string,
  employmentType?: string
): { score: number; detail: string } {
  if (!preferredStyle || !employmentType) {
    return { score: 70, detail: "条件指定なし" };
  }

  const isFullTime = employmentType.includes("常勤") || employmentType.includes("フルタイム");

  if (preferredStyle === "フルタイム" && isFullTime) {
    return { score: 100, detail: "常勤希望と一致" };
  }

  if (preferredStyle === "週4日" && (isFullTime || employmentType.includes("週4"))) {
    return { score: 90, detail: "勤務日数が近い" };
  }

  if (preferredStyle === "週3日以下" && !isFullTime) {
    return { score: 80, detail: "非常勤対応可能" };
  }

  return { score: 50, detail: "要相談" };
}

/**
 * スコアに応じたラベルを取得
 */
export function getMatchLabel(score: number): {
  text: string;
  color: "high" | "medium" | "low";
} {
  if (score >= 80) {
    return { text: "非常に高い", color: "high" };
  } else if (score >= 60) {
    return { text: "高い", color: "high" };
  } else if (score >= 40) {
    return { text: "普通", color: "medium" };
  } else {
    return { text: "低い", color: "low" };
  }
}
