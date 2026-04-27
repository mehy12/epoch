import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: '/register',
        destination: '/registration-closed',
        permanent: false,
      },
      {
        source: '/register/:path*',
        destination: '/registration-closed',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
