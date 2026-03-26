import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: 法人への応募者一覧を取得
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

    // 法人の求人への応募を取得
    const applications = await prisma.application.findMany({
      where: {
        jobPosting: {
          corporationId: corporationProfile.id,
        },
      },
      include: {
        doctorProfile: {
          select: {
            id: true,
            userId: true,
            displayName: true,
            medicalLicenseYear: true,
            currentHospital: true,
            currentPosition: true,
            desiredAreas: true,
            independenceTimeline: true,
            specialties: {
              select: {
                name: true,
                yearsOfExp: true,
              },
            },
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

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Failed to fetch applicants:", error);
    return NextResponse.json(
      { error: "応募者一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// PATCH: 応募ステータスを更新
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { applicationId, status } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "必要なパラメータが不足しています" },
        { status: 400 }
      );
    }

    // 有効なステータスか確認
    const validStatuses = ["REVIEWING", "INTERVIEW", "MATCHED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "無効なステータスです" },
        { status: 400 }
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

    // 応募が自社の求人へのものか確認
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        jobPosting: {
          corporationId: corporationProfile.id,
        },
      },
      include: {
        doctorProfile: {
          include: {
            user: true,
          },
        },
        jobPosting: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "応募が見つかりません" },
        { status: 404 }
      );
    }

    // ステータスを更新し、ドクターに通知を送信
    const updatedApplication = await prisma.$transaction(async (tx) => {
      const updated = await tx.application.update({
        where: { id: applicationId },
        data: { status },
      });

      // ドクターに通知を送信
      await tx.notification.create({
        data: {
          userId: application.doctorProfile.user.id,
          type: "STATUS_CHANGED",
          title: "応募ステータスが更新されました",
          message: `「${application.jobPosting.title}」への応募ステータスが更新されました。`,
          linkUrl: `/doctor/applications`,
        },
      });

      return updated;
    });

    return NextResponse.json({
      message: "ステータスを更新しました",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Failed to update application status:", error);
    return NextResponse.json(
      { error: "ステータスの更新に失敗しました" },
      { status: 500 }
    );
  }
}
