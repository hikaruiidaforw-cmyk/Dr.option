import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: ドクターダッシュボード用の統計情報を取得
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
      select: { id: true },
    });

    if (!doctorProfile) {
      return NextResponse.json(
        { error: "ドクタープロフィールが見つかりません" },
        { status: 404 }
      );
    }

    const [applicationCount, favoriteCount, unreadScoutCount, recentApplications, recentScouts] =
      await Promise.all([
        // 応募中の件数（PENDING, REVIEWING, INTERVIEW）
        prisma.application.count({
          where: {
            doctorProfileId: doctorProfile.id,
            status: { in: ["PENDING", "REVIEWING", "INTERVIEW"] },
          },
        }),
        // お気に入り件数
        prisma.favorite.count({
          where: { doctorProfileId: doctorProfile.id },
        }),
        // 未読スカウト件数
        prisma.scout.count({
          where: {
            doctorProfileId: doctorProfile.id,
            status: "SENT",
          },
        }),
        // 最近の応募（最新5件）
        prisma.application.findMany({
          where: { doctorProfileId: doctorProfile.id },
          include: {
            jobPosting: {
              select: {
                title: true,
                clinicName: true,
                clinicArea: true,
                department: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        // 最近のスカウト（最新5件）
        prisma.scout.findMany({
          where: { doctorProfileId: doctorProfile.id },
          include: {
            jobPosting: {
              select: {
                title: true,
                clinicName: true,
                clinicArea: true,
              },
            },
            corporation: {
              select: { corporationName: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    return NextResponse.json({
      stats: {
        applicationCount,
        favoriteCount,
        unreadScoutCount,
      },
      recentApplications: recentApplications.map((app) => ({
        id: app.id,
        status: app.status,
        createdAt: app.createdAt.toISOString(),
        jobPosting: app.jobPosting,
      })),
      recentScouts: recentScouts.map((scout) => ({
        id: scout.id,
        status: scout.status,
        message: scout.message,
        createdAt: scout.createdAt.toISOString(),
        corporationName: scout.corporation.corporationName,
        jobPosting: scout.jobPosting,
      })),
    });
  } catch (error) {
    console.error("Doctor dashboard fetch error:", error);
    return NextResponse.json(
      { error: "ダッシュボードデータの取得に失敗しました" },
      { status: 500 }
    );
  }
}
