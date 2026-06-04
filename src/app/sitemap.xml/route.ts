import { db } from "@/lib/db";

export async function GET(request: Request) {
  // Automatically determine domain based on request host headers
  const host = request.headers.get("host") || "adilhukukdanismanlik.com";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  // Fetch all active items from DB
  const [services, blogPosts] = await Promise.all([
    db.service.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    db.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } })
  ]);

  const staticPages = [
    "",
    "/hakkimizda",
    "/hizmetlerimiz",
    "/ekibimiz",
    "/medya",
    "/ornek-dilekceler",
    "/iletisim",
    "/kvkk",
    "/cerez-politikasi",
    "/bize-katilin",
    "/blog"
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static pages
  staticPages.forEach((page) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${page}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${page === "" ? "1.0" : "0.8"}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Services pages
  services.forEach((service) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/hizmetlerimiz/${service.slug}</loc>\n`;
    xml += `    <lastmod>${service.updatedAt.toISOString().split("T")[0]}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  // Blog posts pages
  blogPosts.forEach((post) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${post.updatedAt.toISOString().split("T")[0]}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=18000"
    }
  });
}
