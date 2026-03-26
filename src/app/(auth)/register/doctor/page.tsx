"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerDoctorSchema, type RegisterDoctorInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function RegisterDoctorPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDoctorInput>({
    resolver: zodResolver(registerDoctorSchema),
    defaultValues: {
      medicalLicenseYear: new Date().getFullYear() - 10,
    },
  });

  const onSubmit = async (data: RegisterDoctorInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          role: "DOCTOR",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "登録に失敗しました");
        return;
      }

      // Redirect to login with success message
      router.push("/login?registered=true");
    } catch {
      setError("登録に失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-display text-ink">
            Dr.option
          </Link>
          <p className="mt-2 text-ink-muted">
            ドクターとして新規登録
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ドクター登録</CardTitle>
            <CardDescription>
              基本情報を入力してアカウントを作成してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 rounded bg-error-soft text-error text-small">
                  {error}
                </div>
              )}

              <FormField
                label="メールアドレス"
                htmlFor="email"
                error={errors.email?.message}
                required
              >
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </FormField>

              <FormField
                label="パスワード"
                htmlFor="password"
                error={errors.password?.message}
                description="8文字以上で入力してください"
                required
              >
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  error={errors.password?.message}
                  {...register("password")}
                />
              </FormField>

              <FormField
                label="パスワード（確認）"
                htmlFor="confirmPassword"
                error={errors.confirmPassword?.message}
                required
              >
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />
              </FormField>

              <FormField
                label="表示名"
                htmlFor="displayName"
                error={errors.displayName?.message}
                description="匿名での表示に使用されます（例: Dr.A）"
                required
              >
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Dr.A"
                  error={errors.displayName?.message}
                  {...register("displayName")}
                />
              </FormField>

              <FormField
                label="医師免許取得年"
                htmlFor="medicalLicenseYear"
                error={errors.medicalLicenseYear?.message}
                required
              >
                <Input
                  id="medicalLicenseYear"
                  type="number"
                  placeholder="2015"
                  min={1950}
                  max={new Date().getFullYear()}
                  error={errors.medicalLicenseYear?.message}
                  {...register("medicalLicenseYear", { valueAsNumber: true })}
                />
              </FormField>

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                登録する
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-small text-ink-muted">
                <Link
                  href="/register"
                  className="text-accent hover:underline"
                >
                  登録タイプの選択に戻る
                </Link>
              </p>
              <p className="text-small text-ink-muted">
                既にアカウントをお持ちの方は
                <Link
                  href="/login"
                  className="text-accent hover:underline ml-1"
                >
                  ログイン
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
