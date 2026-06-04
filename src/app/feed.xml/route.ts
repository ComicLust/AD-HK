import { db } from "@/lib/db";

export async function GET(request: Request) {
  const host = request.headers.get("host") || "adilhukukdanismanlik.com";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const posts = await db.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
    select: {
      title: true,
      summary: true,
      slug: true,
      publishedAt: true
    }
  });

  let xml = `<?xml version="1.0" encoding="UTF-8" ?>\n`;
  xml += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n`;
  xml += `<channel>\n`;
  xml += `  <title>Adil Hukuk Danışmanlık | Hukuk Gündemi</title>\n`;
  xml += `  <link>${baseUrl}</link>\n`;
  xml += `  <description>Adil Hukuk Danışmanlık Hukuk Gündemi ve Makaleleri</description>\n`;
  xml += `  <language>tr</language>\n`;
  xml += `  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />\n`;

  posts.forEach((post) => {
    xml += `  <item>\n`;
    xml += `    <title><![CDATA[${post.title}]]></title>\n`;
    xml += `    <link>${baseUrl}/blog/${post.slug}</link>\n`;
    xml += `    <guid>${baseUrl}/blog/${post.slug}</guid>\n`;
    xml += `    <pubDate>${post.publishedAt.toUTCString()}</pubDate>\n`;
    xml += `    <description><![CDATA[${post.summary}]]></description>\n`;
    xml += `  </item>\n`;
  });

  xml += `</channel>\n`;
  xml += `</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=18000"
    }
  });
}
