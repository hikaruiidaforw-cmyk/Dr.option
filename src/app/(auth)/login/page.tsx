"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function getDashboardUrl(role: string): string {
  switch (role) {
    case "DOCTOR":
      return "/doctor/dashboard";
    case "CORPORATION":
      return "/corporation/dashboard";
    case "CONSULTANT":
      return "/consultant/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/";
  }
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("メールアドレスまたはパスワードが正しくありません");
        return;
      }

      // Get updated session to determine redirect URL
      const session = await getSession();
      const redirectUrl = callbackUrl || getDashboardUrl(session?.user?.role || "");

      router.refresh();
      router.push(redirectUrl);
    } catch {
      setError("ログインに失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ログイン</CardTitle>
        <CardDescription>
          アカウントにログインしてください
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
            required
          >
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />
          </FormField>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            ログイン
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-small text-ink-muted">
            アカウントをお持ちでない方は
            <Link
              href="/register"
              className="text-accent hover:underline ml-1"
            >
              新規登録
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-soft/50 via-surface to-secondary-soft/30 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-baseline gap-1 justify-center">
            <span className="text-4xl font-semibold text-ink tracking-tight">Dr</span>
            <span className="text-accent text-4xl font-bold">.</span>
            <span className="text-4xl font-light text-ink tracking-tight">option</span>
          </Link>
          <p className="mt-4 text-ink-muted">
            医師の新しい開業・採用マッチングプラットフォーム
          </p>
        </div>

        <Suspense fallback={<div className="h-96 animate-pulse bg-surface-sunken rounded-xl" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
