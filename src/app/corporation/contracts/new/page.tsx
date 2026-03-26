"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Building2,
  Users,
  Calendar,
  Banknote,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

// Mock data for demonstration
const MOCK_CONTRACT_DATA = {
  doctor: {
    id: "1",
    displayName: "Dr.A",
    realName: "山田 太郎",
    medicalLicenseNumber: "医籍登録番号 第123456号",
    address: "東京都渋谷区...",
  },
  corporation: {
    corporationName: "医療法人社団健康会",
    representativeName: "田中 一郎",
    address: "東京都千代田区丸の内1-1-1",
    clinicName: "健康会内科クリニック",
  },
  job: {
    title: "内科クリニック 管理医師募集（承継前提）",
    employmentType: "常勤",
  },
};

function NewContractPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = React.useState({
    // 基本情報
    doctorName: MOCK_CONTRACT_DATA.doctor.realName,
    corporationName: MOCK_CONTRACT_DATA.corporation.corporationName,
    representativeName: MOCK_CONTRACT_DATA.corporation.representativeName,
    clinicName: MOCK_CONTRACT_DATA.corporation.clinicName,
    clinicAddress: MOCK_CONTRACT_DATA.corporation.address,

    // 契約条件
    employmentStartDate: "",
    contractPeriod: "期間の定めなし",
    probationPeriod: "3ヶ月",

    // 勤務条件
    workLocation: MOCK_CONTRACT_DATA.corporation.address,
    workDays: "月曜日〜金曜日",
    workHours: "9:00〜18:00（休憩1時間）",
    holidays: "土日祝日、年末年始、夏季休暇",

    // 給与条件
    baseSalary: "2000",
    bonusDescription: "年2回（6月・12月）業績に応じて支給",
    allowances: "通勤手当（実費支給、月額上限5万円）、住宅手当（月額5万円）",

    // 承継条件
    transferPrice: "8000",
    transferTiming: "雇用開始から3年後を目処",
    transferConditions: "勤務実績および経営状況を勘案の上、双方合意により決定",

    // その他
    insurances: "健康保険、厚生年金、雇用保険、労災保険",
    retirement: "勤続3年以上で退職金制度適用",
    otherTerms: "",
  });

  const [showPreview, setShowPreview] = React.useState(false);

  // Pre-fill doctor name from URL if provided
  React.useEffect(() => {
    const doctorName = searchParams.get("doctorName");
    if (doctorName) {
      setFormData((prev) => ({ ...prev, doctorName: decodeURIComponent(doctorName) }));
    }
  }, [searchParams]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateContract = () => {
    setShowPreview(true);
  };

  const handleDownload = () => {
    // Generate contract text
    const contractText = generateContractText();

    // Create blob and download
    const blob = new Blob([contractText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `雇用契約書_${formData.doctorName}_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateContractText = () => {
    return `
雇用契約書

${formData.corporationName}（以下「甲」という）と${formData.doctorName}（以下「乙」という）は、以下のとおり雇用契約を締結する。

第1条（目的）
甲は乙を医師として雇用し、乙は甲の指揮命令に従い誠実に業務を遂行する。

第2条（勤務地）
乙の勤務地は以下のとおりとする。
勤務地：${formData.workLocation}
勤務先名称：${formData.clinicName}

第3条（契約期間）
${formData.contractPeriod}
試用期間：${formData.probationPeriod}

第4条（就業時間）
1. 勤務日：${formData.workDays}
2. 勤務時間：${formData.workHours}
3. 休日：${formData.holidays}

第5条（給与）
1. 基本年俸：${formatNumber(Number(formData.baseSalary))}万円（月額${formatNumber(Math.round(Number(formData.baseSalary) / 12))}万円）
2. 賞与：${formData.bonusDescription}
3. 諸手当：${formData.allowances}
4. 給与支払日：毎月末日締め、翌月25日支払い

第6条（社会保険等）
${formData.insurances}

第7条（退職金）
${formData.retirement}

第8条（承継に関する特約）
1. 承継価格：${formatNumber(Number(formData.transferPrice))}万円を目安とする
2. 承継時期：${formData.transferTiming}
3. 承継条件：${formData.transferConditions}

第9条（秘密保持）
乙は、在職中および退職後においても、業務上知り得た甲の機密情報を第三者に漏洩してはならない。

第10条（競業避止）
乙は、退職後2年間、甲の事前の書面による承諾なく、同一市区町村内において競合する医療機関を開設または勤務してはならない。ただし、本契約に基づく承継の場合はこの限りではない。

第11条（契約の解除）
甲または乙は、相手方に重大な契約違反があった場合、書面による通知をもって本契約を解除することができる。

第12条（協議事項）
本契約に定めのない事項または疑義が生じた場合は、甲乙誠意をもって協議し解決する。

${formData.otherTerms ? `第13条（その他特約事項）\n${formData.otherTerms}\n\n` : ""}

本契約締結の証として、本書2通を作成し、甲乙記名押印の上、各1通を保有する。

契約締結日：令和　　年　　月　　日

甲（使用者）
住所：${formData.clinicAddress}
名称：${formData.corporationName}
代表者：${formData.representativeName}　　　　印

乙（労働者）
住所：
氏名：${formData.doctorName}　　　　印
`.trim();
  };

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="small" onClick={() => setShowPreview(false)}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            編集に戻る
          </Button>
        </div>

        <PageHeader
          title="契約書プレビュー"
          description="内容を確認してダウンロードしてください"
          actions={
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              ダウンロード
            </Button>
          }
        />

        <Card>
          <CardContent className="pt-6">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {generateContractText()}
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="small" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          戻る
        </Button>
      </div>

      <PageHeader
        title="雇用契約書作成"
        description="契約条件を入力して契約書のたたき台を作成します"
      />

      {/* Contract Parties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            契約当事者
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-ink-muted block mb-1">
                法人名（甲）
              </label>
              <Input
                value={formData.corporationName}
                onChange={(e) => handleChange("corporationName", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-ink-muted block mb-1">
                代表者名
              </label>
              <Input
                value={formData.representativeName}
                onChange={(e) => handleChange("representativeName", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-ink-muted block mb-1">
                クリニック名
              </label>
              <Input
                value={formData.clinicName}
                onChange={(e) => handleChange("clinicName", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-ink-muted block mb-1">
                医師名（乙）
              </label>
              <Input
                value={formData.doctorName}
                onChange={(e) => handleChange("doctorName", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employment Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            雇用条件
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-ink-muted block mb-1">
                雇用開始日
              </label>
              <Input
                type="date"
                value={formData.employmentStartDate}
                onChange={(e) => handleChange("employmentStartDate", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-ink-muted block mb-1">
                契約期間
              </label>
              <Input
                value={formData.contractPeriod}
                onChange={(e) => handleChange("contractPeriod", e.target.value)}
                placeholder="例：期間の定めなし"
              />
            </div>
            <div>
              <label className="text-sm text-ink-muted block mb-1">
                試用期間
              </label>
              <Input
                value={formData.probationPeriod}
                onChange={(e) => handleChange("probationPeriod", e.target.value)}
                placeholder="例：3ヶ月"
              />
            </div>
            <div>
              <label className="text-sm text-ink-muted block mb-1">
                勤務地
              </label>
              <Input
                value={formData.workLocation}
                onChange={(e) => handleChange("workLocation", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-ink-muted block mb-1">
                勤務日
              </label>
              <Input
                value={formData.workDays}
                onChange={(e) => handleChange("workDays", e.target.value)}
                placeholder="例：月曜日〜金曜日"
              />
            </div>
            <div>
              <label className="text-sm text-ink-muted block mb-1">
                勤務時間
              </label>
              <Input
                value={formData.workHours}
                onChange={(e) => handleChange("workHours", e.target.value)}
                placeholder="例：9:00〜18:00（休憩1時間）"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-ink-muted block mb-1">
              休日
            </label>
            <Input
              value={formData.holidays}
              onChange={(e) => handleChange("holidays", e.target.value)}
              placeholder="例：土日祝日、年末年始、夏季休暇"
            />
          </div>
        </CardContent>
      </Card>

      {/* Salary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5" />
            給与条件
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-ink-muted block mb-1">
                基本年俸（万円）
              </label>
              <Input
                type="number"
                value={formData.baseSalary}
                onChange={(e) => handleChange("baseSalary", e.target.value)}
              />
              {formData.baseSalary && (
                <p className="text-caption text-ink-muted mt-1">
                  月額約 {formatNumber(Math.round(Number(formData.baseSalary) / 12))}万円
                </p>
              )}
            </div>
            <div>
              <label className="text-sm text-ink-muted block mb-1">
                賞与
              </label>
              <Input
                value={formData.bonusDescription}
                onChange={(e) => handleChange("bonusDescription", e.target.value)}
                placeholder="例：年2回（6月・12月）"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-ink-muted block mb-1">
              諸手当
            </label>
            <Input
              value={formData.allowances}
              onChange={(e) => handleChange("allowances", e.target.value)}
              placeholder="例：通勤手当、住宅手当など"
            />
          </div>
          <div>
            <label className="text-sm text-ink-muted block mb-1">
              社会保険等
            </label>
            <Input
              value={formData.insurances}
              onChange={(e) => handleChange("insurances", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-ink-muted block mb-1">
              退職金
            </label>
            <Input
              value={formData.retirement}
              onChange={(e) => handleChange("retirement", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Transfer Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            承継条件（オプション買取権）
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-accent-soft rounded mb-4">
            <p className="text-small text-accent">
              Dr.optionの特徴である「将来の買い取り権（オプション）」に関する条項です。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-ink-muted block mb-1">
                承継価格目安（万円）
              </label>
              <Input
                type="number"
                value={formData.transferPrice}
                onChange={(e) => handleChange("transferPrice", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-ink-muted block mb-1">
                承継時期
              </label>
              <Input
                value={formData.transferTiming}
                onChange={(e) => handleChange("transferTiming", e.target.value)}
                placeholder="例：雇用開始から3年後を目処"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-ink-muted block mb-1">
              承継条件
            </label>
            <Input
              value={formData.transferConditions}
              onChange={(e) => handleChange("transferConditions", e.target.value)}
              placeholder="例：勤務実績および経営状況を勘案の上、双方合意により決定"
            />
          </div>
        </CardContent>
      </Card>

      {/* Other Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            その他特約事項
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full h-32 px-3 py-2 rounded border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            value={formData.otherTerms}
            onChange={(e) => handleChange("otherTerms", e.target.value)}
            placeholder="追加の特約事項があれば入力してください"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          キャンセル
        </Button>
        <Button onClick={handleGenerateContract}>
          <Eye className="w-4 h-4 mr-2" />
          プレビュー
        </Button>
      </div>
    </div>
  );
}

export default function NewContractPage() {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" /></div>}>
      <NewContractPageContent />
    </React.Suspense>
  );
}
