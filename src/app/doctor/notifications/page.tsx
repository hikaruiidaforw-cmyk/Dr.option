"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Mail,
  FileText,
  MessageCircle,
  UserPlus,
  CheckCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { NOTIFICATION_TYPE_LABELS } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/utils";

type NotificationType = keyof typeof NOTIFICATION_TYPE_LABELS;

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "SCOUT_RECEIVED":
      return <UserPlus className="w-5 h-5" />;
    case "STATUS_CHANGED":
      return <FileText className="w-5 h-5" />;
    case "NEW_MESSAGE":
      return <MessageCircle className="w-5 h-5" />;
    case "NEW_APPLICATION":
      return <Mail className="w-5 h-5" />;
    case "CONTRACT_READY":
      return <CheckCircle className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

export default function DoctorNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMarkingAllRead, setIsMarkingAllRead] = React.useState(false);

  const fetchNotifications = React.useCallback(async () => {
    try {
      const res = await fetch("/api/doctor/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data: Notification[] = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("通知の取得に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await fetch("/api/doctor/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: notification.id }),
        });
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
      } catch (error) {
        console.error("既読処理に失敗しました:", error);
      }
    }
    if (notification.linkUrl) {
      router.push(notification.linkUrl);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAllRead(true);
    try {
      const res = await fetch("/api/doctor/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (!res.ok) throw new Error("Failed to mark all as read");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("一括既読処理に失敗しました:", error);
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="通知"
          description="お知らせや更新情報を確認できます"
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-ink-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="通知"
        description="お知らせや更新情報を確認できます"
        actions={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              size="small"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllRead}
            >
              {isMarkingAllRead && (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              )}
              すべて既読にする
            </Button>
          ) : undefined
        }
      />

      {/* Stats */}
      <div className="flex items-center gap-4">
        <Badge variant={unreadCount > 0 ? "default" : "secondary"}>
          未読 {unreadCount}件
        </Badge>
        <span className="text-small text-ink-muted">
          全{notifications.length}件の通知
        </span>
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-colors cursor-pointer ${
                !notification.isRead
                  ? "border-accent bg-accent/5"
                  : "hover:border-border-strong"
              }`}
              onClick={() => handleMarkAsRead(notification)}
            >
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${
                      !notification.isRead
                        ? "bg-accent text-white"
                        : "bg-surface-sunken text-ink-muted"
                    }`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={`text-body ${
                            !notification.isRead ? "font-medium" : ""
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-small text-ink-muted mt-1">
                          {notification.message}
                        </p>
                        <p className="text-caption text-ink-muted mt-2">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {notification.linkUrl && (
                          <ExternalLink className="w-4 h-4 text-ink-muted" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="w-12 h-12 text-ink-muted mx-auto mb-4" />
            <p className="text-ink-muted">通知はありません</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
