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

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            doctorProfile: {
              include: {
                specialties: { select: { name: true } },
              },
            },
            jobPosting: {
              include: {
                corporation: {
                  select: {
                    id: true,
                    corporationName: true,
                    representativeName: true,
                    contactEmail: true,
                    address: true,
                  },
                },
              },
            },
          },
        },
        consultant: {
          select: {
            id: true,
            displayName: true,
          },
        },
        notes: {
          select: {
            id: true,
            authorId: true,
            content: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        contracts: {
          select: {
            id: true,
            type: true,
            status: true,
            title: true,
            signedAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: "マッチングが見つかりません" }, { status: 404 });
    }

    const dp = match.application.doctorProfile;
    const jp = match.application.jobPosting;
    const corp = jp.corporation;

    const formatted = {
      id: match.id,
      status: match.status,
      agreedSalary: match.agreedSalary,
      agreedTransferPrice: match.agreedTransferPrice,
      agreedTransferDate: match.agreedTransferDate?.toISOString() ?? null,
      employmentStartDate: match.employmentStartDate?.toISOString() ?? null,
      createdAt: match.createdAt.toISOString(),
      updatedAt: match.updatedAt.toISOString(),
      doctorProfile: {
        id: dp.id,
        displayName: dp.displayName,
        email: dp.currentHospital,
        medicalLicenseYear: dp.medicalLicenseYear,
        specialties: dp.specialties.map((s) => s.name),
        currentWorkplace: dp.currentHospital,
        desiredSalaryMin: dp.desiredSalaryMin,
        desiredSalaryMax: dp.desiredSalaryMax,
      },
      corporation: {
        id: corp.id,
        corporationName: corp.corporationName,
        representativeName: corp.representativeName,
        email: corp.contactEmail,
        address: corp.address,
      },
      jobPosting: {
        id: jp.id,
        title: jp.title,
        salaryMin: jp.salaryMin,
        salaryMax: jp.salaryMax,
        transferPrice: jp.transferPrice,
      },
      consultant: match.consultant
        ? {
            id: match.consultant.id,
            displayName: match.consultant.displayName,
          }
        : null,
      notes: match.notes.map((n) => ({
        id: n.id,
        content: n.content,
        authorId: n.authorId,
        createdAt: n.createdAt.toISOString(),
      })),
      contracts: match.contracts.map((c) => ({
        id: c.id,
        type: c.type,
        status: c.status,
        title: c.title,
        signedAt: c.signedAt?.toISOString() ?? null,
        createdAt: c.createdAt.toISOString(),
      })),
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Consultant match detail error:", error);
    const message = error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      { error: `マッチング詳細の取得に失敗しました: ${message}` },
      { status: 500 }
    );
  }
}
