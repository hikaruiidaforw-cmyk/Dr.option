// 匿名Q&A 型定義とモックデータ

export interface Question {
  id: string;
  title: string;
  content: string;
  category: QuestionCategory;
  authorType: "doctor" | "corporation";
  createdAt: Date;
  viewCount: number;
  answerCount: number;
  helpfulCount: number;
  isResolved: boolean;
  tags: string[];
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  authorType: "doctor" | "corporation" | "consultant";
  authorLabel: string; // e.g., "承継経験者", "コンサルタント"
  createdAt: Date;
  helpfulCount: number;
  isBestAnswer: boolean;
}

export type QuestionCategory =
  | "financing" // 資金・ローン
  | "legal" // 法務・契約
  | "management" // 経営・運営
  | "staffing" // スタッフ・採用
  | "equipment" // 設備・機器
  | "location" // 立地・物件
  | "tax" // 税務・会計
  | "other"; // その他

export const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  financing: "資金・ローン",
  legal: "法務・契約",
  management: "経営・運営",
  staffing: "スタッフ・採用",
  equipment: "設備・機器",
  location: "立地・物件",
  tax: "税務・会計",
  other: "その他",
};

export const CATEGORY_COLORS: Record<QuestionCategory, string> = {
  financing: "bg-blue-100 text-blue-700",
  legal: "bg-purple-100 text-purple-700",
  management: "bg-green-100 text-green-700",
  staffing: "bg-orange-100 text-orange-700",
  equipment: "bg-cyan-100 text-cyan-700",
  location: "bg-pink-100 text-pink-700",
  tax: "bg-yellow-100 text-yellow-700",
  other: "bg-gray-100 text-gray-700",
};

// モックデータ
export const MOCK_QUESTIONS: Question[] = [
  {
    id: "1",
    title: "クリニック承継時の融資審査で重視されるポイントは？",
    content:
      "来年承継を予定していますが、銀行融資の審査で特に重視されるポイントを教えてください。自己資金は承継価格の20%程度を用意しています。医師としての勤務年数は12年です。",
    category: "financing",
    authorType: "doctor",
    createdAt: new Date("2024-01-15"),
    viewCount: 342,
    answerCount: 5,
    helpfulCount: 28,
    isResolved: true,
    tags: ["融資", "銀行", "審査"],
  },
  {
    id: "2",
    title: "承継後のスタッフ引き継ぎで気をつけることは？",
    content:
      "現院長から承継予定ですが、既存スタッフ（看護師3名、事務2名）の引き継ぎで注意すべき点はありますか？特に給与体系や雇用条件の変更について、どのように進めればよいでしょうか。",
    category: "staffing",
    authorType: "doctor",
    createdAt: new Date("2024-01-12"),
    viewCount: 256,
    answerCount: 4,
    helpfulCount: 19,
    isResolved: true,
    tags: ["スタッフ", "引き継ぎ", "雇用"],
  },
  {
    id: "3",
    title: "内科クリニックの適正な承継価格の目安は？",
    content:
      "都内の内科クリニック（1日患者数約50名、年間売上約1.2億円）の承継を検討しています。提示されている承継価格が妥当かどうか判断する基準を教えてください。",
    category: "financing",
    authorType: "doctor",
    createdAt: new Date("2024-01-10"),
    viewCount: 521,
    answerCount: 7,
    helpfulCount: 45,
    isResolved: false,
    tags: ["承継価格", "内科", "評価"],
  },
  {
    id: "4",
    title: "医療法人化のタイミングと手続きについて",
    content:
      "個人クリニックとして承継予定ですが、将来的に医療法人化を考えています。承継前と承継後、どちらのタイミングで法人化するのが良いでしょうか？メリット・デメリットを教えてください。",
    category: "legal",
    authorType: "doctor",
    createdAt: new Date("2024-01-08"),
    viewCount: 189,
    answerCount: 3,
    helpfulCount: 12,
    isResolved: false,
    tags: ["医療法人", "法人化", "手続き"],
  },
  {
    id: "5",
    title: "電子カルテの移行はどうすればいい？",
    content:
      "承継元のクリニックでは紙カルテを使用していますが、承継を機に電子カルテを導入したいと考えています。患者データの移行や導入コスト、おすすめのシステムがあれば教えてください。",
    category: "equipment",
    authorType: "doctor",
    createdAt: new Date("2024-01-05"),
    viewCount: 178,
    answerCount: 6,
    helpfulCount: 22,
    isResolved: true,
    tags: ["電子カルテ", "IT", "導入"],
  },
  {
    id: "6",
    title: "承継後の患者離れを防ぐには？",
    content:
      "院長交代による患者離れが心配です。特に長年通院されている高齢の患者さんが多いのですが、信頼関係を引き継ぐためにできることはありますか？",
    category: "management",
    authorType: "doctor",
    createdAt: new Date("2024-01-03"),
    viewCount: 412,
    answerCount: 8,
    helpfulCount: 56,
    isResolved: true,
    tags: ["患者", "信頼関係", "引き継ぎ"],
  },
];

