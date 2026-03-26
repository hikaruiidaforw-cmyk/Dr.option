import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: ドクター詳細を取得（法人向け）
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const { id } = await params;

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

    // ドクタープロフィールを取得
    const doctor = await prisma.doctorProfile.findUnique({
      where: { id },
      include: {
        specialties: true,
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { error: "ドクターが見つかりません" },
        { status: 404 }
      );
    }

    if (!doctor.isPublic) {
      return NextResponse.json(
        { error: "このドクターのプロフィールは非公開です" },
        { status: 403 }
      );
    }

    // 必要な情報のみ返す（実名は法人には非公開）
    const formattedDoctor = {
      id: doctor.id,
      displayName: doctor.displayName,
      medicalLicenseYear: doctor.medicalLicenseYear,
      specialties: doctor.specialties.map((s) => ({
        name: s.name,
        yearsOfExp: s.yearsOfExp,
      })),
      boardCertifications: doctor.boardCertifications,
      currentHospital: doctor.currentHospital,
      currentPosition: doctor.currentPosition,
      desiredDepartments: doctor.desiredDepartments,
      desiredAreas: doctor.desiredAreas,
      desiredSalaryMin: doctor.desiredSalaryMin,
      desiredSalaryMax: doctor.desiredSalaryMax,
      independenceTimeline: doctor.independenceTimeline,
      selfIntroduction: doctor.selfIntroduction,
      isPublic: doctor.isPublic,
      lastActiveAt: doctor.lastActiveAt,
    };

    return NextResponse.json({ doctor: formattedDoctor });
  } catch (error) {
    console.error("Failed to fetch doctor:", error);
    return NextResponse.json(
      { error: "ドクター情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
