import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// NaN/空文字を undefined に変換
const optionalNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null || Number.isNaN(val) ? undefined : Number(val)),
  z.number().optional().nullable()
);

const updateJobSchema = z.object({
  title: z.string().min(1).optional(),
  department: z.string().min(1).optional(),
  clinicName: z.string().min(1).optional(),
  clinicArea: z.string().min(1).optional(),
  clinicAddress: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  employmentType: z.string().min(1).optional(),
  salaryMin: optionalNumber,
  salaryMax: optionalNumber,
  workingHours: z.string().optional().nullable(),
  holidays: z.string().optional().nullable(),
  benefits: z.string().optional().nullable(),
  transferPrice: optionalNumber,
  transferPriceNote: z.string().optional().nullable(),
  transferTimingMin: optionalNumber,
  transferTimingMax: optionalNumber,
  transferConditions: z.string().optional().nullable(),
  includesRealEstate: z.boolean().optional(),
  includesEquipment: z.boolean().optional(),
  includesStaff: z.boolean().optional(),
  annualRevenue: optionalNumber,
  annualProfit: optionalNumber,
  patientCount: optionalNumber,
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]).optional(),
});

async function getCorporationProfile(userId: string) {
  return prisma.corporationProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
}

// GET: 求人詳細を取得
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const corp = await getCorporationProfile(session.user.id);
    if (!corp) {
      return NextResponse.json({ error: "法人プロフィールが見つかりません" }, { status: 404 });
    }

    const { id } = await params;

    const job = await prisma.jobPosting.findFirst({
      where: { id, corporationId: corp.id },
      include: {
        _count: {
          select: { applications: true, favorites: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "求人が見つかりません" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return NextResponse.json({ error: "求人の取得に失敗しました" }, { status: 500 });
  }
}

// PUT: 求人を更新
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const corp = await getCorporationProfile(session.user.id);
    if (!corp) {
      return NextResponse.json({ error: "法人プロフィールが見つかりません" }, { status: 404 });
    }

    const { id } = await params;

    // 自分の求人か確認
    const existing = await prisma.jobPosting.findFirst({
      where: { id, corporationId: corp.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "求人が見つかりません" }, { status: 404 });
    }

    const body = await request.json();
    const data = updateJobSchema.parse(body);

    // publishedAtの制御
    let publishedAt = existing.publishedAt;
    if (data.status === "PUBLISHED" && !existing.publishedAt) {
      publishedAt = new Date();
    }

    const updated = await prisma.jobPosting.update({
      where: { id },
      include: {
        _count: {
          select: { applications: true, favorites: true },
        },
      },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.department !== undefined && { department: data.department }),
        ...(data.clinicName !== undefined && { clinicName: data.clinicName }),
        ...(data.clinicArea !== undefined && { clinicArea: data.clinicArea }),
        ...(data.clinicAddress !== undefined && { clinicAddress: data.clinicAddress }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.employmentType !== undefined && { employmentType: data.employmentType }),
        salaryMin: data.salaryMin ?? existing.salaryMin,
        salaryMax: data.salaryMax ?? existing.salaryMax,
        workingHours: data.workingHours ?? existing.workingHours,
        holidays: data.holidays ?? existing.holidays,
        benefits: data.benefits ?? existing.benefits,
        transferPrice: data.transferPrice ?? existing.transferPrice,
        transferPriceNote: data.transferPriceNote ?? existing.transferPriceNote,
        transferTimingMin: data.transferTimingMin ?? existing.transferTimingMin,
        transferTimingMax: data.transferTimingMax ?? existing.transferTimingMax,
        transferConditions: data.transferConditions ?? existing.transferConditions,
        ...(data.includesRealEstate !== undefined && { includesRealEstate: data.includesRealEstate }),
        ...(data.includesEquipment !== undefined && { includesEquipment: data.includesEquipment }),
        ...(data.includesStaff !== undefined && { includesStaff: data.includesStaff }),
        annualRevenue: data.annualRevenue ?? existing.annualRevenue,
        annualProfit: data.annualProfit ?? existing.annualProfit,
        patientCount: data.patientCount ?? existing.patientCount,
        ...(data.status !== undefined && { status: data.status }),
        publishedAt,
      },
    });

    return NextResponse.json({
      message: "求人を更新しました",
      job: updated,
    });
  } catch (error) {
    console.error("Failed to update job:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "入力内容に誤りがあります", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "求人の更新に失敗しました" }, { status: 500 });
  }
}
