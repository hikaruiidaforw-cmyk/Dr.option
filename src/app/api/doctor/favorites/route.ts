import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: お気に入り一覧を取得
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
      return NextResponse.json({ favorites: [] });
    }

    const favorites = await prisma.favorite.findMany({
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

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
    return NextResponse.json(
      { error: "お気に入りの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// POST: お気に入りに追加
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
    const { jobPostingId } = body;

    if (!jobPostingId) {
      return NextResponse.json(
        { error: "求人IDが必要です" },
        { status: 400 }
      );
    }

    // ドクタープロフィールを取得
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctorProfile) {
      return NextResponse.json(
        { error: "プロフィールの登録が必要です" },
        { status: 400 }
      );
    }

    // 求人が存在するか確認
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id: jobPostingId },
    });

    if (!jobPosting) {
      return NextResponse.json(
        { error: "求人が見つかりません" },
        { status: 404 }
      );
    }

    // 既に追加済みかチェック
    const existing = await prisma.favorite.findUnique({
      where: {
        doctorProfileId_jobPostingId: {
          doctorProfileId: doctorProfile.id,
          jobPostingId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "既にお気に入りに追加済みです", favorite: existing }
      );
    }

    // お気に入りに追加
    const favorite = await prisma.favorite.create({
      data: {
        doctorProfileId: doctorProfile.id,
        jobPostingId,
      },
    });

    return NextResponse.json({
      message: "お気に入りに追加しました",
      favorite,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return NextResponse.json(
      { error: "お気に入りの追加に失敗しました" },
      { status: 500 }
    );
  }
}

// DELETE: お気に入りから削除
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { jobPostingId } = body;

    if (!jobPostingId) {
      return NextResponse.json(
        { error: "求人IDが必要です" },
        { status: 400 }
      );
    }

    // ドクタープロフィールを取得
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctorProfile) {
      return NextResponse.json(
        { error: "プロフィールが見つかりません" },
        { status: 404 }
      );
    }

    // お気に入りを削除
    await prisma.favorite.deleteMany({
      where: {
        doctorProfileId: doctorProfile.id,
        jobPostingId,
      },
    });

    return NextResponse.json({
      message: "お気に入りから削除しました",
    });
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    return NextResponse.json(
      { error: "お気に入りの削除に失敗しました" },
      { status: 500 }
    );
  }
}
