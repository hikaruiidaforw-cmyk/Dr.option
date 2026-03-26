"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  MapPin,
  Briefcase,
  Send,
  Mail,
  MessageCircle,
  ExternalLink,
  Search,
  Loader2,
} from "lucide-react";
import { SCOUT_STATUS_LABELS } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/utils";

type ScoutStatus = keyof typeof SCOUT_STATUS_LABELS;

interface Scout {
  id: string;
  status: ScoutStatus;
  message: string;
  createdAt: string;
  updatedAt: string;
  doctor: {
    id: string;
    displayName: string;
    specialties: string[];
    desiredAreas: string[];
  };
  jobPosting: {
    id: string;
    title: string;
  };
}

const getStatusBadgeVariant = (status: ScoutStatus) => {
  switch (status) {
    case "SENT":
      return "secondary";
    case "READ":
      return "secondary";
    case "INTERESTED":
      return "default";
    case "DECLINED":
      return "outline";
    default:
      return "outline";
  }
};

export default function CorporationScoutsPage() {
  const [scouts, setScouts] = React.useState<Scout[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"all" | "sent" | "interested" | "declined">(
    "all"
  );

  React.useEffect(() => {
    const fetchScouts = async () => {
      try {
        const res = await fetch("/api/corporation/scouts");
        if (!res.ok) throw new Error("Failed to fetch scouts");
        const data: Scout[] = await res.json();
        setScouts(data);
      } catch (error) {
        console.error("Failed to fetch scouts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScouts();
  }, []);

  const filteredScouts = scouts.filter((scout) => {
    if (filter === "all") return true;
    if (filter === "sent") return ["SENT", "READ"].includes(scout.status);
    return scout.status === filter.toUpperCase();
  });

  const counts = {
    all: scouts.length,
    sent: scouts.filter((s) => ["SENT", "READ"].includes(s.status)).length,
    interested: scouts.filter((s) => s.status === "INTERESTED").length,
    declined: scouts.filter((s) => s.status === "DECLINED").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-ink-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="スカウト管理"
        description="送信したスカウトの状況を確認できます"
        actions={
          <Button asChild>
            <Link href="/corporation/doctors">
              <Search className="w-4 h-4 mr-2" />
              ドクターを探す
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-caption text-ink-muted">送信数</p>
            <p className="text-numeric-l">{counts.all}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-caption text-ink-muted">返信待ち</p>
            <p className="text-numeric-l">{counts.sent}</p>
          </CardContent>
        </Card>
        <Card className={counts.interested > 0 ? "border-accent" : ""}>
          <CardContent className="pt-4">
            <p className="text-caption text-ink-muted">興味あり</p>
            <p className="text-numeric-l text-accent">{counts.interested}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-caption text-ink-muted">辞退</p>
            <p className="text-numeric-l">{counts.declined}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">すべて ({counts.all})</TabsTrigger>
          <TabsTrigger value="sent">返信待ち ({counts.sent})</TabsTrigger>
          <TabsTrigger value="interested">興味あり ({counts.interested})</TabsTrigger>
          <TabsTrigger value="declined">辞退 ({counts.declined})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {filteredScouts.length > 0 ? (
            <div className="space-y-4">
              {filteredScouts.map((scout) => (
                <Card
                  key={scout.id}
                  className={`hover:border-border-strong transition-colors ${
                    scout.status === "INTERESTED" ? "border-accent bg-accent/5" : ""
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant={getStatusBadgeVariant(scout.status)}>
                            {SCOUT_STATUS_LABELS[scout.status]}
                          </Badge>
                          <span className="text-caption text-ink-muted">
                            {formatRelativeTime(scout.createdAt)}に送信
                          </span>
                        </div>

                        {/* Doctor Info */}
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center flex-shrink-0">
                            <span className="text-h3 text-accent">
                              {scout.doctor.displayName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <Link
                              href={`/corporation/doctors/${scout.doctor.id}`}
                              className="text-h3 hover:text-accent transition-colors"
                            >
                              {scout.doctor.displayName}
                            </Link>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-small text-ink-muted">
                              {scout.doctor.desiredAreas.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {scout.doctor.desiredAreas.join("、")}
                                </span>
                              )}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {scout.doctor.specialties.map((spec) => (
                                <Badge
                                  key={spec}
                                  variant="outline"
                                  className="text-caption"
                                >
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Job Info */}
                        <div className="mt-4 p-3 bg-surface-sunken rounded">
                          <p className="text-caption text-ink-muted mb-1">対象求人</p>
                          <Link
                            href={`/corporation/jobs/${scout.jobPosting.id}`}
                            className="text-small hover:text-accent transition-colors"
                          >
                            {scout.jobPosting.title}
                          </Link>
                        </div>

                        {/* Scout Message */}
                        <div className="mt-3 p-3 border border-border rounded">
                          <p className="text-caption text-ink-muted flex items-center gap-1 mb-1">
                            <Mail className="w-3 h-3" />
                            送信メッセージ
                          </p>
                          <p className="text-small">{scout.message}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="small" asChild>
                          <Link
                            href={`/corporation/doctors/${scout.doctor.id}`}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            プロフィール
                          </Link>
                        </Button>

                        {scout.status === "INTERESTED" && (
                          <Button size="small" asChild>
                            <Link href="/corporation/chat">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              メッセージ
                            </Link>
                          </Button>
                        )}

                        {(scout.status === "SENT" || scout.status === "READ") && (
                          <Button variant="ghost" size="small" disabled>
                            <Send className="w-4 h-4 mr-1" />
                            返信待ち
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-ink-muted">該当するスカウトはありません</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {scouts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Send className="w-12 h-12 text-ink-muted mx-auto mb-4" />
            <p className="text-ink-muted">まだスカウトを送信していません</p>
            <p className="text-small text-ink-muted mt-2">
              ドクターを検索してスカウトを送信しましょう
            </p>
            <Button className="mt-4" asChild>
              <Link href="/corporation/doctors">
                <Search className="w-4 h-4 mr-2" />
                ドクターを探す
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
