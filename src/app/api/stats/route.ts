import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      totalServices,
      totalBlogPosts,
      totalTeamMembers,
      totalDilekceler,
      recentPosts,
      recentServices,
    ] = await Promise.all([
      db.service.count(),
      db.blogPost.count(),
      db.teamMember.count(),
      db.dilekce.count(),
      db.blogPost.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      db.service.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      totalServices,
      totalBlogPosts,
      totalTeamMembers,
      totalDilekceler,
      recentPosts,
      recentServices,
    });
  } catch (error) {
    return NextResponse.json({ error: "İstatistikler alınırken bir hata oluştu." }, { status: 500 });
  }
}
