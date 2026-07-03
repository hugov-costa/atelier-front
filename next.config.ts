import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

function toRemotePattern(rawUrl: string | undefined): RemotePattern | null {
  if (!rawUrl) {
    return null;
  }

  try {
    const url = new URL(rawUrl);

    return {
      protocol: url.protocol.replace(":", "") as RemotePattern["protocol"],
      hostname: url.hostname,
      port: url.port || undefined,
    };
  } catch {
    return null;
  }
}

const remotePatterns = [
  toRemotePattern(process.env.NEXT_PUBLIC_STORAGE_URL),
  toRemotePattern(process.env.NEXT_PUBLIC_API_URL),
].filter((pattern): pattern is RemotePattern => pattern !== null);

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: ["lucide-react", "radix-ui"],
  },
  images: {
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
