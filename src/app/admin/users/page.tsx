"use client";

import * as React from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Users,
  Building2,
  UserCog,
  Search,
  MoreVertical,
  Mail,
  Calendar,
  Shield,
  Loader2,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/constants";

type UserRole = keyof typeof ROLE_LABELS;

interface UserData {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case "DOCTOR":
      return <Users className="w-4 h-4" />;
    case "CORPORATION":
      return <Building2 className="w-4 h-4" />;
    case "CONSULTANT":
      return <UserCog className="w-4 h-4" />;
    case "ADMIN":
      return <Shield className="w-4 h-4" />;
    default:
      return <Users className="w-4 h-4" />;
  }
};

const getRoleBadgeVariant = (role: UserRole) => {
  switch (role) {
    case "DOCTOR":
      return "secondary";
    case "CORPORATION":
      return "default";
    case "CONSULTANT":
      return "outline";
    case "ADMIN":
      return "default";
    default:
      return "outline";
  }
};

export default function AdminUsersPage() {
  const [filter, setFilter] = React.useState<
    "all" | "doctor" | "corporation" | "consultant" | "admin"
  >("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [users, setUsers] = React.useState<UserData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // DBからユーザーデータを取得
  React.useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/users");
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "ユーザー一覧の取得に失敗しました");
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    // Role filter
    if (filter === "all") {
      // OK
    } else if (filter === "doctor" && user.role !== "DOCTOR") {
      return false;
    } else if (filter === "corporation" && user.role !== "CORPORATION") {
      return false;
    } else if (filter === "consultant" && user.role !== "CONSULTANT") {
      return false;
    } else if (filter === "admin" && user.role !== "ADMIN") {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.email.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const counts = {
    all: users.length,
    doctor: users.filter((u) => u.role === "DOCTOR").length,
    corporation: users.filter((u) => u.role === "CORPORATION").length,
    consultant: users.filter((u) => u.role === "CONSULTANT").length,
    admin: users.filter((u) => u.role === "ADMIN").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ユーザー管理"
        description="登録ユーザーを確認・管理します"
      />

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <Input
              placeholder="メールアドレス、名前で検索..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading / Error */}
      {isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 text-ink-muted mx-auto mb-3 animate-spin" />
            <p className="text-ink-muted">ユーザーデータを読み込んでいます...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-error">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      {!isLoading && !error && (
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">すべて ({counts.all})</TabsTrigger>
            <TabsTrigger value="doctor">ドクター ({counts.doctor})</TabsTrigger>
            <TabsTrigger value="corporation">法人 ({counts.corporation})</TabsTrigger>
            <TabsTrigger value="consultant">
              コンサル ({counts.consultant})
            </TabsTrigger>
            <TabsTrigger value="admin">管理者 ({counts.admin})</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            {filteredUsers.length > 0 ? (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-caption text-ink-muted font-medium">
                          ユーザー
                        </th>
                        <th className="text-left p-4 text-caption text-ink-muted font-medium">
                          ロール
                        </th>
                        <th className="text-left p-4 text-caption text-ink-muted font-medium">
                          ステータス
                        </th>
                        <th className="text-left p-4 text-caption text-ink-muted font-medium">
                          登録日
                        </th>
                        <th className="text-left p-4 text-caption text-ink-muted font-medium">
                          最終ログイン
                        </th>
                        <th className="text-right p-4 text-caption text-ink-muted font-medium">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-border last:border-b-0 hover:bg-surface-sunken transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center">
                                {getRoleIcon(user.role)}
                              </div>
                              <div>
                                <p className="text-body font-medium">{user.name}</p>
                                <p className="text-small text-ink-muted flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={getRoleBadgeVariant(user.role)}>
                              {ROLE_LABELS[user.role]}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant={user.isActive ? "default" : "outline"}>
                              {user.isActive ? "アクティブ" : "非アクティブ"}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <p className="text-small text-ink-muted flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatRelativeTime(user.createdAt)}
                            </p>
                          </td>
                          <td className="p-4">
                            <p className="text-small text-ink-muted">
                              {user.lastLoginAt
                                ? formatRelativeTime(user.lastLoginAt)
                                : "未ログイン"}
                            </p>
                          </td>
                          <td className="p-4 text-right">
                            <Button variant="ghost" size="small">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-ink-muted">該当するユーザーはいません</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
