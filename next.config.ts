import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    // Pin the workspace root so Turbopack ignores unrelated lockfiles
    // higher up in the user profile directory.
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
