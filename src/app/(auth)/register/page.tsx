import Link from "next/link";
import { User, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-display text-ink">
            Dr.option
          </Link>
          <p className="mt-2 text-ink-muted">
            医師の新しい開業・採用マッチングプラットフォーム
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>新規登録</CardTitle>
            <CardDescription>
              ご登録のタイプを選択してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Doctor Registration */}
              <Link href="/register/doctor" className="block">
                <div className="p-6 border border-border rounded-md hover:border-border-strong transition-colors duration-200 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent-soft flex items-center justify-center">
                    <User className="h-6 w-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-h3 mb-2">ドクターとして登録</h3>
                  <p className="text-small text-ink-muted">
                    将来の独立・承継を希望する勤務医の方
                  </p>
                  <ul className="mt-4 text-left text-small text-ink-muted space-y-1">
                    <li>・ 承継候補の求人検索</li>
                    <li>・ 医療法人への応募</li>
                    <li>・ スカウト受信</li>
                  </ul>
                </div>
              </Link>

              {/* Corporation Registration */}
              <Link href="/register/corporation" className="block">
                <div className="p-6 border border-border rounded-md hover:border-border-strong transition-colors duration-200 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent-soft flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-h3 mb-2">医療法人として登録</h3>
                  <p className="text-small text-ink-muted">
                    管理医師の採用と将来の譲渡を検討する法人の方
                  </p>
                  <ul className="mt-4 text-left text-small text-ink-muted space-y-1">
                    <li>・ 求人の作成・公開</li>
                    <li>・ ドクターへのスカウト</li>
                    <li>・ 応募者の管理</li>
                  </ul>
                </div>
              </Link>
            </div>

            <div className="mt-6 text-center">
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
