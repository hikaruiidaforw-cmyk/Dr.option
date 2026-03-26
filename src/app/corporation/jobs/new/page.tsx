"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { DEPARTMENTS, PREFECTURES } from "@/lib/constants";
import { AlertCircle, CheckCircle } from "lucide-react";

const jobSchema = z.object({
  title: z.string().min(1, "求人タイトルを入力してください"),
  department: z.string().min(1, "診療科を選択してください"),
  clinicName: z.string().min(1, "クリニック名を入力してください"),
  clinicArea: z.string().min(1, "所在地を選択してください"),
  clinicAddress: z.string().min(1, "住所を入力してください"),
  description: z.string().min(1, "求人詳細を入力してください"),
  employmentType: z.string().min(1, "雇用形態を選択してください"),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  workingHours: z.string().optional(),
  holidays: z.string().optional(),
  benefits: z.string().optional(),
  transferPrice: z.number().optional(),
  transferPriceNote: z.string().optional(),
  transferTimingMin: z.number().optional(),
  transferTimingMax: z.number().optional(),
  transferConditions: z.string().optional(),
  annualRevenue: z.number().optional(),
  annualProfit: z.number().optional(),
  patientCount: z.number().optional(),
});

type JobInput = z.infer<typeof jobSchema>;

const EMPLOYMENT_TYPES = ["常勤", "非常勤", "週4日勤務", "その他"];

