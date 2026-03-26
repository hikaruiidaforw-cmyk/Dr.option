import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layouts/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-raised/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[1152px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-0.5">
            <span className="text-[22px] font-semibold text-ink tracking-tight">Dr</span>
            <span className="text-accent text-[22px] font-bold">.</span>
            <span className="text-[22px] font-light text-ink tracking-tight">option</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/about" className="text-small text-ink-muted hover:text-accent transition-colors">
              Dr.optionとは
            </Link>
            <Link href="/login">
              <Button variant="outline" size="small">ログイン</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-to-b from-accent-soft/30 to-surface">
        <div className="max-w-[1152px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-soft text-accent text-sm font-medium mb-6">
                新しい開業のかたち
              </div>
              <h1 className="text-display leading-tight">
                開業の&ldquo;オプション&rdquo;を、<br />
                すべての医師に。
              </h1>
              <p className="mt-6 text-ink-muted max-w-lg text-lg">
                まずは管理者として経験を積み、将来そのクリニックを買い取る。
                Dr.optionが実現する、新しい開業のかたち。
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/register/doctor">
                  <Button size="large">ドクターとして登録</Button>
                </Link>
                <Link href="/register/corporation">
                  <Button variant="outline" size="large">医療法人として登録</Button>
                </Link>
              </div>
            </div>
            <div className="md:col-span-5">
              {/* Decorative element */}
              <div className="hidden md:block relative">
                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full blur-3xl"></div>
                <div className="absolute top-20 right-20 w-48 h-48 bg-gradient-to-br from-accent/20 to-accent-soft rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section - 仕組み説明 */}
      <section className="py-24">
        <div className="max-w-[1152px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h1 mb-4">新しい働き方のプロセス</h2>
            <p className="text-ink-muted max-w-2xl mx-auto">
              Dr.optionは、医師と医療法人双方にメリットのある、新しいマッチングの仕組みを提供します。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative bg-surface-raised rounded-2xl p-8 border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center text-accent font-bold text-xl mb-6">
                1
              </div>
              <h3 className="text-h2 mb-3">マッチング</h3>
              <p className="text-ink-muted">
                医療法人が「将来の譲渡」を前提とした求人を掲載。
                独立志向のある医師がその求人に応募し、双方の条件をすり合わせます。
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-surface-raised rounded-2xl p-8 border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center text-accent font-bold text-xl mb-6">
                2
              </div>
              <h3 className="text-h2 mb-3">管理者として勤務</h3>
              <p className="text-ink-muted">
                雇用契約の中に「譲渡条件（価格・時期等）」の覚書を組み込みます。
                医師は管理者として経営経験を積みながら、クリニックを深く理解していきます。
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-surface-raised rounded-2xl p-8 border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center text-accent font-bold text-xl mb-6">
                3
              </div>
              <h3 className="text-h2 mb-3">事業承継</h3>
              <p className="text-ink-muted">
                双方が納得した段階で、スムーズに事業承継を完結。
                医師は低リスクで独立を実現し、法人は安定した後継者を確保できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-surface-sunken">
        <div className="max-w-[1152px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Doctors */}
            <div className="bg-surface-raised rounded-2xl p-8 border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-h1 mb-4">ドクターの方へ</h2>
              <p className="text-ink-muted mb-4">
                独立志向はあるものの、数千万円〜億単位の初期投資や集患リスクに躊躇されている方へ。
                Dr.optionは、いきなり開業でも単なる勤務でもない、第三の選択肢を提供します。
              </p>
              <p className="text-ink-muted">
                まずは管理者として経営を学びながら、将来的にそのクリニックを買い取る権利を持つ。
                実際に働いてみて「ここなら」と思えたときに、スムーズに承継へ移行できます。
              </p>
              <Link href="/register/doctor" className="inline-flex items-center text-accent font-medium mt-6 hover:underline">
                詳しく見る
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* For Corporations */}
            <div className="bg-surface-raised rounded-2xl p-8 border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-white mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-h1 mb-4">医療法人の方へ</h2>
              <p className="text-ink-muted mb-4">
                管理医師（院長）を採用できない、採用しても独立による離職リスクが高い。
                そんな課題を抱える医療法人の皆様へ。
              </p>
              <p className="text-ink-muted">
                「将来の譲渡」を前提とした求人を掲載することで、独立志向のある優秀な医師との接点を創出。
                安定した管理者を確保しながら、計画的な事業承継を実現できます。
              </p>
              <Link href="/register/corporation" className="inline-flex items-center text-secondary font-medium mt-6 hover:underline">
                詳しく見る
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-[1152px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-8">
              <p className="text-5xl font-bold text-ink tracking-tight">90</p>
              <p className="text-ink-muted mt-2 text-sm">年間開業支援実績</p>
            </div>
            <div className="text-center p-8 border-y md:border-y-0 md:border-x border-border">
              <p className="text-5xl font-bold text-ink tracking-tight">4,000<span className="text-accent">+</span></p>
              <p className="text-ink-muted mt-2 text-sm">M&Aネットワーク</p>
            </div>
            <div className="text-center p-8">
              <p className="text-5xl font-bold text-ink tracking-tight">100<span className="text-accent">%</span></p>
              <p className="text-ink-muted mt-2 text-sm">専門家サポート</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-surface-sunken">
        <div className="max-w-[1152px] mx-auto px-6 text-center">
          <h2 className="text-h1 mb-4">まずは無料で登録</h2>
          <p className="text-ink-muted mb-8 max-w-lg mx-auto text-lg">
            登録は無料です。承継候補の求人を検索、または求人を掲載してみませんか。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register/doctor">
              <Button size="large">ドクターとして登録</Button>
            </Link>
            <Link href="/register/corporation">
              <Button variant="outline" size="large">医療法人として登録</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
