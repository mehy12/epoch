const rawBaseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const baseUrl = rawBaseUrl.replace(/\/+$/, "");

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/profile", "/submit", "/portal-access", "/login"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
