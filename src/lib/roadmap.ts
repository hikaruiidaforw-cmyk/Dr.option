// 承継ロードマップ 型定義とデータ

export interface RoadmapPhase {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  icon: string;
  color: string;
  tasks: RoadmapTask[];
  tips: string[];
  resources: RoadmapResource[];
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  estimatedTime?: string;
}

export interface RoadmapResource {
  title: string;
  type: "article" | "video" | "tool" | "consultation";
  url?: string;
}

export interface UserProgress {
  currentPhase: number;
  completedTasks: string[];
  startedAt?: Date;
  targetDate?: Date;
}

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: "phase-1",
    number: 1,
    title: "情報収集・自己分析",
    subtitle: "承継を検討し始める段階",
    description:
      "承継について理解を深め、自分のキャリアビジョンを明確にします。承継と新規開業の違い、メリット・デメリットを把握し、自分に合った選択肢を見極めましょう。",
    duration: "1〜3ヶ月",
    icon: "search",
    color: "blue",
    tasks: [
      {
        id: "1-1",
        title: "承継の基礎知識を学ぶ",
        description: "承継と新規開業の違い、M&Aの流れ、必要な資格や手続きについて理解する",
        priority: "high",
      },
      {
        id: "1-2",
        title: "自己分析を行う",
        description: "自分の強み・専門性、希望する診療スタイル、ライフプランを整理する",
        priority: "high",
      },
      {
        id: "1-3",
        title: "家族との相談",
        description: "承継の意向を家族と共有し、理解と協力を得る",
        priority: "medium",
      },
      {
        id: "1-4",
        title: "希望条件の整理",
        description: "希望エリア、診療科、規模、承継時期などの条件を明確にする",
        priority: "high",
      },
      {
        id: "1-5",
        title: "資金計画の概算",
        description: "現在の貯蓄、将来の収入見込み、必要な資金の概算を把握する",
        priority: "medium",
      },
    ],
    tips: [
      "承継は「買い物」ではなく「経営を引き継ぐ」という視点で考えましょう",
      "焦らず、十分な情報収集期間を設けることが成功の鍵です",
      "同じ道を歩んだ先輩医師の話を聞く機会を作りましょう",
    ],
    resources: [
      { title: "承継シミュレーター", type: "tool", url: "/doctor/simulator" },
      { title: "匿名Q&A", type: "tool", url: "/doctor/qa" },
      { title: "承継の基礎知識ガイド", type: "article" },
    ],
  },
  {
    id: "phase-2",
    number: 2,
    title: "案件探索・マッチング",
    subtitle: "承継先を探す段階",
    description:
      "具体的な承継案件を探し、自分の条件に合う候補を見つけます。複数の案件を比較検討し、最適な承継先を絞り込んでいきましょう。",
    duration: "3〜6ヶ月",
    icon: "target",
    color: "purple",
    tasks: [
      {
        id: "2-1",
        title: "マッチングサービスへ登録",
        description: "Dr.optionなどの承継マッチングサービスにプロフィールを登録する",
        priority: "high",
      },
      {
        id: "2-2",
        title: "案件の検索・応募",
        description: "条件に合う案件を検索し、興味のある案件に応募する",
        priority: "high",
      },
      {
        id: "2-3",
        title: "エリアの市場調査",
        description: "希望エリアの医療需要、競合状況、将来性を調査する",
        priority: "medium",
      },
      {
        id: "2-4",
        title: "スカウトへの対応",
        description: "届いたスカウトの内容を確認し、興味のある案件には返信する",
        priority: "medium",
      },
      {
        id: "2-5",
        title: "専門家への相談",
        description: "税理士、弁護士、M&Aコンサルタントなど専門家のネットワークを構築する",
        priority: "low",
      },
    ],
    tips: [
      "条件を絞りすぎず、複数の案件を比較検討しましょう",
      "数字だけでなく、現院長の人柄や承継理由も重要な判断材料です",
      "気になる案件には早めにアプローチすることをおすすめします",
    ],
    resources: [
      { title: "求人検索", type: "tool", url: "/doctor/jobs" },
      { title: "スカウト確認", type: "tool", url: "/doctor/scouts" },
      { title: "専門家相談の予約", type: "consultation" },
    ],
  },
  {
    id: "phase-3",
    number: 3,
    title: "面談・現地視察",
    subtitle: "候補先を詳しく知る段階",
    description:
      "興味のある案件について、現院長との面談や現地視察を行います。実際の診療環境やスタッフ、患者層を確認し、承継後のイメージを具体化します。",
    duration: "2〜4ヶ月",
    icon: "users",
    color: "green",
    tasks: [
      {
        id: "3-1",
        title: "現院長との面談",
        description: "承継の経緯、診療方針、患者層、スタッフ状況などをヒアリングする",
        priority: "high",
      },
      {
        id: "3-2",
        title: "現地視察の実施",
        description: "クリニックの設備、立地環境、周辺の医療機関を確認する",
        priority: "high",
      },
      {
        id: "3-3",
        title: "財務資料の確認",
        description: "決算書、患者数推移、売上構成などの財務データを分析する",
        priority: "high",
      },
      {
        id: "3-4",
        title: "スタッフとの面談",
        description: "看護師、事務スタッフと話し、職場の雰囲気を把握する",
        priority: "medium",
      },
      {
        id: "3-5",
        title: "条件交渉の準備",
        description: "承継価格、引き継ぎ期間、条件などの交渉ポイントを整理する",
        priority: "medium",
      },
    ],
    tips: [
      "見学は複数回行い、平日と週末など異なる時間帯も確認しましょう",
      "現院長との相性は長期的な関係性に影響するため、しっかり見極めを",
      "質問リストを事前に準備し、聞き漏らしがないようにしましょう",
    ],
    resources: [
      { title: "面談チェックリスト", type: "article" },
      { title: "財務分析の見方", type: "article" },
      { title: "メッセージ", type: "tool", url: "/doctor/chat" },
    ],
  },
  {
    id: "phase-4",
    number: 4,
    title: "条件交渉・デューデリジェンス",
    subtitle: "契約に向けた詳細確認の段階",
    description:
      "承継先が決まったら、詳細な条件交渉とデューデリジェンス（精査）を行います。専門家の支援を受けながら、リスクの洗い出しと対策を進めます。",
    duration: "2〜3ヶ月",
    icon: "clipboard",
    color: "orange",
    tasks: [
      {
        id: "4-1",
        title: "基本合意書の締結",
        description: "承継の基本条件について合意し、基本合意書（LOI）を締結する",
        priority: "high",
      },
      {
        id: "4-2",
        title: "デューデリジェンスの実施",
        description: "法務・財務・税務・労務の各面から詳細な調査を行う",
        priority: "high",
      },
      {
        id: "4-3",
        title: "資金調達の準備",
        description: "銀行融資の相談、必要書類の準備、審査対応を行う",
        priority: "high",
      },
      {
        id: "4-4",
        title: "承継価格の最終交渉",
        description: "デューデリジェンスの結果を踏まえ、最終的な価格を交渉する",
        priority: "high",
      },
      {
        id: "4-5",
        title: "引き継ぎ計画の策定",
        description: "承継後の引き継ぎスケジュール、役割分担を明確にする",
        priority: "medium",
      },
    ],
    tips: [
      "デューデリジェンスは必ず専門家（弁護士・税理士・社労士）に依頼しましょう",
      "発見された問題点は、契約条件や価格に反映させることが重要です",
      "融資審査には時間がかかるため、早めに動き出しましょう",
    ],
    resources: [
      { title: "デューデリジェンス解説", type: "article" },
      { title: "融資申請の流れ", type: "article" },
      { title: "専門家紹介サービス", type: "consultation" },
    ],
  },
  {
    id: "phase-5",
    number: 5,
    title: "契約締結・引き継ぎ準備",
    subtitle: "正式に契約を結ぶ段階",
    description:
      "最終的な契約を締結し、承継に向けた具体的な準備を進めます。各種届出や許認可の手続き、スタッフへの説明など、承継日に向けた準備を完了させます。",
    duration: "1〜2ヶ月",
    icon: "file-signature",
    color: "red",
    tasks: [
      {
        id: "5-1",
        title: "最終契約書の締結",
        description: "承継契約書、関連する各種契約書を締結する",
        priority: "high",
      },
      {
        id: "5-2",
        title: "資金決済の実行",
        description: "承継代金の支払い、融資の実行を完了する",
        priority: "high",
      },
      {
        id: "5-3",
        title: "届出・許認可手続き",
        description: "保健所、厚生局、医師会などへの届出を行う",
        priority: "high",
      },
      {
        id: "5-4",
        title: "スタッフへの説明",
        description: "承継について全スタッフに説明し、雇用条件を確認する",
        priority: "high",
      },
      {
        id: "5-5",
        title: "患者への告知準備",
        description: "院長交代の告知方法、タイミングを計画する",
        priority: "medium",
      },
    ],
    tips: [
      "契約書は必ず弁護士にリーガルチェックを依頼しましょう",
      "届出には期限があるものも多いため、スケジュール管理を徹底しましょう",
      "スタッフの不安を解消するため、丁寧なコミュニケーションを心がけましょう",
    ],
    resources: [
      { title: "届出先一覧チェックリスト", type: "article" },
      { title: "契約書サンプル", type: "article" },
      { title: "スタッフ説明会の進め方", type: "article" },
    ],
  },
  {
    id: "phase-6",
    number: 6,
    title: "承継実行・経営開始",
    subtitle: "新院長としてスタートする段階",
    description:
      "いよいよ承継が完了し、新院長として経営をスタートします。前院長からの引き継ぎを受けながら、患者やスタッフとの信頼関係を構築していきます。",
    duration: "3〜6ヶ月（安定期まで）",
    icon: "rocket",
    color: "teal",
    tasks: [
      {
        id: "6-1",
        title: "引き継ぎ診療の実施",
        description: "前院長と並行して診療を行い、患者との関係を構築する",
        priority: "high",
      },
      {
        id: "6-2",
        title: "スタッフマネジメント",
        description: "定期的な面談を行い、スタッフの不安や要望に対応する",
        priority: "high",
      },
      {
        id: "6-3",
        title: "患者コミュニケーション",
        description: "既存患者への挨拶、新院長としての診療方針を伝える",
        priority: "high",
      },
      {
        id: "6-4",
        title: "経営状況のモニタリング",
        description: "患者数、売上、経費などを定期的に確認し、課題を把握する",
        priority: "medium",
      },
      {
        id: "6-5",
        title: "改善計画の実行",
        description: "準備段階で計画した改善施策を段階的に実行する",
        priority: "low",
      },
    ],
    tips: [
      "最初の3ヶ月は大きな変更を避け、まずは現状維持に注力しましょう",
      "前院長が残る期間を有効活用し、患者情報をしっかり引き継ぎましょう",
      "困ったときは専門家やメンターに相談できる体制を整えておきましょう",
    ],
    resources: [
      { title: "経営ダッシュボード", type: "tool", url: "/doctor/dashboard" },
      { title: "承継後のよくある課題と解決策", type: "article" },
      { title: "経営相談サービス", type: "consultation" },
    ],
  },
];

