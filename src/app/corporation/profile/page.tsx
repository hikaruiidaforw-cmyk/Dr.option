"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const profileSchema = z.object({
  corporationName: z.string().min(1, "法人名を入力してください"),
  representativeName: z.string().min(1, "代表者名を入力してください"),
  corporationType: z.string().optional(),
  establishedYear: z.union([z.number(), z.nan()]).optional(),
  employeeCount: z.union([z.number(), z.nan()]).optional(),
  websiteUrl: z.string().optional(),
  contactPerson: z.string().min(1, "担当者名を入力してください"),
  contactEmail: z.string().email("有効なメールアドレスを入力してください"),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
});

type ProfileInput = z.infer<typeof profileSchema>;

const CORPORATION_TYPES = [
  "医療法人社団",
  "医療法人財団",
  "社会医療法人",
  "個人",
  "その他",
];

export default function CorporationProfilePage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(true);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  // 既存のプロフィールを読み込む
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/corporation/profile");
        const data = await response.json();

        if (data.profile) {
          reset({
            corporationName: data.profile.corporationName || "",
            representativeName: data.profile.representativeName || "",
            corporationType: data.profile.corporationType || "",
            establishedYear: data.profile.establishedYear || undefined,
            employeeCount: data.profile.employeeCount || undefined,
            websiteUrl: data.profile.websiteUrl || "",
            contactPerson: data.profile.contactPerson || "",
            contactEmail: data.profile.contactEmail || "",
            contactPhone: data.profile.contactPhone || "",
            address: data.profile.address || "",
            description: data.profile.description || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileInput) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/corporation/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          establishedYear: data.establishedYear && !isNaN(data.establishedYear) ? data.establishedYear : null,
          employeeCount: data.employeeCount && !isNaN(data.employeeCount) ? data.employeeCount : null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "プロフィールを保存しました" });
        // 保存後にデータを再読み込み
        if (result.profile) {
          reset({
            corporationName: result.profile.corporationName || "",
            representativeName: result.profile.representativeName || "",
            corporationType: result.profile.corporationType || "",
            establishedYear: result.profile.establishedYear || undefined,
            employeeCount: result.profile.employeeCount || undefined,
            websiteUrl: result.profile.websiteUrl || "",
            contactPerson: result.profile.contactPerson || "",
            contactEmail: result.profile.contactEmail || "",
            contactPhone: result.profile.contactPhone || "",
            address: result.profile.address || "",
            description: result.profile.description || "",
          });
        }
      } else {
        setMessage({ type: "error", text: result.error || "保存に失敗しました" });
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      setMessage({ type: "error", text: "保存中にエラーが発生しました" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="法人プロフィール"
        description="法人の基本情報を管理します"
      />

      {/* Success/Error Message */}
      {message && (
        <div
          className={`p-4 rounded border flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Corporation Info */}
        <Card>
          <CardHeader>
            <CardTitle>法人情報</CardTitle>
            <CardDescription>
              ドクターに公開される法人の基本情報です
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              label="法人名"
              htmlFor="corporationName"
              error={errors.corporationName?.message}
              required
            >
              <Input
                id="corporationName"
                placeholder="医療法人社団○○会"
                error={errors.corporationName?.message}
                {...register("corporationName")}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="代表者名"
                htmlFor="representativeName"
                error={errors.representativeName?.message}
                required
              >
                <Input
                  id="representativeName"
                  placeholder="山田 太郎"
                  error={errors.representativeName?.message}
                  {...register("representativeName")}
                />
              </FormField>

              <FormField
                label="法人種別"
                htmlFor="corporationType"
              >
                <select
                  id="corporationType"
                  className="w-full px-3 py-2 border border-border rounded bg-white text-ink focus:outline-none focus:ring-2 focus:ring-accent/20"
                  {...register("corporationType")}
                >
                  <option value="">選択してください</option>
                  {CORPORATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="設立年"
                htmlFor="establishedYear"
              >
                <Input
                  id="establishedYear"
                  type="number"
                  placeholder="2010"
                  min={1900}
                  max={new Date().getFullYear()}
                  {...register("establishedYear", { valueAsNumber: true })}
                />
              </FormField>

              <FormField
                label="従業員数"
                htmlFor="employeeCount"
              >
                <Input
                  id="employeeCount"
                  type="number"
                  placeholder="50"
                  {...register("employeeCount", { valueAsNumber: true })}
                />
              </FormField>
            </div>

            <FormField
              label="Webサイト"
              htmlFor="websiteUrl"
            >
              <Input
                id="websiteUrl"
                type="url"
                placeholder="https://example.com"
                {...register("websiteUrl")}
              />
            </FormField>

            <FormField
              label="所在地"
              htmlFor="address"
            >
              <Input
                id="address"
                placeholder="東京都渋谷区..."
                {...register("address")}
              />
            </FormField>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>連絡先情報</CardTitle>
            <CardDescription>
              応募通知や連絡に使用される情報です
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              label="担当者名"
              htmlFor="contactPerson"
              error={errors.contactPerson?.message}
              required
            >
              <Input
                id="contactPerson"
                placeholder="鈴木 一郎"
                error={errors.contactPerson?.message}
                {...register("contactPerson")}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="連絡先メールアドレス"
                htmlFor="contactEmail"
                error={errors.contactEmail?.message}
                required
              >
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="contact@example.com"
                  error={errors.contactEmail?.message}
                  {...register("contactEmail")}
                />
              </FormField>

              <FormField
                label="電話番号"
                htmlFor="contactPhone"
              >
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="03-1234-5678"
                  {...register("contactPhone")}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>法人紹介</CardTitle>
            <CardDescription>
              法人の特徴や理念をドクターにアピールしてください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="description"
              rows={6}
              placeholder="法人の理念、診療方針、職場環境などをご紹介ください..."
              {...register("description")}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                保存中...
              </>
            ) : (
              "保存する"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
