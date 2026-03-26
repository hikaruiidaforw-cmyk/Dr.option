"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Search,
  MapPin,
  Briefcase,
  MessageCircle,
  Eye,
  FileText,
  Loader2,
} from "lucide-react";

interface CorporationData {
  id: string;
  corporationName: string;
  representativeName: string;
  corporationType: string | null;
  address: string | null;
  establishedYear: number | null;
  employeeCount: number | null;
  activeJobCount: number;
  totalJobCount: number;
  applicationCount: number;
  matchCount: number;
  createdAt: string;
}

export default function ConsultantCorporationsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [corporations, setCorporations] = React.useState<CorporationData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCorporations() {
      try {
        const res = await fetch("/api/consultant/corporations");
        if (res.ok) setCorporations(await res.json());
      } catch {
        // fallback
      } finally {
        setIsLoading(false);
      }
    }
    fetchCorporations();
  }, []);

  const filtered = corporations.filter((corp) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      corp.corporationName.toLowerCase().includes(q) ||
      (corp.address?.toLowerCase().includes(q) ?? false) ||
      corp.representativeName.toLowerCase().includes(q)
    );
  });

  const totalActiveJobs = corporations.reduce((sum, c) => sum + c.activeJobCount, 0);
  const totalMatches = corporations.reduce((sum, c) => sum + c.matchCount, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="法人一覧" description="登録法人を確認・管理します" />
        <Card><CardContent className="py-12 text-center"><Loader2 className="w-8 h-8 text-ink-muted mx-auto mb-3 animate-spin" /><p className="text-ink-muted">読み込み中...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="法人一覧" description="登録法人を確認・管理します" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption text-ink-muted">登録法人数</p>
            <p className="text-numeric-l">{corporations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption text-ink-muted">公開中の求人</p>
            <p className="text-numeric-l text-accent">{totalActiveJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption text-ink-muted">進行中マッチング</p>
            <p className="text-numeric-l">{totalMatches}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <Input placeholder="法人名、代表者名、所在地で検索..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Corporation List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((corp) => {
            const yearsInBusiness = corp.establishedYear
              ? new Date().getFullYear() - corp.establishedYear
              : null;

            return (
              <Card key={corp.id} className="hover:border-border-strong transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded bg-surface-sunken flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-ink-muted" />
                        </div>
                        <div>
                          <p className="text-h3">{corp.corporationName}</p>
                          <p className="text-small text-ink-muted">代表: {corp.representativeName}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {corp.address && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-ink-muted mt-0.5" />
                            <div>
                              <p className="text-caption text-ink-muted">所在地</p>
                              <p className="text-body">{corp.address}</p>
                            </div>
                          </div>
                        )}
                        {corp.establishedYear && (
                          <div className="flex items-start gap-2">
                            <Building2 className="w-4 h-4 text-ink-muted mt-0.5" />
                            <div>
                              <p className="text-caption text-ink-muted">設立</p>
                              <p className="text-body">{corp.establishedYear}年{yearsInBusiness != null ? `（${yearsInBusiness}年目）` : ""}</p>
                            </div>
                          </div>
                        )}
                        {corp.employeeCount != null && (
                          <div className="flex items-start gap-2">
                            <Briefcase className="w-4 h-4 text-ink-muted mt-0.5" />
                            <div>
                              <p className="text-caption text-ink-muted">従業員数</p>
                              <p className="text-body">{corp.employeeCount}名</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-6">
                        <div>
                          <p className="text-caption text-ink-muted">公開中求人</p>
                          <p className="text-numeric-m text-accent mt-1">{corp.activeJobCount}件</p>
                        </div>
                        <div>
                          <p className="text-caption text-ink-muted">総応募数</p>
                          <p className="text-numeric-m mt-1">{corp.applicationCount}件</p>
                        </div>
                        <div>
                          <p className="text-caption text-ink-muted">進行中マッチング</p>
                          <p className="text-numeric-m mt-1">{corp.matchCount}件</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="small" asChild>
                        <Link href={`/consultant/corporations/${corp.id}`}>
                          <Eye className="w-4 h-4 mr-1" />詳細を見る
                        </Link>
                      </Button>
                      <Button variant="outline" size="small" asChild>
                        <Link href={`/consultant/corporations/${corp.id}/jobs`}>
                          <FileText className="w-4 h-4 mr-1" />求人一覧
                        </Link>
                      </Button>
                      <Button variant="outline" size="small">
                        <MessageCircle className="w-4 h-4 mr-1" />メモを追加
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card><CardContent className="py-12 text-center"><p className="text-ink-muted">該当する法人はありません</p></CardContent></Card>
      )}
    </div>
  );
}
