import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { loginSchema } from "./validations/auth";
import type { UserRole } from "@prisma/client";
import { ROUTES } from "./constants";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
    };
  }

  interface User {
    id: string;
    email: string;
    role: UserRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

        if (!passwordMatch) {
          return null;
        }

        if (!user.isActive) {
          return null;
        }

        // 最終ログイン日時を更新（失敗してもログイン自体はブロックしない）
        prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        }).catch(() => {});

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

/**
 * Get the dashboard URL for a given role
 */
export function getDashboardUrl(role: UserRole): string {
  switch (role) {
    case "DOCTOR":
      return ROUTES.DOCTOR.DASHBOARD;
    case "CORPORATION":
      return ROUTES.CORPORATION.DASHBOARD;
    case "CONSULTANT":
      return ROUTES.CONSULTANT.DASHBOARD;
    case "ADMIN":
      return ROUTES.ADMIN.DASHBOARD;
    default:
      return "/";
  }
}

/**
 * Get the allowed route prefix for a given role
 */
export function getAllowedRoutePrefix(role: UserRole): string {
  switch (role) {
    case "DOCTOR":
      return "/doctor";
    case "CORPORATION":
      return "/corporation";
    case "CONSULTANT":
      return "/consultant";
    case "ADMIN":
      return "/admin";
    default:
      return "/";
  }
}
