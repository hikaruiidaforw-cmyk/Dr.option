/**
 * 診療科マスタ
 */
export const DEPARTMENTS = [
  "内科",
  "循環器内科",
  "消化器内科",
  "呼吸器内科",
  "糖尿病内科",
  "腎臓内科",
  "神経内科",
  "血液内科",
  "外科",
  "消化器外科",
  "心臓血管外科",
  "呼吸器外科",
  "脳神経外科",
  "整形外科",
  "形成外科",
  "小児科",
  "産婦人科",
  "産科",
  "婦人科",
  "眼科",
  "耳鼻咽喉科",
  "皮膚科",
  "泌尿器科",
  "精神科",
  "心療内科",
  "放射線科",
  "麻酔科",
  "救急科",
  "リハビリテーション科",
  "病理診断科",
  "美容外科",
  "美容皮膚科",
  "歯科",
  "口腔外科",
  "総合診療科",
  "その他",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

/**
 * 都道府県マスタ
 */
export const PREFECTURES = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
] as const;

export type Prefecture = (typeof PREFECTURES)[number];

/**
 * 雇用形態マスタ
 */
export const EMPLOYMENT_TYPES = [
  "常勤",
  "非常勤",
  "アルバイト",
  "その他",
] as const;

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

/**
 * 法人種別マスタ
 */
export const CORPORATION_TYPES = [
  "医療法人社団",
  "医療法人財団",
  "社会医療法人",
  "特定医療法人",
  "個人",
  "その他",
] as const;

export type CorporationType = (typeof CORPORATION_TYPES)[number];

/**
 * 独立希望時期マスタ
 */
export const INDEPENDENCE_TIMELINES = [
  "1年以内",
  "1〜2年後",
  "3〜5年後",
  "5〜10年後",
  "10年以上先",
  "未定",
] as const;

export type IndependenceTimeline = (typeof INDEPENDENCE_TIMELINES)[number];

/**
 * 独立希望時期オプション（フォーム用）
 */
export const INDEPENDENCE_TIMELINE_OPTIONS = INDEPENDENCE_TIMELINES.map((timeline) => ({
  value: timeline,
  label: timeline,
}));

/**
 * 現職マスタ
 */
export const CURRENT_POSITIONS = [
  "常勤医師",
  "非常勤医師",
  "研修医",
  "フリーランス",
  "開業医",
  "その他",
] as const;

export type CurrentPosition = (typeof CURRENT_POSITIONS)[number];

/**
 * 応募ステータスラベル
 */
export const APPLICATION_STATUS_LABELS = {
  PENDING: "応募済み",
  REVIEWING: "審査中",
  INTERVIEW: "面談調整中",
  MATCHED: "マッチング成立",
  REJECTED: "不成立",
  WITHDRAWN: "応募取消",
} as const;

/**
 * スカウトステータスラベル
 */
export const SCOUT_STATUS_LABELS = {
  SENT: "送信済み",
  READ: "既読",
  INTERESTED: "興味あり",
  DECLINED: "辞退",
} as const;

/**
 * マッチングステータスラベル
 */
export const MATCH_STATUS_LABELS = {
  NEGOTIATING: "条件交渉中",
  CONTRACT_DRAFTING: "契約書作成中",
  EMPLOYED: "雇用開始",
  TRANSFER_READY: "譲渡手続き開始",
  COMPLETED: "事業承継完了",
  CANCELLED: "キャンセル",
} as const;

/**
 * 求人ステータスラベル
 */
export const JOB_POSTING_STATUS_LABELS = {
  DRAFT: "下書き",
  PUBLISHED: "公開中",
  CLOSED: "募集終了",
  ARCHIVED: "アーカイブ",
} as const;

/**
 * 通知タイプラベル
 */
export const NOTIFICATION_TYPE_LABELS = {
  NEW_APPLICATION: "新規応募",
  SCOUT_RECEIVED: "スカウト受信",
  STATUS_CHANGED: "ステータス変更",
  NEW_MESSAGE: "新着メッセージ",
  CONTRACT_READY: "契約書準備完了",
  SYSTEM: "システム通知",
} as const;

/**
 * ロール表示名
 */
export const ROLE_LABELS = {
  DOCTOR: "ドクター",
  CORPORATION: "医療法人",
  CONSULTANT: "コンサルタント",
  ADMIN: "管理者",
} as const;

/**
 * 性別ラベル
 */
export const GENDER_LABELS = {
  MALE: "男性",
  FEMALE: "女性",
  OTHER: "その他",
} as const;

/**
 * ページネーションデフォルト値
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * ルートパス
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DOCTOR: {
    DASHBOARD: "/doctor/dashboard",
    PROFILE: "/doctor/profile",
    JOBS: "/doctor/jobs",
    APPLICATIONS: "/doctor/applications",
    FAVORITES: "/doctor/favorites",
    SCOUTS: "/doctor/scouts",
    CHAT: "/doctor/chat",
    NOTIFICATIONS: "/doctor/notifications",
  },
  CORPORATION: {
    DASHBOARD: "/corporation/dashboard",
    PROFILE: "/corporation/profile",
    JOBS: "/corporation/jobs",
    APPLICANTS: "/corporation/applicants",
    DOCTORS: "/corporation/doctors",
    SCOUTS: "/corporation/scouts",
    CHAT: "/corporation/chat",
    CONTRACTS: "/corporation/contracts",
    NOTIFICATIONS: "/corporation/notifications",
  },
  CONSULTANT: {
    DASHBOARD: "/consultant/dashboard",
    MATCHES: "/consultant/matches",
    DOCTORS: "/consultant/doctors",
    CORPORATIONS: "/consultant/corporations",
    CONTRACTS: "/consultant/contracts",
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    JOBS: "/admin/jobs",
    MATCHES: "/admin/matches",
    SETTINGS: "/admin/settings",
  },
} as const;
