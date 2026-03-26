// 引き継ぎプランナー 型定義とデータ

export interface TransitionPlan {
  id: string;
  successorName: string;
  startDate: Date;
  transferDate: Date;
  currentPhase: number;
  phases: TransitionPhase[];
  milestones: Milestone[];
  tasks: TransitionTask[];
  notifications: NotificationItem[];
}

export interface TransitionPhase {
  id: string;
  number: number;
  title: string;
  description: string;
  startWeek: number; // 承継何週間前から
  endWeek: number;
  color: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: Date;
  phaseId: string;
  isCompleted: boolean;
  description: string;
}

export interface TransitionTask {
  id: string;
  phaseId: string;
  category: TaskCategory;
  title: string;
  description: string;
  assignee: "current" | "successor" | "both" | "staff" | "external";
  priority: "high" | "medium" | "low";
  dueWeek: number; // 承継何週間前まで
  isCompleted: boolean;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  target: "patients" | "staff" | "suppliers" | "government" | "insurance";
  title: string;
  description: string;
  deadline: string;
  templateAvailable: boolean;
  isCompleted: boolean;
}

export type TaskCategory =
  | "patient" // 患者対応
  | "staff" // スタッフ対応
  | "operation" // 業務引き継ぎ
  | "legal" // 法務・届出
  | "financial" // 財務・経理
  | "facility"; // 設備・システム

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  patient: "患者対応",
  staff: "スタッフ対応",
  operation: "業務引き継ぎ",
  legal: "法務・届出",
  financial: "財務・経理",
  facility: "設備・システム",
};

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  patient: "bg-blue-100 text-blue-700",
  staff: "bg-green-100 text-green-700",
  operation: "bg-purple-100 text-purple-700",
  legal: "bg-red-100 text-red-700",
  financial: "bg-yellow-100 text-yellow-700",
  facility: "bg-cyan-100 text-cyan-700",
};

export const ASSIGNEE_LABELS: Record<TransitionTask["assignee"], string> = {
  current: "現院長",
  successor: "後継者",
  both: "両者",
  staff: "スタッフ",
  external: "外部専門家",
};

// デフォルトのフェーズ定義
export const DEFAULT_PHASES: TransitionPhase[] = [
  {
    id: "phase-1",
    number: 1,
    title: "準備期間",
    description: "引き継ぎの準備と計画策定",
    startWeek: 12,
    endWeek: 9,
    color: "blue",
  },
  {
    id: "phase-2",
    number: 2,
    title: "告知期間",
    description: "スタッフ・患者への告知",
    startWeek: 8,
    endWeek: 5,
    color: "purple",
  },
  {
    id: "phase-3",
    number: 3,
    title: "並行診療期間",
    description: "後継者との並行診療",
    startWeek: 4,
    endWeek: 1,
    color: "green",
  },
  {
    id: "phase-4",
    number: 4,
    title: "引き継ぎ完了",
    description: "正式な承継と移行",
    startWeek: 0,
    endWeek: -4,
    color: "orange",
  },
];

