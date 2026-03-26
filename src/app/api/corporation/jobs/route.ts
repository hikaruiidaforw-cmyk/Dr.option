import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// NaN/空文字を undefined に変換
const optionalNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null || Number.isNaN(val) ? undefined : Number(val)),
  z.number().optional().nullable()
);

const jobSchema = z.object({
  title: z.string().min(1, "求人タイトルを入力してください"),
  department: z.string().min(1, "診療科を選択してください"),
  clinicName: z.string().min(1, "クリニック名を入力してください"),
  clinicArea: z.string().min(1, "所在地を選択してください"),
  clinicAddress: z.string().min(1, "住所を入力してください"),
  description: z.string().min(1, "求人詳細を入力してください"),
  employmentType: z.string().min(1, "雇用形態を選択してください"),
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
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

// GET: 法人の求人一覧を取得
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    // 法人プロフィールを取得
    const corporationProfile = await prisma.corporationProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!corporationProfile) {
      return NextResponse.json(
        { error: "法人プロフィールが見つかりません" },
        { status: 404 }
      );
    }

    // 求人一覧を取得
    const jobs = await prisma.jobPosting.findMany({
      where: { corporationId: corporationProfile.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            applications: true,
            favorites: true,
          },
        },
      },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Failed to fetch corporation jobs:", error);
    return NextResponse.json(
      { error: "求人一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// POST: 新規求人を作成
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    // 法人プロフィールを取得
    const corporationProfile = await prisma.corporationProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!corporationProfile) {
      return NextResponse.json(
        { error: "求人を作成するには法人プロフィールの登録が必要です" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = jobSchema.parse(body);

    // 求人を作成
    const job = await prisma.jobPosting.create({
      data: {
        corporationId: corporationProfile.id,
        title: validatedData.title,
        description: validatedData.description,
        department: validatedData.department,
        clinicName: validatedData.clinicName,
        clinicAddress: validatedData.clinicAddress,
        clinicArea: validatedData.clinicArea,
        employmentType: validatedData.employmentType,
        salaryMin: validatedData.salaryMin || null,
        salaryMax: validatedData.salaryMax || null,
        workingHours: validatedData.workingHours || null,
        holidays: validatedData.holidays || null,
        benefits: validatedData.benefits || null,
        transferPrice: validatedData.transferPrice || null,
        transferPriceNote: validatedData.transferPriceNote || null,
        transferTimingMin: validatedData.transferTimingMin || null,
        transferTimingMax: validatedData.transferTimingMax || null,
        transferConditions: validatedData.transferConditions || null,
        includesRealEstate: validatedData.includesRealEstate ?? false,
        includesEquipment: validatedData.includesEquipment ?? true,
        includesStaff: validatedData.includesStaff ?? true,
        annualRevenue: validatedData.annualRevenue || null,
        annualProfit: validatedData.annualProfit || null,
        patientCount: validatedData.patientCount || null,
        status: validatedData.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json({
      message: validatedData.status === "PUBLISHED" ? "求人を公開しました" : "下書きを保存しました",
      job,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create job:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "入力内容に誤りがあります", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "求人の作成に失敗しました" },
      { status: 500 }
    );
  }
}
