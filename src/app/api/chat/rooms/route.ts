import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: ログインユーザーのチャットルーム一覧を取得
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // ユーザーが参加しているチャットルームを取得
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            chatRoom: false,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // 最新のメッセージのみ
        },
        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                senderId: {
                  not: userId, // 自分以外が送信した未読メッセージ
                },
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // レスポンス用にデータを整形
    const formattedRooms = chatRooms.map((room) => {
      const otherParticipant = room.participants.find(
        (p) => p.userId !== userId
      );
      const lastMessage = room.messages[0] || null;

      return {
        id: room.id,
        participantName: otherParticipant?.displayName || "不明",
        participantUserId: otherParticipant?.userId || null,
        lastMessage: lastMessage?.content || null,
        lastMessageAt: lastMessage?.createdAt || room.createdAt,
        unreadCount: room._count.messages,
        relatedJobId: room.relatedJobId,
        isAnonymous: room.isAnonymous,
        createdAt: room.createdAt,
      };
    });

    return NextResponse.json({ rooms: formattedRooms });
  } catch (error) {
    console.error("Failed to fetch chat rooms:", error);
    return NextResponse.json(
      { error: "チャットルームの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// POST: 新しいチャットルームを作成
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { targetUserId, relatedJobId, isAnonymous = true } = body;

    if (!targetUserId) {
      return NextResponse.json(
        { error: "対象ユーザーIDが必要です" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // 既存のチャットルームをチェック（同じ2人のルームが既にあるか）
    const existingRoom = await prisma.chatRoom.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                userId: userId,
              },
            },
          },
          {
            participants: {
              some: {
                userId: targetUserId,
              },
            },
          },
          relatedJobId ? { relatedJobId: relatedJobId } : {},
        ],
      },
      include: {
        participants: true,
      },
    });

    if (existingRoom) {
      return NextResponse.json({ room: existingRoom });
    }

    // ユーザー情報を取得して表示名を決定
    const [currentUser, targetUser] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          doctorProfile: true,
          corporationProfile: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: targetUserId },
        include: {
          doctorProfile: true,
          corporationProfile: true,
        },
      }),
    ]);

    if (!currentUser || !targetUser) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // 表示名を決定
    const getDisplayName = (user: typeof currentUser, anonymous: boolean) => {
      if (user?.role === "DOCTOR") {
        return anonymous
          ? user.doctorProfile?.displayName || "ドクター"
          : user.doctorProfile?.realName || user.doctorProfile?.displayName || "ドクター";
      } else if (user?.role === "CORPORATION") {
        return user.corporationProfile?.corporationName || "医療法人";
      }
      return "ユーザー";
    };

    // 新しいチャットルームを作成
    const newRoom = await prisma.chatRoom.create({
      data: {
        relatedJobId: relatedJobId || null,
        isAnonymous: isAnonymous,
        participants: {
          create: [
            {
              userId: userId,
              displayName: getDisplayName(currentUser, isAnonymous),
            },
            {
              userId: targetUserId,
              displayName: getDisplayName(targetUser, isAnonymous),
            },
          ],
        },
      },
      include: {
        participants: true,
      },
    });

    return NextResponse.json({ room: newRoom }, { status: 201 });
  } catch (error) {
    console.error("Failed to create chat room:", error);
    return NextResponse.json(
      { error: "チャットルームの作成に失敗しました" },
      { status: 500 }
    );
  }
}