// デフォルトの進捗状態
export const DEFAULT_PROGRESS: UserProgress = {
  currentPhase: 1,
  completedTasks: [],
  startedAt: new Date(),
};

// ヘルパー関数
export function getPhaseById(id: string): RoadmapPhase | undefined {
  return ROADMAP_PHASES.find((p) => p.id === id);
}

export function getPhaseByNumber(number: number): RoadmapPhase | undefined {
  return ROADMAP_PHASES.find((p) => p.number === number);
}

export function calculatePhaseProgress(
  phase: RoadmapPhase,
  completedTasks: string[]
): number {
  const phaseTasks = phase.tasks.map((t) => t.id);
  const completed = phaseTasks.filter((id) => completedTasks.includes(id)).length;
  return Math.round((completed / phaseTasks.length) * 100);
}

export function getOverallProgress(completedTasks: string[]): number {
  const totalTasks = ROADMAP_PHASES.reduce((sum, p) => sum + p.tasks.length, 0);
  return Math.round((completedTasks.length / totalTasks) * 100);
}

export function getPhaseColor(color: string): {
  bg: string;
  text: string;
  border: string;
  light: string;
} {
  const colors: Record<string, { bg: string; text: string; border: string; light: string }> = {
    blue: {
      bg: "bg-blue-500",
      text: "text-blue-600",
      border: "border-blue-500",
      light: "bg-blue-50",
    },
    purple: {
      bg: "bg-purple-500",
      text: "text-purple-600",
      border: "border-purple-500",
      light: "bg-purple-50",
    },
    green: {
      bg: "bg-green-500",
      text: "text-green-600",
      border: "border-green-500",
      light: "bg-green-50",
    },
    orange: {
      bg: "bg-orange-500",
      text: "text-orange-600",
      border: "border-orange-500",
      light: "bg-orange-50",
    },
    red: {
      bg: "bg-red-500",
      text: "text-red-600",
      border: "border-red-500",
      light: "bg-red-50",
    },
    teal: {
      bg: "bg-teal-500",
      text: "text-teal-600",
      border: "border-teal-500",
      light: "bg-teal-50",
    },
  };
  return colors[color] || colors.blue;
}