// デフォルトのタスク定義
export const DEFAULT_TASKS: Omit<TransitionTask, "id" | "isCompleted" | "notes">[] = [
  // Phase 1: 準備期間
  {
    phaseId: "phase-1",
    category: "operation",
    title: "引き継ぎ計画書の作成",
    description: "全体スケジュール、役割分担、マイルストーンを明確化",
    assignee: "both",
    priority: "high",
    dueWeek: 12,
  },
  {
    phaseId: "phase-1",
    category: "patient",
    title: "患者データの整理",
    description: "カルテ情報、特記事項、注意患者リストの作成",
    assignee: "current",
    priority: "high",
    dueWeek: 11,
  },
  {
    phaseId: "phase-1",
    category: "operation",
    title: "業務マニュアルの更新",
    description: "診療フロー、予約システム、検査手順などを文書化",
    assignee: "current",
    priority: "medium",
    dueWeek: 10,
  },
  {
    phaseId: "phase-1",
    category: "financial",
    title: "財務状況の共有",
    description: "決算書、キャッシュフロー、経費構造の説明",
    assignee: "current",
    priority: "high",
    dueWeek: 10,
  },
  {
    phaseId: "phase-1",
    category: "staff",
    title: "スタッフ面談計画の策定",
    description: "全スタッフとの個別面談スケジュールを作成",
    assignee: "both",
    priority: "medium",
    dueWeek: 9,
  },
  {
    phaseId: "phase-1",
    category: "legal",
    title: "届出リストの確認",
    description: "必要な届出・申請の一覧と期限を確認",
    assignee: "external",
    priority: "high",
    dueWeek: 9,
  },

  // Phase 2: 告知期間
  {
    phaseId: "phase-2",
    category: "staff",
    title: "スタッフへの正式発表",
    description: "全体ミーティングで承継について説明",
    assignee: "both",
    priority: "high",
    dueWeek: 8,
  },
  {
    phaseId: "phase-2",
    category: "staff",
    title: "スタッフ個別面談の実施",
    description: "各スタッフと今後について話し合い、不安を解消",
    assignee: "both",
    priority: "high",
    dueWeek: 7,
  },
  {
    phaseId: "phase-2",
    category: "patient",
    title: "患者向け告知文の作成",
    description: "院内掲示用、配布用の告知文を準備",
    assignee: "both",
    priority: "high",
    dueWeek: 7,
  },
  {
    phaseId: "phase-2",
    category: "patient",
    title: "患者への告知開始",
    description: "院内掲示、来院患者への説明を開始",
    assignee: "current",
    priority: "high",
    dueWeek: 6,
  },
  {
    phaseId: "phase-2",
    category: "operation",
    title: "取引先への連絡",
    description: "医薬品卸、検査会社、その他取引先に通知",
    assignee: "current",
    priority: "medium",
    dueWeek: 6,
  },
  {
    phaseId: "phase-2",
    category: "legal",
    title: "保健所への届出準備",
    description: "開設届、変更届などの書類を準備",
    assignee: "external",
    priority: "high",
    dueWeek: 5,
  },

  // Phase 3: 並行診療期間
  {
    phaseId: "phase-3",
    category: "patient",
    title: "並行診療の開始",
    description: "後継者が現院長と一緒に診療を開始",
    assignee: "both",
    priority: "high",
    dueWeek: 4,
  },
  {
    phaseId: "phase-3",
    category: "patient",
    title: "重要患者の引き継ぎ",
    description: "特に配慮が必要な患者を個別に紹介",
    assignee: "both",
    priority: "high",
    dueWeek: 3,
  },
  {
    phaseId: "phase-3",
    category: "operation",
    title: "システム操作の習熟",
    description: "電子カルテ、レセプト、予約システムの操作確認",
    assignee: "successor",
    priority: "high",
    dueWeek: 3,
  },
  {
    phaseId: "phase-3",
    category: "facility",
    title: "設備・機器の確認",
    description: "医療機器の操作方法、メンテナンス契約の確認",
    assignee: "successor",
    priority: "medium",
    dueWeek: 2,
  },
  {
    phaseId: "phase-3",
    category: "legal",
    title: "保健所届出の提出",
    description: "開設届の提出、保険医療機関の届出",
    assignee: "external",
    priority: "high",
    dueWeek: 2,
  },
  {
    phaseId: "phase-3",
    category: "financial",
    title: "経理業務の引き継ぎ",
    description: "請求業務、支払い業務のフロー確認",
    assignee: "both",
    priority: "medium",
    dueWeek: 1,
  },

  // Phase 4: 引き継ぎ完了
  {
    phaseId: "phase-4",
    category: "legal",
    title: "正式な承継日",
    description: "契約に基づく正式な承継の実行",
    assignee: "both",
    priority: "high",
    dueWeek: 0,
  },
  {
    phaseId: "phase-4",
    category: "patient",
    title: "院長交代の最終告知",
    description: "院内掲示の更新、ホームページ更新",
    assignee: "successor",
    priority: "high",
    dueWeek: 0,
  },
  {
    phaseId: "phase-4",
    category: "operation",
    title: "緊急連絡体制の確立",
    description: "前院長への相談ルートを明確化",
    assignee: "both",
    priority: "medium",
    dueWeek: -1,
  },
  {
    phaseId: "phase-4",
    category: "staff",
    title: "フォローアップ面談",
    description: "承継後1ヶ月でスタッフと振り返り面談",
    assignee: "successor",
    priority: "medium",
    dueWeek: -4,
  },
];