export default function NewJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSavingDraft, setIsSavingDraft] = React.useState(false);
  const [includesRealEstate, setIncludesRealEstate] = React.useState(false);
  const [includesEquipment, setIncludesEquipment] = React.useState(true);
  const [includesStaff, setIncludesStaff] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
  });

  const submitJob = async (data: JobInput, status: "DRAFT" | "PUBLISHED") => {
    const isPublishing = status === "PUBLISHED";
    if (isPublishing) {
      setIsLoading(true);
    } else {
      setIsSavingDraft(true);
    }
    setError(null);
    setSuccess(null);

    // NaN を undefined に変換
    const cleanData = Object.fromEntries(
      Object.entries(data).map(([key, value]) =>
        [key, typeof value === "number" && isNaN(value) ? undefined : value]
      )
    );

    try {
      const response = await fetch("/api/corporation/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cleanData,
          includesRealEstate,
          includesEquipment,
          includesStaff,
          status,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message);
        setTimeout(() => {
          router.push("/corporation/jobs");
        }, 1000);
      } else {
        setError(result.error || "求人の作成に失敗しました");
      }
    } catch (err) {
      console.error("Failed to create job:", err);
      setError("求人の作成に失敗しました");
    } finally {
      setIsLoading(false);
      setIsSavingDraft(false);
    }
  };

  const onSubmit = async (data: JobInput) => {
    await submitJob(data, "PUBLISHED");
  };

  const handleSaveDraft = async () => {
    const data = getValues();
    // 下書きの場合は最低限の検証のみ
    if (!data.title) {
      setError("下書き保存にはタイトルが必要です");
      return;
    }
    await submitJob(data as JobInput, "DRAFT");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="新規求人作成"
        description="承継候補の求人を作成します"
      />

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-small">{success}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-small">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              label="求人タイトル"
              htmlFor="title"
              error={errors.title?.message}
              required
            >
              <Input
                id="title"
                placeholder="内科クリニック 管理医師募集（承継前提）"
                error={errors.title?.message}
                {...register("title")}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="診療科"
                htmlFor="department"
                error={errors.department?.message}
                required
              >
                <select
                  id="department"
                  className="w-full"
                  {...register("department")}
                >
                  <option value="">選択してください</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="雇用形態"
                htmlFor="employmentType"
                error={errors.employmentType?.message}
                required
              >
                <select
                  id="employmentType"
                  className="w-full"
                  {...register("employmentType")}
                >
                  <option value="">選択してください</option>
                  {EMPLOYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField
              label="クリニック名"
              htmlFor="clinicName"
              error={errors.clinicName?.message}
              required
            >
              <Input
                id="clinicName"
                placeholder="○○内科クリニック"
                error={errors.clinicName?.message}
                {...register("clinicName")}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="エリア"
                htmlFor="clinicArea"
                error={errors.clinicArea?.message}
                required
              >
                <select
                  id="clinicArea"
                  className="w-full"
                  {...register("clinicArea")}
                >
                  <option value="">選択してください</option>
                  {PREFECTURES.map((pref) => (
                    <option key={pref} value={pref}>
                      {pref}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="住所"
                htmlFor="clinicAddress"
                error={errors.clinicAddress?.message}
                required
              >
                <Input
                  id="clinicAddress"
                  placeholder="東京都渋谷区..."
                  error={errors.clinicAddress?.message}
                  {...register("clinicAddress")}
                />
              </FormField>
            </div>

            <FormField
              label="求人詳細"
              htmlFor="description"
              error={errors.description?.message}
              required
            >
              <Textarea
                id="description"
                rows={6}
                placeholder="求人の詳細、クリニックの特徴、求める人材像などを記載してください..."
                {...register("description")}
              />
            </FormField>
          </CardContent>
        </Card>

        {/* Employment Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>雇用条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="年収下限"
                htmlFor="salaryMin"
                description="万円"
              >
                <Input
                  id="salaryMin"
                  type="number"
                  placeholder="1800"
                  {...register("salaryMin", { valueAsNumber: true })}
                />
              </FormField>

              <FormField
                label="年収上限"
                htmlFor="salaryMax"
                description="万円"
              >
                <Input
                  id="salaryMax"
                  type="number"
                  placeholder="2200"
                  {...register("salaryMax", { valueAsNumber: true })}
                />
              </FormField>
            </div>

            <FormField
              label="勤務時間"
              htmlFor="workingHours"
            >
              <Input
                id="workingHours"
                placeholder="9:00〜18:00（休憩1時間）"
                {...register("workingHours")}
              />
            </FormField>

            <FormField
              label="休日"
              htmlFor="holidays"
            >
              <Input
                id="holidays"
                placeholder="土日祝、年末年始、夏季休暇"
                {...register("holidays")}
              />
            </FormField>

            <FormField
              label="福利厚生"
              htmlFor="benefits"
            >
              <Textarea
                id="benefits"
                rows={3}
                placeholder="社会保険完備、学会参加費補助など..."
                {...register("benefits")}
              />
            </FormField>
          </CardContent>
        </Card>

        {/* Transfer Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>譲渡条件</CardTitle>
            <CardDescription>
              将来の事業承継に関する条件を設定してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="想定譲渡価格"
                htmlFor="transferPrice"
                description="万円"
              >
                <Input
                  id="transferPrice"
                  type="number"
                  placeholder="8000"
                  {...register("transferPrice", { valueAsNumber: true })}
                />
              </FormField>

              <FormField
                label="価格補足"
                htmlFor="transferPriceNote"
              >
                <Input
                  id="transferPriceNote"
                  placeholder="応相談、分割払い可など"
                  {...register("transferPriceNote")}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="最短譲渡時期"
                htmlFor="transferTimingMin"
                description="年後"
              >
                <Input
                  id="transferTimingMin"
                  type="number"
                  placeholder="3"
                  {...register("transferTimingMin", { valueAsNumber: true })}
                />
              </FormField>

              <FormField
                label="最長譲渡時期"
                htmlFor="transferTimingMax"
                description="年後"
              >
                <Input
                  id="transferTimingMax"
                  type="number"
                  placeholder="5"
                  {...register("transferTimingMax", { valueAsNumber: true })}
                />
              </FormField>
            </div>

            <FormField
              label="譲渡条件詳細"
              htmlFor="transferConditions"
            >
              <Textarea
                id="transferConditions"
                rows={4}
                placeholder="譲渡に関する詳細条件、引継ぎ内容などを記載してください..."
                {...register("transferConditions")}
              />
            </FormField>

            <div className="space-y-3">
              <p className="text-small font-medium">譲渡に含まれるもの</p>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={includesRealEstate}
                    onCheckedChange={(checked) => setIncludesRealEstate(checked === true)}
                  />
                  <span className="text-small">不動産</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={includesEquipment}
                    onCheckedChange={(checked) => setIncludesEquipment(checked === true)}
                  />
                  <span className="text-small">医療機器</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={includesStaff}
                    onCheckedChange={(checked) => setIncludesStaff(checked === true)}
                  />
                  <span className="text-small">スタッフ引継ぎ</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Info */}
        <Card>
          <CardHeader>
            <CardTitle>経営情報</CardTitle>
            <CardDescription>
              クリニックの経営状況（任意）
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="年間売上"
                htmlFor="annualRevenue"
                description="万円"
              >
                <Input
                  id="annualRevenue"
                  type="number"
                  placeholder="15000"
                  {...register("annualRevenue", { valueAsNumber: true })}
                />
              </FormField>

              <FormField
                label="年間利益"
                htmlFor="annualProfit"
                description="万円"
              >
                <Input
                  id="annualProfit"
                  type="number"
                  placeholder="3000"
                  {...register("annualProfit", { valueAsNumber: true })}
                />
              </FormField>

              <FormField
                label="1日平均患者数"
                htmlFor="patientCount"
                description="人"
              >
                <Input
                  id="patientCount"
                  type="number"
                  placeholder="50"
                  {...register("patientCount", { valueAsNumber: true })}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            disabled={isLoading || isSavingDraft}
          >
            キャンセル
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSaveDraft}
            isLoading={isSavingDraft}
            disabled={isLoading}
          >
            下書き保存
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={isSavingDraft}>
            求人を公開
          </Button>
        </div>
      </form>
    </div>
  );
}
