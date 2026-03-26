// 先輩ドクターインタビュー 型定義とモックデータ

export interface Interview {
  id: string;
  doctorName: string;
  age: number;
  specialty: string;
  previousPosition: string;
  clinicName: string;
  clinicArea: string;
  transferYear: number;
  yearsAfterTransfer: number;
  thumbnailInitial: string;
  title: string;
  summary: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  publishedAt: Date;
  profile: DoctorProfile;
  timeline: TimelineEvent[];
  qanda: QandA[];
  advice: string[];
  numbers: KeyNumber[];
}

export interface DoctorProfile {
  medicalSchool: string;
  graduationYear: number;
  specializations: string[];
  careerPath: string;
  motivation: string;
}

export interface TimelineEvent {
  year: number;
  age: number;
  event: string;
  description: string;
}

export interface QandA {
  question: string;
  answer: string;
}

export interface KeyNumber {
  label: string;
  value: string;
  description: string;
}

// モックデータ
export const MOCK_INTERVIEWS: Interview[] = [
  {
    id: "1",
    doctorName: "佐藤先生",
    age: 45,
    specialty: "内科",
    previousPosition: "大学病院勤務医",
    clinicName: "さとう内科クリニック",
    clinicArea: "東京都世田谷区",
    transferYear: 2021,
    yearsAfterTransfer: 3,
    thumbnailInitial: "S",
    title: "大学病院から地域のかかりつけ医へ。40歳での決断と3年間の軌跡",
    summary: "15年間大学病院で勤務した後、40歳で内科クリニックを承継。地域医療への想いと、承継を決意するまでの葛藤、そして開業後の充実した日々について語っていただきました。",
    tags: ["内科", "40代", "大学病院から", "世田谷区"],
    viewCount: 1523,
    likeCount: 89,
    publishedAt: new Date("2024-01-10"),
    profile: {
      medicalSchool: "東京大学医学部",
      graduationYear: 2003,
      specializations: ["総合内科", "循環器内科"],
      careerPath: "大学病院で15年間勤務。専門医取得後、より患者に寄り添う医療を目指して承継を決意。",
      motivation: "大学病院では専門的な医療に従事していましたが、患者さんの生活全体を診る「かかりつけ医」になりたいという想いが強くなりました。",
    },
    timeline: [
      { year: 2003, age: 25, event: "医師免許取得", description: "東京大学医学部卒業、初期研修開始" },
      { year: 2005, age: 27, event: "大学病院入局", description: "循環器内科を専攻、専門医を目指す" },
      { year: 2010, age: 32, event: "専門医取得", description: "循環器専門医を取得、外来・病棟を担当" },
      { year: 2018, age: 40, event: "承継を検討開始", description: "Dr.optionに登録、情報収集を開始" },
      { year: 2020, age: 42, event: "承継先決定", description: "世田谷区の内科クリニックとマッチング" },
      { year: 2021, age: 43, event: "承継完了", description: "前院長から引き継ぎ、経営をスタート" },
    ],
    qanda: [
      {
        question: "承継を決意したきっかけは何でしたか？",
        answer: "40歳を迎えた頃、このまま大学病院で過ごすのか、違う道を歩むのか真剣に考えました。患者さん一人ひとりと長く付き合える医療がしたいという想いが強くなり、開業を決意しました。新規開業も考えましたが、すでに患者さんがいて、スタッフもいる承継の方が、スムーズにスタートできると考えました。",
      },
      {
        question: "承継で最も大変だったことは？",
        answer: "前院長の診療スタイルと自分のスタイルの違いをどう埋めるかですね。患者さんは前院長に慣れていますから、急に変えるわけにはいきません。最初の半年は前院長のやり方を踏襲しながら、少しずつ自分のカラーを出していきました。スタッフとの信頼関係構築も重要でした。",
      },
      {
        question: "承継して良かったと思うことは？",
        answer: "患者さんとの距離が近くなったことです。大学病院では数分の診察でしたが、今は患者さんの生活背景まで理解して診療できます。「先生に診てもらえて安心」と言われると、承継して本当に良かったと思います。経営面でも、初年度から黒字で運営できているのは承継の大きなメリットですね。",
      },
    ],
    advice: [
      "焦らず、じっくり情報収集することが大切です。私は2年かけて準備しました。",
      "前院長との相性は重要。引き継ぎ期間中に何度も話し合いの機会を持ちましょう。",
      "スタッフを味方につけることが成功の鍵。彼らは患者さんとクリニックをよく知っています。",
      "最初から完璧を目指さない。まずは前院長のやり方を学び、徐々に自分のスタイルを築いていけばいい。",
    ],
    numbers: [
      { label: "準備期間", value: "2年", description: "情報収集から承継完了まで" },
      { label: "承継価格", value: "6,000万円", description: "設備・営業権含む" },
      { label: "初年度売上", value: "1.2億円", description: "前年比105%" },
      { label: "患者維持率", value: "95%", description: "承継後1年時点" },
    ],
  },
  {
    id: "2",
    doctorName: "田中先生",
    age: 38,
    specialty: "皮膚科",
    previousPosition: "美容クリニック勤務医",
    clinicName: "たなか皮膚科・美容皮膚科",
    clinicArea: "神奈川県横浜市",
    transferYear: 2022,
    yearsAfterTransfer: 2,
    thumbnailInitial: "T",
    title: "美容クリニック勤務から独立。35歳で掴んだ自分らしい医療の形",
    summary: "美容クリニックで経験を積んだ後、35歳で皮膚科クリニックを承継。保険診療と自費診療のバランス、女性医師としての働き方について語っていただきました。",
    tags: ["皮膚科", "30代", "女性医師", "横浜市"],
    viewCount: 2341,
    likeCount: 156,
    publishedAt: new Date("2024-01-05"),
    profile: {
      medicalSchool: "慶應義塾大学医学部",
      graduationYear: 2010,
      specializations: ["皮膚科", "美容皮膚科"],
      careerPath: "大学病院で皮膚科専門医取得後、美容クリニックで5年間勤務。独立を目指し承継を選択。",
      motivation: "雇われ院長ではなく、自分の理想とする医療を実現したかった。保険診療をベースに、美容皮膚科も提供するクリニックを作りたいと思いました。",
    },
    timeline: [
      { year: 2010, age: 26, event: "医師免許取得", description: "慶應義塾大学医学部卒業" },
      { year: 2015, age: 31, event: "専門医取得", description: "皮膚科専門医を取得" },
      { year: 2016, age: 32, event: "美容クリニック転職", description: "美容皮膚科の技術を習得" },
      { year: 2021, age: 35, event: "承継を検討開始", description: "独立を視野にクリニック探しを開始" },
      { year: 2022, age: 36, event: "承継完了", description: "横浜市の皮膚科クリニックを承継" },
    ],
    qanda: [
      {
        question: "女性医師として承継で工夫したことは？",
        answer: "ワークライフバランスを重視しました。承継なら最初から患者さんとスタッフがいるので、自分のペースで働けます。診療時間も前院長より少し短縮し、その分、一人ひとりの患者さんに丁寧に向き合う時間を確保しています。",
      },
      {
        question: "美容皮膚科を加えた経緯は？",
        answer: "承継したクリニックは保険診療のみでしたが、私の強みである美容皮膚科を加えることで差別化を図りました。既存の患者さんには丁寧に説明し、興味のある方には自費診療もご案内しています。売上の3割が美容部門になり、経営も安定しています。",
      },
      {
        question: "承継価格の交渉はどうでしたか？",
        answer: "最初の提示価格から15%ほど交渉で下げることができました。デューデリジェンスで設備の老朽化が分かったので、その分を価格に反映してもらいました。専門家のサポートを受けることをおすすめします。",
      },
    ],
    advice: [
      "女性医師こそ承継がおすすめ。ゼロからの開業より、ライフイベントとの両立がしやすい。",
      "自分の強みを活かせる承継先を選ぶこと。私の場合は美容皮膚科の経験でした。",
      "デューデリジェンスは手を抜かない。後から問題が見つかると大変です。",
      "スタッフの中にキーパーソンを見つけること。私は看護師長との信頼関係が成功の鍵でした。",
    ],
    numbers: [
      { label: "準備期間", value: "1.5年", description: "検討開始から承継まで" },
      { label: "承継価格", value: "4,500万円", description: "交渉後の最終価格" },
      { label: "美容部門売上", value: "30%", description: "全体売上に占める割合" },
      { label: "1日患者数", value: "45名", description: "承継前35名から増加" },
    ],
  },
  {
    id: "3",
    doctorName: "山田先生",
    age: 52,
    specialty: "整形外科",
    previousPosition: "総合病院部長",
    clinicName: "やまだ整形外科リハビリクリニック",
    clinicArea: "埼玉県さいたま市",
    transferYear: 2019,
    yearsAfterTransfer: 5,
    thumbnailInitial: "Y",
    title: "病院部長から開業医へ。50歳からの第二のキャリアを選んだ理由",
    summary: "総合病院の整形外科部長を経て、50歳で整形外科クリニックを承継。病院勤務医としてのキャリアに区切りをつけ、地域医療に貢献する道を選んだ経緯を語っていただきました。",
    tags: ["整形外科", "50代", "病院部長から", "さいたま市"],
    viewCount: 987,
    likeCount: 67,
    publishedAt: new Date("2023-12-20"),
    profile: {
      medicalSchool: "東北大学医学部",
      graduationYear: 1996,
      specializations: ["整形外科", "スポーツ医学", "リハビリテーション"],
      careerPath: "総合病院で20年以上勤務、部長職を経験。手術中心の医療から、リハビリを含む包括的な医療を目指して承継を決意。",
      motivation: "病院では手術が中心でしたが、患者さんのその後の生活まで診たいと思うようになりました。リハビリを充実させたクリニックを作りたかったのです。",
    },
    timeline: [
      { year: 1996, age: 28, event: "医師免許取得", description: "東北大学医学部卒業" },
      { year: 2005, age: 37, event: "専門医取得", description: "整形外科専門医、スポーツ医を取得" },
      { year: 2015, age: 47, event: "部長就任", description: "総合病院整形外科部長に就任" },
      { year: 2018, age: 50, event: "承継を検討", description: "セカンドキャリアとして開業を検討" },
      { year: 2019, age: 51, event: "承継完了", description: "さいたま市の整形外科クリニックを承継" },
    ],
    qanda: [
      {
        question: "50歳での転身に不安はありませんでしたか？",
        answer: "正直ありました。病院では部長として安定した立場でしたから。でも、60歳を過ぎてからでは体力的にも厳しいと思いました。50歳なら、あと20年は現役で働ける。長期的に考えて、今がベストなタイミングだと判断しました。",
      },
      {
        question: "病院とクリニックの違いで驚いたことは？",
        answer: "経営者としての責任の重さですね。病院では医療に集中できましたが、クリニックでは人事、経理、設備管理まで全て自分の責任。最初は戸惑いましたが、税理士や社労士のサポートを受けながら、経営も学んでいきました。今では経営も医療の一部だと感じています。",
      },
      {
        question: "リハビリ部門を強化した理由は？",
        answer: "整形外科は手術だけでなく、その後のリハビリが重要です。病院時代、術後のリハビリを十分に提供できないもどかしさがありました。承継後、理学療法士を増員し、リハビリ室を拡張。今では「リハビリが充実している」と評判になり、近隣の病院からの紹介も増えています。",
      },
    ],
    advice: [
      "50代からでも遅くない。むしろ経験とネットワークを活かせる良いタイミング。",
      "病院での人脈を大切に。私は今でも元同僚から患者紹介を受けています。",
      "自分の強みを伸ばす投資を惜しまない。リハビリ設備への投資は回収できています。",
      "経営は専門家に任せる部分と、自分で把握する部分を明確に分けること。",
    ],
    numbers: [
      { label: "準備期間", value: "1年", description: "決意から承継まで" },
      { label: "承継価格", value: "5,500万円", description: "設備投資含む" },
      { label: "リハビリ患者", value: "月200名", description: "承継前の2倍に" },
      { label: "病院紹介率", value: "25%", description: "新患の4分の1" },
    ],
  },
  {
    id: "4",
    doctorName: "鈴木先生",
    age: 42,
    specialty: "小児科",
    previousPosition: "小児専門病院勤務医",
    clinicName: "すずきこどもクリニック",
    clinicArea: "千葉県船橋市",
    transferYear: 2020,
    yearsAfterTransfer: 4,
    thumbnailInitial: "S",
    title: "子育てしながらの承継。小児科医が選んだワークライフバランス",
    summary: "2児の母として小児専門病院に勤務しながら、38歳で小児科クリニックを承継。子育てと仕事の両立、地域の子どもたちを診る喜びについて語っていただきました。",
    tags: ["小児科", "30代", "女性医師", "子育て両立", "船橋市"],
    viewCount: 1876,
    likeCount: 134,
    publishedAt: new Date("2023-12-15"),
    profile: {
      medicalSchool: "千葉大学医学部",
      graduationYear: 2008,
      specializations: ["小児科", "小児アレルギー"],
      careerPath: "小児専門病院で10年勤務。出産・育児を経て、家庭との両立を考え承継を決意。",
      motivation: "病院の当直や急患対応と育児の両立に限界を感じていました。自分のペースで働きながら、地域の子どもたちを診たいと思いました。",
    },
    timeline: [
      { year: 2008, age: 26, event: "医師免許取得", description: "千葉大学医学部卒業" },
      { year: 2014, age: 32, event: "第一子出産", description: "産休・育休を取得" },
      { year: 2016, age: 34, event: "第二子出産", description: "時短勤務で復帰" },
      { year: 2019, age: 37, event: "承継を検討", description: "働き方を見直し、承継を検討開始" },
      { year: 2020, age: 38, event: "承継完了", description: "船橋市の小児科クリニックを承継" },
    ],
    qanda: [
      {
        question: "子育て中の承継で大変だったことは？",
        answer: "準備期間が限られていたことですね。子どもが小さいので、週末に物件を見に行ったり、セミナーに参加したりする時間を確保するのが大変でした。夫の協力と、両親のサポートがなければ実現できませんでした。",
      },
      {
        question: "クリニックの診療時間はどうしていますか？",
        answer: "18時終わりにして、子どものお迎えに間に合うようにしています。前院長は19時までやっていましたが、思い切って変更しました。最初は患者さんが減るか心配でしたが、むしろ同じ子育て世代のお母さんから「早い時間に受診できて助かる」と好評です。",
      },
      {
        question: "小児科の承継で気をつけたことは？",
        answer: "子どもは先生の顔を覚えていますから、できるだけスムーズに移行することを心がけました。前院長に3ヶ月間残ってもらい、一緒に診察することで、子どもたちに「新しい先生」として受け入れてもらえました。今では「すずき先生」と呼んでくれる子がほとんどです。",
      },
    ],
    advice: [
      "子育て中だからこそ承継がおすすめ。自分で診療時間を決められるのは大きなメリット。",
      "家族のサポート体制を事前に整えておくこと。準備期間中も開業後も必要です。",
      "同じ境遇の先輩医師に相談すること。私もDr.optionで出会った先輩に助けられました。",
      "完璧を目指さない。子どもの病気などで休むこともある。スタッフとの信頼関係が大切。",
    ],
    numbers: [
      { label: "診療時間", value: "9-18時", description: "お迎えに間に合う時間設定" },
      { label: "承継価格", value: "3,800万円", description: "好条件で交渉成立" },
      { label: "患者数", value: "1日50名", description: "予約制でスムーズに" },
      { label: "有給取得", value: "年15日", description: "子どもの行事に参加" },
    ],
  },
];

// ヘルパー関数
export function getInterviewById(id: string): Interview | undefined {
  return MOCK_INTERVIEWS.find((interview) => interview.id === id);
}

export function getInterviewsBySpecialty(specialty: string): Interview[] {
  return MOCK_INTERVIEWS.filter((interview) => interview.specialty === specialty);
}

export function getInterviewsByTag(tag: string): Interview[] {
  return MOCK_INTERVIEWS.filter((interview) => interview.tags.includes(tag));
}

export function getRelatedInterviews(id: string, limit: number = 2): Interview[] {
  const current = getInterviewById(id);
  if (!current) return [];

  return MOCK_INTERVIEWS
    .filter((interview) => interview.id !== id)
    .filter(
      (interview) =>
        interview.specialty === current.specialty ||
        interview.tags.some((tag) => current.tags.includes(tag))
    )
    .slice(0, limit);
}

export function formatPublishedDate(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
