import { type ClassValue, clsx } from "clsx";

/**
 * クラス名を結合するユーティリティ
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * 数値をフォーマット（カンマ区切り）
 */
export function formatNumber(num: number | null | undefined): string {
  if (num == null) return "－";
  return num.toLocaleString();
}

/**
 * 金額をフォーマット（万円表示）
 */
export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "－";
  return `${price.toLocaleString()}万円`;
}

/**
 * 金額レンジをフォーマット
 */
export function formatPriceRange(min: number | null | undefined, max: number | null | undefined): string {
  if (min == null && max == null) return "応相談";
  if (min == null) return `〜${max!.toLocaleString()}万円`;
  if (max == null) return `${min.toLocaleString()}万円〜`;
  if (min === max) return `${min.toLocaleString()}万円`;
  return `${min.toLocaleString()}〜${max.toLocaleString()}万円`;
}

/**
 * 日付をフォーマット（YYYY年MM月DD日）
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "－";
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 日時をフォーマット（YYYY年MM月DD日 HH:MM）
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "－";
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}

/**
 * 相対時間をフォーマット（○分前、○時間前など）
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  if (hours < 24) return `${hours}時間前`;
  if (days < 7) return `${days}日前`;

  return formatDate(d);
}

/**
 * 譲渡時期をフォーマット（○〜○年後）
 */
export function formatTransferTiming(min: number | null | undefined, max: number | null | undefined): string {
  if (min == null && max == null) return "応相談";
  if (min == null) return `〜${max}年後`;
  if (max == null) return `${min}年後〜`;
  if (min === max) return `${min}年後`;
  return `${min}〜${max}年後`;
}

/**
 * 文字列を切り詰める
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * 配列をシャッフル
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * ランダムな匿名名を生成（Dr.A, Dr.B, ...）
 */
export function generateDisplayName(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomIndex = Math.floor(Math.random() * letters.length);
  return `Dr.${letters[randomIndex]}`;
}

/**
 * APIエラーレスポンスを生成
 */
export function apiError(message: string, status: number = 400) {
  return Response.json({ error: message }, { status });
}

/**
 * APIサクセスレスポンスを生成
 */
export function apiSuccess<T>(data: T, status: number = 200) {
  return Response.json(data, { status });
}
