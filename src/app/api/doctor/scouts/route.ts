import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: ドクターが受信したスカウト一覧を取得
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    // ドクタープロフィールを取得
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctorProfile) {
      return NextResponse.json(
        { error: "ドクタープロフィールが見つかりません" },
        { status: 404 }
      );
    }

    const scouts = await prisma.scout.findMany({
      where: { doctorProfileId: doctorProfile.id },
      include: {
        corporation: {
          select: {
            id: true,
            corporationName: true,
            logoUrl: true,
          },
        },
        jobPosting: {
          select: {
            id: true,
            title: true,
            clinicName: true,
            clinicArea: true,
            department: true,
            salaryMin: true,
            salaryMax: true,
            transferPrice: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ scouts });
  } catch (error) {
    console.error("Failed to fetch doctor scouts:", error);
    return NextResponse.json(
      { error: "スカウト一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// PATCH: スカウトのステータスを更新
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
    const { scoutId, status } = body;

    if (!scoutId || !status) {
      return NextResponse.json(
        { error: "必要なパラメータが不足しています" },
        { status: 400 }
      );
    }

    // 有効なステータスか確認
    const validStatuses = ["READ", "INTERESTED", "DECLINED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "無効なステータスです" },
        { status: 400 }
      );
    }

    // ドクタープロフィールを取得
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctorProfile) {
      return NextResponse.json(
        { error: "ドクタープロフィールが見つかりません" },
        { status: 404 }
      );
    }

    // スカウトが自分宛てか確認
    const scout = await prisma.scout.findFirst({
      where: {
        id: scoutId,
        doctorProfileId: doctorProfile.id,
      },
    });

    if (!scout) {
      return NextResponse.json(
        { error: "スカウトが見つかりません" },
        { status: 404 }
      );
    }

    // ステータスを更新
    const updatedScout = await prisma.scout.update({
      where: { id: scoutId },
      data: { status },
    });

    return NextResponse.json({
      message: "ステータスを更新しました",
      scout: updatedScout,
    });
  } catch (error) {
    console.error("Failed to update scout status:", error);
    return NextResponse.json(
      { error: "ステータスの更新に失敗しました" },
      { status: 500 }
    );
  }
}
