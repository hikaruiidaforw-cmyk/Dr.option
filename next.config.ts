import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/.prisma/client/**/*"],
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
