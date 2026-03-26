import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: 全ユーザー一覧を取得（管理者専用）
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        doctorProfile: {
          select: { displayName: true },
        },
        corporationProfile: {
          select: { corporationName: true },
        },
        consultantProfile: {
          select: { displayName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = users.map((user) => {
      let name = "管理者";
      if (user.role === "DOCTOR" && user.doctorProfile) {
        name = user.doctorProfile.displayName;
      } else if (user.role === "CORPORATION" && user.corporationProfile) {
        name = user.corporationProfile.corporationName;
      } else if (user.role === "CONSULTANT" && user.consultantProfile) {
        name = user.consultantProfile.displayName;
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        name,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Admin users fetch error:", error);
    const message = error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      { error: `ユーザー一覧の取得に失敗しました: ${message}` },
      { status: 500 }
    );
  }
}
