import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink text-white py-12">
      <div className="max-w-[1152px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Company */}
          <div className="md:col-span-2">
            <Link href="/" className="font-display text-h2 text-white">
              Dr.option
            </Link>
            <p className="mt-4 text-white/70 text-small max-w-md">
              将来の買い取り権（オプション）を付与した、医師の新しい開業・採用マッチングプラットフォーム。
            </p>
            <p className="mt-6 text-white/50 text-small">
              運営: G.C FACTORY株式会社
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medium text-white mb-4">サービス</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white/70 hover:text-white text-small">
                  Dr.optionとは
                </Link>
              </li>
              <li>
                <Link href="/register/doctor" className="text-white/70 hover:text-white text-small">
                  ドクターとして登録
                </Link>
              </li>
              <li>
                <Link href="/register/corporation" className="text-white/70 hover:text-white text-small">
                  医療法人として登録
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/70 hover:text-white text-small">
                  よくある質問
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-white mb-4">サポート</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white text-small">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/70 hover:text-white text-small">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/70 hover:text-white text-small">
                  利用規約
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <p className="text-white/50 text-caption text-center">
            &copy; {new Date().getFullYear()} G.C FACTORY Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
