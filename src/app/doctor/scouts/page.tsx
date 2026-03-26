"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Building2,
  MapPin,
  Clock,
  Mail,
  CheckCircle,
  XCircle,
  ExternalLink,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { SCOUT_STATUS_LABELS } from "@/lib/constants";
import { formatNumber, formatRelativeTime } from "@/lib/utils";

type ScoutStatus = keyof typeof SCOUT_STATUS_LABELS;

interface Scout {
  id: string;
  status: ScoutStatus;
  message: string;
  createdAt: string;
  corporation: {
    id: string;
    corporationName: string;
    logoUrl: string | null;
  };
  jobPosting: {
    id: string;
    title: string;
    clinicName: string;
    clinicArea: string;
    department: string;
    salaryMin: number | null;
    salaryMax: number | null;
    transferPrice: number | null;
  };
}

const getStatusBadgeVariant = (status: ScoutStatus) => {
  switch (status) {
    case "SENT":
      return "default";
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

export default function DoctorScoutsPage() {
  const router = useRouter();
  const [scouts, setScouts] = React.useState<Scout[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"all" | "unread" | "read">("all");
  const [respondingId, setRespondingId] = React.useState<string | null>(null);

  // スカウト一覧を取得
  React.useEffect(() => {
    const fetchScouts = async () => {
      try {
        const response = await fetch("/api/doctor/scouts");
        const data = await response.json();
        if (response.ok && data.scouts) {
          setScouts(data.scouts);
        }
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
    if (filter === "unread") return scout.status === "SENT";
    if (filter === "read") return scout.status !== "SENT";
    return true;
  });

  const unreadCount = scouts.filter((s) => s.status === "SENT").length;

  const handleRespond = async (scoutId: string, response: "INTERESTED" | "DECLINED") => {
    setRespondingId(scoutId);
    try {
      const apiResponse = await fetch("/api/doctor/scouts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scoutId, status: response }),
      });

      if (apiResponse.ok) {
        // ローカルの状態を更新
        setScouts((prev) =>
          prev.map((s) =>
            s.id === scoutId ? { ...s, status: response } : s
          )
        );

        // 興味ありの場合はチャットに遷移
        if (response === "INTERESTED") {
          router.push("/doctor/chat");
        }
      }
    } catch (error) {
      console.error("Failed to respond to scout:", error);
    } finally {
      setRespondingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="スカウト"
          description="医療法人からのスカウトを確認できます"
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
        title="スカウト"
        description="医療法人からのスカウトを確認できます"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-caption text-ink-muted">全スカウト</p>
            <p className="text-numeric-l">{scouts.length}</p>
          </CardContent>
        </Card>
        <Card className={unreadCount > 0 ? "border-accent" : ""}>
          <CardContent className="pt-4">
            <p className="text-caption text-ink-muted">未読</p>
            <p className="text-numeric-l text-accent">{unreadCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-caption text-ink-muted">興味あり</p>
            <p className="text-numeric-l">
              {scouts.filter((s) => s.status === "INTERESTED").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {scouts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="w-12 h-12 text-ink-muted mx-auto mb-4" />
            <p className="text-ink-muted">まだスカウトはありません</p>
            <p className="text-small text-ink-muted mt-2">
              プロフィールを充実させると、スカウトが届きやすくなります
            </p>
            <Button className="mt-4" asChild>
              <Link href="/doctor/profile">プロフィールを編集</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filter Tabs */}
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              <TabsTrigger value="all">すべて ({scouts.length})</TabsTrigger>
              <TabsTrigger value="unread">未読 ({unreadCount})</TabsTrigger>
              <TabsTrigger value="read">既読 ({scouts.length - unreadCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="mt-6">
              {filteredScouts.length > 0 ? (
                <div className="space-y-4">
                  {filteredScouts.map((scout) => (
                    <Card
                      key={scout.id}
                      className={`hover:border-border-strong transition-colors ${
                        scout.status === "SENT" ? "border-accent bg-accent/5" : ""
                      }`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col gap-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={getStatusBadgeVariant(scout.status)}>
                                {SCOUT_STATUS_LABELS[scout.status]}
                              </Badge>
                              <span className="text-caption text-ink-muted">
                                {formatRelativeTime(scout.createdAt)}
                              </span>
                            </div>
                          </div>

                          {/* Corporation & Job */}
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded bg-surface-sunken flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-5 h-5 text-ink-muted" />
                            </div>
                            <div className="flex-1">
                              <p className="text-body font-medium">
                                {scout.corporation.corporationName}
                              </p>
                              <Link
                                href={`/doctor/jobs/${scout.jobPosting.id}`}
                                className="text-small text-ink-muted hover:text-accent transition-colors"
                              >
                                {scout.jobPosting.title}
                              </Link>
                              <div className="mt-2 flex flex-wrap items-center gap-3 text-caption text-ink-muted">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {scout.jobPosting.clinicArea}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Message */}
                          <div className="p-3 bg-surface-sunken rounded">
                            <p className="text-caption text-ink-muted flex items-center gap-1 mb-1">
                              <Mail className="w-3 h-3" />
                              スカウトメッセージ
                            </p>
                            <p className="text-small whitespace-pre-wrap">{scout.message}</p>
                          </div>

                          {/* Job Details */}
                          <div className="flex flex-wrap gap-6">
                            {(scout.jobPosting.salaryMin || scout.jobPosting.salaryMax) && (
                              <div>
                                <p className="text-caption text-ink-muted">年収</p>
                                <p className="text-numeric-m">
                                  {scout.jobPosting.salaryMin && formatNumber(scout.jobPosting.salaryMin)}
                                  {scout.jobPosting.salaryMin && scout.jobPosting.salaryMax && "〜"}
                                  {scout.jobPosting.salaryMax && formatNumber(scout.jobPosting.salaryMax)}万
                                </p>
                              </div>
                            )}
                            {scout.jobPosting.transferPrice && (
                              <div>
                                <p className="text-caption text-ink-muted">譲渡価格</p>
                                <p className="text-numeric-m text-accent">
                                  {formatNumber(scout.jobPosting.transferPrice)}万
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                            <Button variant="outline" size="small" asChild>
                              <Link href={`/doctor/jobs/${scout.jobPosting.id}`}>
                                <ExternalLink className="w-4 h-4 mr-1" />
                                求人詳細
                              </Link>
                            </Button>

                            {scout.status === "SENT" || scout.status === "READ" ? (
                              <>
                                <Button
                                  size="small"
                                  onClick={() => handleRespond(scout.id, "INTERESTED")}
                                  disabled={respondingId === scout.id}
                                >
                                  {respondingId === scout.id ? (
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                  )}
                                  興味あり
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="small"
                                  className="text-ink-muted"
                                  onClick={() => handleRespond(scout.id, "DECLINED")}
                                  disabled={respondingId === scout.id}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  辞退
                                </Button>
                              </>
                            ) : scout.status === "INTERESTED" ? (
                              <Button size="small" asChild>
                                <Link href="/doctor/chat">
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  メッセージ
                                </Link>
                              </Button>
                            ) : null}
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
        </>
      )}
    </div>
  );
}
