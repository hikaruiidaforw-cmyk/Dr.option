import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dr.option | 医師の新しい開業・採用マッチングプラットフォーム",
  description: "将来の買い取り権（オプション）を付与した、医師の新しい開業・採用マッチングプラットフォーム。まずは管理者として経験を積み、将来そのクリニックを買い取る新しい働き方を提案します。",
  openGraph: {
    title: "Dr.option | 医師の新しい開業・採用マッチングプラットフォーム",
    description: "将来の買い取り権（オプション）を付与した、医師の新しい開業・採用マッチングプラットフォーム",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
