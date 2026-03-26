import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "CONSULTANT" && user?.role !== "ADMIN") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const doctor = await prisma.doctorProfile.findUnique({
      where: { id },
      include: {
        user: { select: { email: true } },
        specialties: { select: { name: true, yearsOfExp: true } },
        applications: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            jobPosting: {
              select: {
                title: true,
                corporation: {
                  select: { corporationName: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        scoutReceived: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            corporation: {
              select: { corporationName: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        careerEvents: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: "ドクターが見つかりません" }, { status: 404 });
    }

    const formatted = {
      id: doctor.id,
      displayName: doctor.displayName,
      realName: doctor.realName,
      email: doctor.user.email,
      medicalLicenseYear: doctor.medicalLicenseYear,
      specialties: doctor.specialties.map((s) => s.name),
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
      lastActiveAt: doctor.lastActiveAt.toISOString(),
      createdAt: doctor.createdAt.toISOString(),
      applications: doctor.applications.map((a) => ({
        id: a.id,
        jobTitle: a.jobPosting.title,
        corporationName: a.jobPosting.corporation.corporationName,
        status: a.status,
        appliedAt: a.createdAt.toISOString(),
      })),
      scoutResponses: doctor.scoutReceived.map((s) => ({
        id: s.id,
        corporationName: s.corporation.corporationName,
        response: s.status,
        respondedAt: s.createdAt.toISOString(),
      })),
      careerEvents: doctor.careerEvents.map((e) => ({
        id: e.id,
        year: e.year,
        title: e.title,
        description: e.description,
      })),
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Consultant doctor detail error:", error);
    const message = error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      { error: `ドクター詳細の取得に失敗しました: ${message}` },
      { status: 500 }
    );
  }
}
