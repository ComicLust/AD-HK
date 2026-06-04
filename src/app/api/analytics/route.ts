import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "summary"; // "summary" | "views" | "downloads"

    if (type === "summary") {
      // 1. Ziyaretçi Sayısı ve Grafik Verisi (Son 7 gün)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const logs = await db.localAnalytics.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        },
        orderBy: { createdAt: "asc" }
      });

      // Format daily charts
      const dailyData: Record<string, { pageviews: number; downloads: number; clicks: number }> = {};
      
      // Initialize last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayKey = d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
        dailyData[dayKey] = { pageviews: 0, downloads: 0, clicks: 0 };
      }

      logs.forEach(log => {
        const dayKey = log.createdAt.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
        if (dailyData[dayKey]) {
          if (log.event === "pageview") dailyData[dayKey].pageviews++;
          else if (log.event === "download") dailyData[dayKey].downloads++;
          else if (log.event === "click") dailyData[dayKey].clicks++;
        }
      });

      const chartData = Object.entries(dailyData).map(([name, val]) => ({
        name,
        ...val
      }));

      // 2. Popüler Sayfalar
      const popularPagesRaw = await db.localAnalytics.groupBy({
        by: ["path"],
        where: { event: "pageview" },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: "desc"
          }
        },
        take: 5
      });

      const popularPages = popularPagesRaw.map(item => ({
        path: item.path,
        count: item._count.id
      }));

      // 3. İndirilen Dilekçeler
      const downloadedDilekcelerRaw = await db.localAnalytics.groupBy({
        by: ["targetId"],
        where: { event: "download" },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: "desc"
          }
        },
        take: 5
      });

      // Fetch dilemma details
      const downloadedDilekceler = await Promise.all(
        downloadedDilekcelerRaw.map(async (item) => {
          if (!item.targetId) return { name: "Bilinmeyen", count: item._count.id };
          const details = await db.dilekce.findUnique({ where: { id: item.targetId } });
          return {
            name: details?.title || `Dilekçe #${item.targetId}`,
            count: item._count.id
          };
        })
      );

      // 4. Genel Sayılar
      const totalViews = await db.localAnalytics.count({ where: { event: "pageview" } });
      const totalDownloads = await db.localAnalytics.count({ where: { event: "download" } });
      const totalClicks = await db.localAnalytics.count({ where: { event: "click" } });

      return NextResponse.json({
        chartData,
        popularPages,
        downloadedDilekceler,
        stats: {
          totalViews,
          totalDownloads,
          totalClicks
        }
      });
    }

    return NextResponse.json({ error: "Geçersiz işlem." }, { status: 400 });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Analiz verisi alınamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, path, targetId } = body;

    if (!event || !path) {
      return NextResponse.json({ error: "Eksik parametreler." }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || undefined;

    const log = await db.localAnalytics.create({
      data: {
        event,
        path,
        targetId: targetId || undefined,
        userAgent
      }
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Local analytics tracking error:", error);
    return NextResponse.json({ error: "Log kaydedilemedi." }, { status: 500 });
  }
}
