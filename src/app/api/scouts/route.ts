import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const scoutSchema = z.object({
  doctorProfileId: z.string().min(1, "ドクターを選択してください"),
  jobPostingId: z.string().min(1, "求人を選択してください"),
  message: z.string().min(1, "メッセージを入力してください"),
});

// GET: 法人が送信したスカウト一覧を取得
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    // 法人プロフィールを取得
    const corporationProfile = await prisma.corporationProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!corporationProfile) {
      return NextResponse.json(
        { error: "法人プロフィールが見つかりません" },
        { status: 404 }
      );
    }

    const scouts = await prisma.scout.findMany({
      where: { corporationId: corporationProfile.id },
      include: {
        doctorProfile: {
          select: {
            id: true,
            displayName: true,
            specialties: true,
          },
        },
        jobPosting: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ scouts });
  } catch (error) {
    console.error("Failed to fetch scouts:", error);
    return NextResponse.json(
      { error: "スカウト一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// POST: スカウトを送信（チャットルームも自動作成）
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
    const validatedData = scoutSchema.parse(body);

    // 法人プロフィールを取得
    const corporationProfile = await prisma.corporationProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!corporationProfile) {
      return NextResponse.json(
        { error: "法人プロフィールが見つかりません" },
        { status: 404 }
      );
    }

    // ドクタープロフィールとそのユーザーIDを取得
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { id: validatedData.doctorProfileId },
      include: { user: true },
    });

    if (!doctorProfile) {
      return NextResponse.json(
        { error: "ドクターが見つかりません" },
        { status: 404 }
      );
    }

    // 求人が法人のものか確認
    const jobPosting = await prisma.jobPosting.findFirst({
      where: {
        id: validatedData.jobPostingId,
        corporationId: corporationProfile.id,
      },
    });

    if (!jobPosting) {
      return NextResponse.json(
        { error: "求人が見つかりません" },
        { status: 404 }
      );
    }

    // 既存のスカウトをチェック
    const existingScout = await prisma.scout.findUnique({
      where: {
        corporationId_doctorProfileId_jobPostingId: {
          corporationId: corporationProfile.id,
          doctorProfileId: validatedData.doctorProfileId,
          jobPostingId: validatedData.jobPostingId,
        },
      },
    });

    if (existingScout) {
      return NextResponse.json(
        { error: "このドクターには既にスカウトを送信しています" },
        { status: 400 }
      );
    }

    // トランザクションでスカウトとチャットルームを作成
    const result = await prisma.$transaction(async (tx) => {
      // 1. スカウトを作成
      const scout = await tx.scout.create({
        data: {
          corporationId: corporationProfile.id,
          doctorProfileId: validatedData.doctorProfileId,
          jobPostingId: validatedData.jobPostingId,
          message: validatedData.message,
          status: "SENT",
        },
      });

      // 2. 既存のチャットルームをチェック
      let chatRoom = await tx.chatRoom.findFirst({
        where: {
          AND: [
            {
              participants: {
                some: { userId: session.user!.id },
              },
            },
            {
              participants: {
                some: { userId: doctorProfile.userId },
              },
            },
            { relatedJobId: validatedData.jobPostingId },
          ],
        },
      });

      // 3. チャットルームが存在しなければ作成
      if (!chatRoom) {
        chatRoom = await tx.chatRoom.create({
          data: {
            relatedJobId: validatedData.jobPostingId,
            isAnonymous: true,
            participants: {
              create: [
                {
                  userId: session.user!.id,
                  displayName: corporationProfile.corporationName,
                },
                {
                  userId: doctorProfile.userId,
                  displayName: doctorProfile.displayName,
                },
              ],
            },
          },
        });
      }

      // 4. スカウトメッセージをチャットに追加
      const chatMessage = await tx.chatMessage.create({
        data: {
          chatRoomId: chatRoom.id,
          senderId: session.user!.id,
          content: `【スカウトメッセージ】\n\n${validatedData.message}`,
          isRead: false,
        },
      });

      // 5. 通知を作成
      await tx.notification.create({
        data: {
          userId: doctorProfile.userId,
          type: "SCOUT_RECEIVED",
          title: "新しいスカウトが届きました",
          message: `${corporationProfile.corporationName}からスカウトが届きました`,
          linkUrl: `/doctor/scouts`,
        },
      });

      return { scout, chatRoom, chatMessage };
    });

    return NextResponse.json({
      message: "スカウトを送信しました",
      scout: result.scout,
      chatRoomId: result.chatRoom.id,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to send scout:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "入力内容に誤りがあります", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "スカウトの送信に失敗しました" },
      { status: 500 }
    );
  }
}