// デフォルトの届出一覧
export const DEFAULT_NOTIFICATIONS: Omit<NotificationItem, "id" | "isCompleted">[] = [
  {
    target: "government",
    title: "保健所への届出",
    description: "診療所開設届、開設届出事項変更届",
    deadline: "承継日の10日前まで",
    templateAvailable: true,
  },
  {
    target: "insurance",
    title: "厚生局への届出",
    description: "保険医療機関指定申請、施設基準届出",
    deadline: "承継日の1ヶ月前まで",
    templateAvailable: true,
  },
  {
    target: "government",
    title: "医師会への届出",
    description: "会員変更届、入会申請（新院長）",
    deadline: "承継日の2週間前まで",
    templateAvailable: false,
  },
  {
    target: "patients",
    title: "患者への告知",
    description: "院長交代のお知らせ（院内掲示・配布）",
    deadline: "承継日の6週間前から",
    templateAvailable: true,
  },
  {
    target: "staff",
    title: "スタッフへの通知",
    description: "雇用契約の確認・更新",
    deadline: "承継日の8週間前まで",
    templateAvailable: true,
  },
  {
    target: "suppliers",
    title: "取引先への通知",
    description: "医薬品卸、検査会社、その他取引先",
    deadline: "承継日の6週間前まで",
    templateAvailable: true,
  },
];

// サンプルプラン生成
export function createSamplePlan(): TransitionPlan {
  const transferDate = new Date();
  transferDate.setMonth(transferDate.getMonth() + 3);

  const startDate = new Date();

  const tasks: TransitionTask[] = DEFAULT_TASKS.map((task, index) => ({
    ...task,
    id: `task-${index + 1}`,
    isCompleted: index < 3, // 最初の3つは完了済み
  }));

  const notifications: NotificationItem[] = DEFAULT_NOTIFICATIONS.map((n, index) => ({
    ...n,
    id: `notification-${index + 1}`,
    isCompleted: index === 0, // 最初の1つは完了済み
  }));

  const milestones: Milestone[] = [
    {
      id: "milestone-1",
      title: "引き継ぎ計画合意",
      date: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      phaseId: "phase-1",
      isCompleted: true,
      description: "引き継ぎ計画書の最終合意",
    },
    {
      id: "milestone-2",
      title: "スタッフ説明会",
      date: new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
      phaseId: "phase-2",
      isCompleted: false,
      description: "全スタッフへの正式発表",
    },
    {
      id: "milestone-3",
      title: "患者告知開始",
      date: new Date(startDate.getTime() + 42 * 24 * 60 * 60 * 1000),
      phaseId: "phase-2",
      isCompleted: false,
      description: "院内掲示・患者への説明開始",
    },
    {
      id: "milestone-4",
      title: "並行診療開始",
      date: new Date(startDate.getTime() + 56 * 24 * 60 * 60 * 1000),
      phaseId: "phase-3",
      isCompleted: false,
      description: "後継者との並行診療スタート",
    },
    {
      id: "milestone-5",
      title: "正式承継",
      date: transferDate,
      phaseId: "phase-4",
      isCompleted: false,
      description: "院長交代・正式な承継完了",
    },
  ];

  return {
    id: "plan-1",
    successorName: "山田 太郎 先生",
    startDate,
    transferDate,
    currentPhase: 1,
    phases: DEFAULT_PHASES,
    milestones,
    tasks,
    notifications,
  };
}

// ヘルパー関数
export function getPhaseProgress(
  phaseId: string,
  tasks: TransitionTask[]
): { completed: number; total: number; percentage: number } {
  const phaseTasks = tasks.filter((t) => t.phaseId === phaseId);
  const completed = phaseTasks.filter((t) => t.isCompleted).length;
  const total = phaseTasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

export function getOverallProgress(tasks: TransitionTask[]): number {
  const completed = tasks.filter((t) => t.isCompleted).length;
  return Math.round((completed / tasks.length) * 100);
}

export function getDaysUntilTransfer(transferDate: Date): number {
  const now = new Date();
  const diff = transferDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getWeeksUntilTransfer(transferDate: Date): number {
  return Math.ceil(getDaysUntilTransfer(transferDate) / 7);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function getPhaseColor(color: string): {
  bg: string;
  text: string;
  light: string;
  border: string;
} {
  const colors: Record<string, { bg: string; text: string; light: string; border: string }> = {
    blue: {
      bg: "bg-blue-500",
      text: "text-blue-600",
      light: "bg-blue-50",
      border: "border-blue-500",
    },
    purple: {
      bg: "bg-purple-500",
      text: "text-purple-600",
      light: "bg-purple-50",
      border: "border-purple-500",
    },
    green: {
      bg: "bg-green-500",
      text: "text-green-600",
      light: "bg-green-50",
      border: "border-green-500",
    },
    orange: {
      bg: "bg-orange-500",
      text: "text-orange-600",
      light: "bg-orange-50",
      border: "border-orange-500",
    },
  };
  return colors[color] || colors.blue;
}
