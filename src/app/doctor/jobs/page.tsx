"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Building2, Heart, Clock, Loader2 } from "lucide-react";
import { DEPARTMENTS, PREFECTURES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  clinicName: string;
  clinicArea: string;
  salaryMin: number | null;
  salaryMax: number | null;
  transferPrice: number | null;
  transferTimingMin: number | null;
  transferTimingMax: number | null;
  employmentType: string;
  publishedAt: string;
  corporation: {
    id: string;
    corporationName: string;
    logoUrl: string | null;
  };
  _count: {
    applications: number;
    favorites: number;
  };
}

export default function DoctorJobsPage() {
  const [jobs, setJobs] = React.useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState("");
  const [selectedArea, setSelectedArea] = React.useState("");
  const [sortBy, setSortBy] = React.useState("newest");
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
  const [togglingFavorite, setTogglingFavorite] = React.useState<string | null>(null);

  // 求人一覧を取得
  React.useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("keyword", searchQuery);
        if (selectedDepartment) params.set("department", selectedDepartment);
        if (selectedArea) params.set("area", selectedArea);

        const response = await fetch(`/api/jobs?${params.toString()}`);
        const data = await response.json();
        if (response.ok && data.jobs) {
          setJobs(data.jobs);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery, selectedDepartment, selectedArea]);

  // お気に入り状態を取得
  React.useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/doctor/favorites");
        const data = await response.json();
        if (response.ok && data.favorites) {
          const favoriteIds = new Set<string>(data.favorites.map((f: { jobPostingId: string }) => f.jobPostingId));
          setFavorites(favoriteIds);
        }
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  // ソート処理
  const sortedJobs = React.useMemo(() => {
    const jobsCopy = [...jobs];
    switch (sortBy) {
      case "salary":
        return jobsCopy.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
      case "transfer":
        return jobsCopy.sort((a, b) => (a.transferPrice || 0) - (b.transferPrice || 0));
      case "newest":
      default:
        return jobsCopy.sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
    }
  }, [jobs, sortBy]);

  // お気に入りをトグル
  const handleToggleFavorite = async (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTogglingFavorite(jobId);

    try {
      const isFavorite = favorites.has(jobId);
      const response = await fetch("/api/doctor/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobPostingId: jobId }),
      });

      if (response.ok) {
        setFavorites((prev) => {
          const next = new Set(prev);
          if (isFavorite) {
            next.delete(jobId);
          } else {
            next.add(jobId);
          }
          return next;
        });
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setTogglingFavorite(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="求人検索"
        description="承継候補の求人を検索できます"
      />

      {/* Search Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <Input
                  placeholder="キーワードで検索..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="w-full h-[44px]"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">診療科を選択</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full h-[44px]"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="">エリアを選択</option>
                {PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>
                    {pref}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count & Sort */}
      <div className="flex items-center justify-between">
        <p className="text-small text-ink-muted">
          {isLoading ? "読み込み中..." : `${sortedJobs.length}件の求人が見つかりました`}
        </p>
        <select
          className="text-small border border-border rounded-lg px-3 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">新着順</option>
          <option value="salary">年収順</option>
          <option value="transfer">譲渡価格順</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : sortedJobs.length > 0 ? (
        /* Job Listings */
        <div className="space-y-4">
          {sortedJobs.map((job) => (
            <Card key={job.id} className="hover:border-accent/30 transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Department Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{job.department}</Badge>
                      <span className="text-caption text-ink-muted">
                        {new Date(job.publishedAt).toLocaleDateString("ja-JP")} 掲載
                      </span>
                    </div>

                    <Link
                      href={`/doctor/jobs/${job.id}`}
                      className="text-h3 hover:text-accent transition-colors"
                    >
                      {job.title}
                    </Link>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-small text-ink-muted">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {job.corporation.corporationName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.clinicArea}
                      </span>
                      {job.transferTimingMin && job.transferTimingMax && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.transferTimingMin}〜{job.transferTimingMax}年後承継
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-6">
                      {(job.salaryMin || job.salaryMax) && (
                        <div>
                          <p className="text-caption text-ink-muted">年収</p>
                          <p className="text-numeric-m">
                            {job.salaryMin && formatPrice(job.salaryMin)}
                            {job.salaryMin && job.salaryMax && "〜"}
                            {job.salaryMax && formatPrice(job.salaryMax)}万
                          </p>
                        </div>
                      )}
                      {job.transferPrice && (
                        <div>
                          <p className="text-caption text-ink-muted">想定譲渡価格</p>
                          <p className="text-numeric-m text-accent">
                            {formatPrice(job.transferPrice)}万
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="small"
                      className={favorites.has(job.id) ? "text-accent" : "text-ink-muted hover:text-accent"}
                      onClick={(e) => handleToggleFavorite(job.id, e)}
                      disabled={togglingFavorite === job.id}
                    >
                      {togglingFavorite === job.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Heart className={`w-5 h-5 ${favorites.has(job.id) ? "fill-accent" : ""}`} />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-ink-muted">条件に合う求人が見つかりませんでした</p>
            <p className="text-small text-ink-muted mt-2">
              検索条件を変更してお試しください
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
