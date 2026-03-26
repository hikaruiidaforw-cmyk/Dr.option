"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Eye,
  Heart,
  Calendar,
  MapPin,
  Briefcase,
  Clock,
  ChevronRight,
  Stethoscope,
  User,
  Quote,
} from "lucide-react";
import {
  MOCK_INTERVIEWS,
  formatPublishedDate,
  type Interview,
} from "@/lib/interviews";
import { cn } from "@/lib/utils";

export default function InterviewsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSpecialty, setSelectedSpecialty] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState("");

  // Get unique specialties and tags
  const specialties = [...new Set(MOCK_INTERVIEWS.map((i) => i.specialty))];
  const allTags = [...new Set(MOCK_INTERVIEWS.flatMap((i) => i.tags))];

  // Filter interviews
  const filteredInterviews = React.useMemo(() => {
    let interviews = [...MOCK_INTERVIEWS];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      interviews = interviews.filter(
        (i) =>
          i.title.toLowerCase().includes(query) ||
          i.summary.toLowerCase().includes(query) ||
          i.doctorName.toLowerCase().includes(query)
      );
    }

    if (selectedSpecialty) {
      interviews = interviews.filter((i) => i.specialty === selectedSpecialty);
    }

    if (selectedTag) {
      interviews = interviews.filter((i) => i.tags.includes(selectedTag));
    }

    return interviews.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }, [searchQuery, selectedSpecialty, selectedTag]);

  // Stats
  const totalViews = MOCK_INTERVIEWS.reduce((sum, i) => sum + i.viewCount, 0);
  const avgYearsAfterTransfer =
    Math.round(
      MOCK_INTERVIEWS.reduce((sum, i) => sum + i.yearsAfterTransfer, 0) /
        MOCK_INTERVIEWS.length
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="先輩ドクターインタビュー"
        description="承継を経験した先輩ドクターのリアルな声をお届けします"
      />

      {/* Featured Quote */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Quote className="w-10 h-10 text-accent flex-shrink-0" />
            <div>
              <p className="text-lg text-ink italic mb-3">
                「承継は終わりではなく、新しいキャリアの始まり。
                <br className="hidden md:block" />
                自分らしい医療を実現できる最高の選択でした。」
              </p>
              <p className="text-sm text-ink-muted">
                — 佐藤先生（内科・承継3年目）
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">{MOCK_INTERVIEWS.length}</p>
                <p className="text-xs text-ink-muted">インタビュー数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">{totalViews.toLocaleString()}</p>
                <p className="text-xs text-ink-muted">総閲覧数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">平均{avgYearsAfterTransfer}年</p>
                <p className="text-xs text-ink-muted">承継後経過年数</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <Input
                placeholder="キーワードで検索..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="h-[44px] px-3 border border-border rounded-lg text-sm"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">診療科を選択</option>
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <select
                className="h-[44px] px-3 border border-border rounded-lg text-sm"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">タグを選択</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tag Chips */}
      <div className="flex flex-wrap gap-2">
        {["女性医師", "40代", "30代", "50代", "子育て両立"].map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm transition-all",
              selectedTag === tag
                ? "bg-accent text-white"
                : "bg-surface-sunken text-ink-muted hover:text-ink"
            )}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          {filteredInterviews.length}件のインタビュー
        </p>
        {(selectedSpecialty || selectedTag) && (
          <Button
            variant="ghost"
            size="small"
            onClick={() => {
              setSelectedSpecialty("");
              setSelectedTag("");
            }}
          >
            フィルターをクリア
          </Button>
        )}
      </div>

      {/* Interview Cards */}
      <div className="space-y-6">
        {filteredInterviews.map((interview) => (
          <InterviewCard key={interview.id} interview={interview} />
        ))}
      </div>

      {filteredInterviews.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="w-12 h-12 text-ink-muted mx-auto mb-4" />
            <p className="text-ink-muted">該当するインタビューが見つかりません</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InterviewCard({ interview }: { interview: Interview }) {
  return (
    <Link href={`/doctor/interviews/${interview.id}`}>
      <Card className="hover:border-accent/30 transition-all group">
        <CardContent className="pt-6">
          <div className="flex gap-6">
            {/* Avatar */}
            <div className="hidden md:block">
              <div className="w-20 h-20 rounded-xl bg-accent/10 flex items-center justify-center">
                <span className="text-3xl font-bold text-accent">
                  {interview.thumbnailInitial}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="text-accent border-accent">
                  {interview.specialty}
                </Badge>
                {interview.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-accent transition-colors line-clamp-2">
                {interview.title}
              </h3>

              {/* Summary */}
              <p className="text-sm text-ink-muted line-clamp-2 mb-4">
                {interview.summary}
              </p>

              {/* Doctor Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-ink-muted mb-4">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {interview.doctorName}（{interview.age}歳）
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {interview.clinicArea}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  承継{interview.yearsAfterTransfer}年目
                </span>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-ink-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatPublishedDate(interview.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {interview.viewCount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    {interview.likeCount}
                  </span>
                </div>
                <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  詳しく読む
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
