import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: チャットルームのメッセージ一覧を取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const { roomId } = await params;
    const userId = session.user.id;

    // ユーザーがこのチャットルームの参加者か確認
    const participant = await prisma.chatParticipant.findFirst({
      where: {
        chatRoomId: roomId,
        userId: userId,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "このチャットルームにアクセスする権限がありません" },
        { status: 403 }
      );
    }

    // チャットルームの情報と参加者を取得
    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        participants: true,
      },
    });

    if (!chatRoom) {
      return NextResponse.json(
        { error: "チャットルームが見つかりません" },
        { status: 404 }
      );
    }

    // メッセージを取得
    const messages = await prisma.chatMessage.findMany({
      where: {
        chatRoomId: roomId,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    // 自分以外が送信した未読メッセージを既読にする
    await prisma.chatMessage.updateMany({
      where: {
        chatRoomId: roomId,
        senderId: {
          not: userId,
        },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    // メッセージに送信者の表示名を追加
    const participantMap = new Map(
      chatRoom.participants.map((p) => [p.userId, p.displayName])
    );

    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      senderName: participantMap.get(msg.senderId) || "不明",
      senderRole: msg.sender.role,
      isRead: msg.isRead,
      createdAt: msg.createdAt,
    }));

    // 相手の情報を取得
    const otherParticipant = chatRoom.participants.find(
      (p) => p.userId !== userId
    );

    return NextResponse.json({
      messages: formattedMessages,
      roomInfo: {
        id: chatRoom.id,
        participantName: otherParticipant?.displayName || "不明",
        participantUserId: otherParticipant?.userId || null,
        isAnonymous: chatRoom.isAnonymous,
        relatedJobId: chatRoom.relatedJobId,
      },
    });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: "メッセージの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// POST: メッセージを送信
export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const { roomId } = await params;
    const userId = session.user.id;
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "メッセージ内容が必要です" },
        { status: 400 }
      );
    }

    // ユーザーがこのチャットルームの参加者か確認
    const participant = await prisma.chatParticipant.findFirst({
      where: {
        chatRoomId: roomId,
        userId: userId,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "このチャットルームにアクセスする権限がありません" },
        { status: 403 }
      );
    }

    // メッセージを作成
    const message = await prisma.chatMessage.create({
      data: {
        chatRoomId: roomId,
        senderId: userId,
        content: content.trim(),
        isRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    // チャットルームの更新日時を更新
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      message: {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        senderName: participant.displayName,
        senderRole: message.sender.role,
        isRead: message.isRead,
        createdAt: message.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json(
      { error: "メッセージの送信に失敗しました" },
      { status: 500 }
    );
  }
}