export const MOCK_ANSWERS: Answer[] = [
  {
    id: "a1",
    questionId: "1",
    content:
      "銀行融資の審査では主に以下のポイントが重視されます：\n\n1. **自己資金比率**: 20%は最低ラインです。可能であれば30%以上あると有利です。\n\n2. **医師としての経験**: 12年の経験は十分です。特に専門医資格があればプラス評価されます。\n\n3. **承継先クリニックの収益性**: 過去3年分の決算書、患者数の推移が重要です。\n\n4. **事業計画の具体性**: 承継後の経営方針、改善計画が明確であることが求められます。\n\n私の場合は、日本政策金融公庫と地方銀行を併用して資金調達しました。",
    authorType: "doctor",
    authorLabel: "承継経験3年目",
    createdAt: new Date("2024-01-15"),
    helpfulCount: 15,
    isBestAnswer: true,
  },
  {
    id: "a2",
    questionId: "1",
    content:
      "追加でお伝えしますと、医療機関向けの融資に強い金融機関を選ぶことも重要です。\n\n特に日本政策金融公庫の「医療貸付」は金利が低く、返済期間も長く設定できるのでおすすめです。また、各地域の医師会と提携している信用金庫なども相談先として検討してみてください。",
    authorType: "consultant",
    authorLabel: "M&Aコンサルタント",
    createdAt: new Date("2024-01-16"),
    helpfulCount: 8,
    isBestAnswer: false,
  },
  {
    id: "a3",
    questionId: "2",
    content:
      "スタッフの引き継ぎは承継成功の鍵です。私の経験からアドバイスします：\n\n1. **早めのコミュニケーション**: 承継の3ヶ月前にはスタッフ全員と個別面談を実施しました。\n\n2. **雇用条件の維持**: 最初の1年は給与・待遇を維持することを明言しました。変更する場合は十分な説明期間を設けてください。\n\n3. **院長交代の引き継ぎ期間**: 可能であれば前院長に2-3ヶ月は残ってもらい、徐々に移行することをおすすめします。",
    authorType: "doctor",
    authorLabel: "承継経験5年目",
    createdAt: new Date("2024-01-13"),
    helpfulCount: 12,
    isBestAnswer: true,
  },
  {
    id: "a4",
    questionId: "6",
    content:
      "患者さんとの信頼関係構築について、実際に効果があった方法をお伝えします：\n\n1. **院長交代のお知らせ**: 承継2ヶ月前から院内掲示とお手紙で丁寧に告知しました。\n\n2. **前院長との並行診療**: 最初の1ヶ月は前院長と一緒に診察し、患者さんに紹介してもらいました。\n\n3. **カルテの徹底確認**: 特に長期通院の患者さんは既往歴だけでなく、生活背景もしっかり把握しました。\n\n4. **診療方針の継続**: 急な変更は避け、徐々に自分のスタイルを取り入れていきました。\n\n結果的に、患者数は承継後3ヶ月で95%を維持できました。",
    authorType: "doctor",
    authorLabel: "承継経験2年目",
    createdAt: new Date("2024-01-04"),
    helpfulCount: 34,
    isBestAnswer: true,
  },
];

// ヘルパー関数
export function getQuestionById(id: string): Question | undefined {
  return MOCK_QUESTIONS.find((q) => q.id === id);
}

export function getAnswersByQuestionId(questionId: string): Answer[] {
  return MOCK_ANSWERS.filter((a) => a.questionId === questionId).sort(
    (a, b) => {
      // Best answer first, then by helpful count
      if (a.isBestAnswer && !b.isBestAnswer) return -1;
      if (!a.isBestAnswer && b.isBestAnswer) return 1;
      return b.helpfulCount - a.helpfulCount;
    }
  );
}

export function getRelatedQuestions(
  questionId: string,
  limit: number = 3
): Question[] {
  const question = getQuestionById(questionId);
  if (!question) return [];

  return MOCK_QUESTIONS.filter(
    (q) => q.id !== questionId && q.category === question.category
  ).slice(0, limit);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "今日";
  if (diffDays === 1) return "昨日";
  if (diffDays < 7) return `${diffDays}日前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前`;
  return `${Math.floor(diffDays / 365)}年前`;
}
