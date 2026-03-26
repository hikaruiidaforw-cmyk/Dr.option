"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Clock,
  Heart,
  Trash2,
  Search,
  Loader2,
} from "lucide-react";
import { formatNumber, formatRelativeTime } from "@/lib/utils";

interface Favorite {
  id: string;
  createdAt: string;
  jobPostingId: string;
  jobPosting: {
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
    status: string;
    corporation: {
      id: string;
      corporationName: string;
      logoUrl: string | null;
    };
  };
}

export default function DoctorFavoritesPage() {
  const [favorites, setFavorites] = React.useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [removingId, setRemovingId] = React.useState<string | null>(null);

  // お気に入り一覧を取得
  React.useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/doctor/favorites");
        const data = await response.json();
        if (response.ok && data.favorites) {
          setFavorites(data.favorites);
        }
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (jobPostingId: string) => {
    setRemovingId(jobPostingId);
    try {
      const response = await fetch("/api/doctor/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobPostingId }),
      });

      if (response.ok) {
        setFavorites(favorites.filter((f) => f.jobPostingId !== jobPostingId));
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="お気に入り"
          description="保存した求人を確認できます"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="お気に入り"
        description="保存した求人を確認できます"
      />

      {favorites.length > 0 ? (
        <>
          <p className="text-small text-ink-muted">
            {favorites.length}件のお気に入りがあります
          </p>

          <div className="space-y-4">
            {favorites.map((favorite) => (
              <Card
                key={favorite.id}
                className="hover:border-border-strong transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{favorite.jobPosting.department}</Badge>
                        <span className="text-caption text-ink-muted">
                          {formatRelativeTime(favorite.createdAt)}に追加
                        </span>
                      </div>

                      <Link
                        href={`/doctor/jobs/${favorite.jobPosting.id}`}
                        className="text-h3 hover:text-accent transition-colors"
                      >
                        {favorite.jobPosting.title}
                      </Link>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-small text-ink-muted">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {favorite.jobPosting.corporation.corporationName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {favorite.jobPosting.clinicArea}
                        </span>
                        {favorite.jobPosting.transferTimingMin && favorite.jobPosting.transferTimingMax && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {favorite.jobPosting.transferTimingMin}〜
                            {favorite.jobPosting.transferTimingMax}年後承継
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-6">
                        {(favorite.jobPosting.salaryMin || favorite.jobPosting.salaryMax) && (
                          <div>
                            <p className="text-caption text-ink-muted">年収</p>
                            <p className="text-numeric-m">
                              {favorite.jobPosting.salaryMin && formatNumber(favorite.jobPosting.salaryMin)}
                              {favorite.jobPosting.salaryMin && favorite.jobPosting.salaryMax && "〜"}
                              {favorite.jobPosting.salaryMax && formatNumber(favorite.jobPosting.salaryMax)}万
                            </p>
                          </div>
                        )}
                        {favorite.jobPosting.transferPrice && (
                          <div>
                            <p className="text-caption text-ink-muted">譲渡価格</p>
                            <p className="text-numeric-m text-accent">
                              {formatNumber(favorite.jobPosting.transferPrice)}万
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="small"
                        className="text-ink-muted hover:text-red-500"
                        onClick={() => handleRemove(favorite.jobPosting.id)}
                        disabled={removingId === favorite.jobPosting.id}
                      >
                        {removingId === favorite.jobPosting.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="w-12 h-12 text-ink-muted mx-auto mb-4" />
            <p className="text-ink-muted">まだお気に入りはありません</p>
            <p className="text-small text-ink-muted mt-2">
              気になる求人をお気に入りに追加してみましょう
            </p>
            <Button className="mt-4" asChild>
              <Link href="/doctor/jobs">
                <Search className="w-4 h-4 mr-2" />
                求人を探す
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
