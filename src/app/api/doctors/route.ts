import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: 公開されているドクター一覧を取得（法人向け）
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    // 法人ユーザーかどうか確認
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.role !== "CORPORATION" && user?.role !== "ADMIN" && user?.role !== "CONSULTANT") {
      return NextResponse.json(
        { error: "この機能にアクセスする権限がありません" },
        { status: 403 }
      );
    }

    // 公開されているドクタープロフィールを取得
    const doctors = await prisma.doctorProfile.findMany({
      where: { isPublic: true },
      include: {
        specialties: true,
      },
      orderBy: { lastActiveAt: "desc" },
    });

    // 必要な情報のみ返す
    const formattedDoctors = doctors.map((doctor) => ({
      id: doctor.id,
      displayName: doctor.displayName,
      medicalLicenseYear: doctor.medicalLicenseYear,
      specialties: doctor.specialties.map((s) => ({
        name: s.name,
        yearsOfExp: s.yearsOfExp,
      })),
      boardCertifications: doctor.boardCertifications,
      currentPosition: doctor.currentPosition,
      desiredDepartments: doctor.desiredDepartments,
      desiredAreas: doctor.desiredAreas,
      desiredSalaryMin: doctor.desiredSalaryMin,
      desiredSalaryMax: doctor.desiredSalaryMax,
      independenceTimeline: doctor.independenceTimeline,
      lastActiveAt: doctor.lastActiveAt,
    }));

    return NextResponse.json({ doctors: formattedDoctors });
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
    return NextResponse.json(
      { error: "ドクター一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
