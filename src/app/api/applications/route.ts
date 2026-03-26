import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const applicationSchema = z.object({
  jobPostingId: z.string(),
  coverLetter: z.string().optional(),
});

// GET: 自分の応募一覧を取得
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctorProfile) {
      return NextResponse.json(
        { error: "ドクタープロフィールが見つかりません" },
        { status: 404 }
      );
    }

    const applications = await prisma.application.findMany({
      where: { doctorProfileId: doctorProfile.id },
      include: {
        jobPosting: {
          include: {
            corporation: {
              select: {
                id: true,
                corporationName: true,
                logoUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json(
      { error: "応募一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// POST: 求人に応募
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
    const validatedData = applicationSchema.parse(body);

    // ドクタープロフィールを取得
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctorProfile) {
      return NextResponse.json(
        { error: "応募するにはプロフィールの登録が必要です" },
        { status: 400 }
      );
    }

    // 求人が存在し、公開中か確認
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id: validatedData.jobPostingId },
      include: {
        corporation: true,
      },
    });

    if (!jobPosting || jobPosting.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "この求人には応募できません" },
        { status: 400 }
      );
    }

    // 既に応募済みか確認
    const existingApplication = await prisma.application.findUnique({
      where: {
        doctorProfileId_jobPostingId: {
          doctorProfileId: doctorProfile.id,
          jobPostingId: validatedData.jobPostingId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "この求人には既に応募済みです" },
        { status: 400 }
      );
    }

    // 応募を作成し、チャットルームを作成し、法人に通知を送信
    const result = await prisma.$transaction(async (tx) => {
      // 応募を作成
      const application = await tx.application.create({
        data: {
          doctorProfileId: doctorProfile.id,
          jobPostingId: validatedData.jobPostingId,
          coverLetter: validatedData.coverLetter || null,
          status: "PENDING",
        },
      });

      // 既存のチャットルームを確認
      const existingRoom = await tx.chatRoom.findFirst({
        where: {
          relatedJobId: validatedData.jobPostingId,
          participants: {
            some: {
              userId: session.user.id,
            },
          },
        },
      });

      if (!existingRoom) {
        // チャットルームを作成
        const chatRoom = await tx.chatRoom.create({
          data: {
            relatedJobId: validatedData.jobPostingId,
            isAnonymous: true,
            participants: {
              create: [
                {
                  userId: session.user.id,
                  displayName: doctorProfile.displayName,
                },
                {
                  userId: jobPosting.corporation.userId,
                  displayName: jobPosting.corporation.corporationName,
                },
              ],
            },
          },
        });

        // 応募メッセージをチャットに追加
        if (validatedData.coverLetter) {
          await tx.chatMessage.create({
            data: {
              chatRoomId: chatRoom.id,
              senderId: session.user.id,
              content: `【応募メッセージ】\n${validatedData.coverLetter}`,
            },
          });
        } else {
          await tx.chatMessage.create({
            data: {
              chatRoomId: chatRoom.id,
              senderId: session.user.id,
              content: `「${jobPosting.title}」に応募しました。よろしくお願いいたします。`,
            },
          });
        }
      }

      // 法人に通知を送信
      await tx.notification.create({
        data: {
          userId: jobPosting.corporation.userId,
          type: "NEW_APPLICATION",
          title: "新しい応募がありました",
          message: `${doctorProfile.displayName}さんが「${jobPosting.title}」に応募しました。`,
          linkUrl: `/corporation/applicants`,
        },
      });

      return application;
    });

    return NextResponse.json({
      message: "応募が完了しました",
      application: result,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to apply:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "入力内容に誤りがあります", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "応募に失敗しました" },
      { status: 500 }
    );
  }
}
