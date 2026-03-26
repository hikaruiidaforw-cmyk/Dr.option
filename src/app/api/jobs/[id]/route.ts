import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: 求人詳細を取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const job = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        corporation: {
          select: {
            id: true,
            corporationName: true,
            corporationType: true,
            establishedYear: true,
            employeeCount: true,
            websiteUrl: true,
            logoUrl: true,
            description: true,
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: {
            applications: true,
            favorites: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "求人が見つかりません" },
        { status: 404 }
      );
    }

    // 非公開の求人は法人オーナーのみ閲覧可能
    if (job.status !== "PUBLISHED") {
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "求人が見つかりません" },
          { status: 404 }
        );
      }

      const corporationProfile = await prisma.corporationProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (corporationProfile?.id !== job.corporationId) {
        return NextResponse.json(
          { error: "求人が見つかりません" },
          { status: 404 }
        );
      }
    }

    // ログインユーザーの応募・お気に入り状態をチェック
    let hasApplied = false;
    let isFavorite = false;

    if (session?.user?.id) {
      const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (doctorProfile) {
        const [application, favorite] = await Promise.all([
          prisma.application.findUnique({
            where: {
              doctorProfileId_jobPostingId: {
                doctorProfileId: doctorProfile.id,
                jobPostingId: id,
              },
            },
          }),
          prisma.favorite.findUnique({
            where: {
              doctorProfileId_jobPostingId: {
                doctorProfileId: doctorProfile.id,
                jobPostingId: id,
              },
            },
          }),
        ]);

        hasApplied = !!application;
        isFavorite = !!favorite;
      }
    }

    return NextResponse.json({
      job,
      hasApplied,
      isFavorite,
    });
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return NextResponse.json(
      { error: "求人の取得に失敗しました" },
      { status: 500 }
    );
  }
}
