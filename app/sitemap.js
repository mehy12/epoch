const rawBaseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const baseUrl = rawBaseUrl.replace(/\/+$/, "");

const routes = [
  "/",
  "/contact",
  "/faq",
  "/rules",
  "/register",
  "/register/payment",
  "/register/success",
];

export default function sitemap() {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: route === "/" ? baseUrl : `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
