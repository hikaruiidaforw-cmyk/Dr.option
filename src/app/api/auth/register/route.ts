import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  registerDoctorSchema,
  registerCorporationSchema,
} from "@/lib/validations/auth";
import { generateDisplayName } from "@/lib/utils";
import type { UserRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role } = body as { role: UserRole };

    if (role === "DOCTOR") {
      // Doctor registration
      const parsed = registerDoctorSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          { error: "入力内容に誤りがあります", details: parsed.error.flatten().fieldErrors },
          { status: 400 }
        );
      }

      const { email, password, displayName, medicalLicenseYear } = parsed.data;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "このメールアドレスは既に登録されています" },
          { status: 400 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user with doctor profile
      const user = await prisma.user.create({
        data: {
          email,
          hashedPassword,
          role: "DOCTOR",
          doctorProfile: {
            create: {
              displayName: displayName || generateDisplayName(),
              medicalLicenseYear,
            },
          },
        },
        include: {
          doctorProfile: true,
        },
      });

      return NextResponse.json(
        {
          message: "登録が完了しました",
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        },
        { status: 201 }
      );
    } else if (role === "CORPORATION") {
      // Corporation registration
      const parsed = registerCorporationSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          { error: "入力内容に誤りがあります", details: parsed.error.flatten().fieldErrors },
          { status: 400 }
        );
      }

      const {
        email,
        password,
        corporationName,
        representativeName,
        contactPerson,
        contactEmail,
      } = parsed.data;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "このメールアドレスは既に登録されています" },
          { status: 400 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user with corporation profile
      const user = await prisma.user.create({
        data: {
          email,
          hashedPassword,
          role: "CORPORATION",
          corporationProfile: {
            create: {
              corporationName,
              representativeName,
              contactPerson,
              contactEmail,
            },
          },
        },
        include: {
          corporationProfile: true,
        },
      });

      return NextResponse.json(
        {
          message: "登録が完了しました",
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: "無効なロールです" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "登録に失敗しました" },
      { status: 500 }
    );
  }
}
