"use client";

import * as React from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  MessageCircle,
  Search,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface ChatRoom {
  id: string;
  participantName: string;
  participantUserId: string | null;
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
  relatedJobId: string | null;
  isAnonymous: boolean;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  isRead: boolean;
  createdAt: string;
}

export default function CorporationChatPage() {
  const [chatRooms, setChatRooms] = React.useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoadingRooms, setIsLoadingRooms] = React.useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const selectedRoomData = chatRooms.find((room) => room.id === selectedRoom);

  // チャットルーム一覧を取得
  async function loadChatRooms(selectFirst = false) {
    try {
      const response = await fetch("/api/chat/rooms");
      const data = await response.json();
      if (data.rooms) {
        setChatRooms(data.rooms);
        if (selectFirst && data.rooms.length > 0) {
          setSelectedRoom(data.rooms[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
    } finally {
      setIsLoadingRooms(false);
    }
  }

  // メッセージを取得
  async function loadMessages(roomId: string) {
    setIsLoadingMessages(true);
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}/messages`);
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      if (data.roomInfo?.participantUserId) {
        const myMessage = data.messages?.find(
          (m: Message) => m.senderId !== data.roomInfo.participantUserId
        );
        if (myMessage) {
          setCurrentUserId(myMessage.senderId);
        }
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  }

  // 手動で新着を確認
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  async function handleRefresh() {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await loadChatRooms(false);
      if (selectedRoom) {
        const response = await fetch(`/api/chat/rooms/${selectedRoom}/messages`);
        const data = await response.json();
        if (data.messages) {
          const hasNew = data.messages.length > messages.length;
          setMessages(data.messages);
          if (hasNew) {
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }
        }
      }
    } catch (error) {
      console.error("Failed to refresh:", error);
    } finally {
      setIsRefreshing(false);
    }
  }

  // 初回読み込み（1回だけ）
  React.useEffect(() => {
    loadChatRooms(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ルーム選択時にメッセージを読み込み
  React.useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedRoom || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/chat/rooms/${selectedRoom}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          setMessages((prev) => [...prev, data.message]);
          setCurrentUserId(data.message.senderId);
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
        setMessage("");
        loadChatRooms(false);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredRooms = chatRooms.filter(
    (room) =>
      room.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  if (isLoadingRooms) {
    return (
      <div className="space-y-6">
        <PageHeader title="メッセージ" description="ドクターとのメッセージをやり取りできます" />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (chatRooms.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="メッセージ" description="ドクターとのメッセージをやり取りできます" />
        <Card>
          <CardContent className="py-12 text-center">
            <MessageCircle className="w-12 h-12 text-ink-muted mx-auto mb-4" />
            <p className="text-ink-muted">まだメッセージはありません</p>
            <p className="text-small text-ink-muted mt-2">
              応募があるか、スカウトに返信があるとメッセージが開始されます
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="メッセージ"
        description="ドクターとのメッセージをやり取りできます"
        actions={
          <Button
            variant="outline"
            size="small"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
            新着確認
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
        {/* Chat Room List */}
        <Card className="lg:col-span-1 flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <Input
                placeholder="検索..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`w-full p-4 text-left border-b border-border hover:bg-surface-sunken transition-colors ${
                  selectedRoom === room.id ? "bg-surface-sunken" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center flex-shrink-0">
                    <span className="text-body font-medium text-accent">
                      {room.participantName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-body font-medium truncate">
                        {room.participantName}
                      </p>
                      {room.unreadCount > 0 && (
                        <Badge className="flex-shrink-0">{room.unreadCount}</Badge>
                      )}
                    </div>
                    {room.lastMessage && (
                      <p className="text-small text-ink-muted truncate mt-1">
                        {room.lastMessage}
                      </p>
                    )}
                    <p className="text-caption text-ink-muted mt-1">
                      {formatRelativeTime(room.lastMessageAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedRoomData ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center">
                    <span className="text-body font-medium text-accent">
                      {selectedRoomData.participantName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-body font-medium">
                      {selectedRoomData.participantName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-ink-muted">メッセージはまだありません</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            isMe
                              ? "bg-accent text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                              : "bg-surface-sunken rounded-tl-lg rounded-tr-lg rounded-br-lg"
                          } p-3`}
                        >
                          {!isMe && (
                            <p className="text-caption font-medium mb-1">
                              {msg.senderName}
                            </p>
                          )}
                          <p className="text-small">{msg.content}</p>
                          <p
                            className={`text-caption mt-1 ${
                              isMe ? "text-white/70" : "text-ink-muted"
                            }`}
                          >
                            {formatRelativeTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="メッセージを入力..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                    disabled={isSending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isSending}
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-ink-muted">チャットルームを選択してください</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
