import { db } from "@/lib/db";
import { pageContentSchema } from "@/lib/validations/cms";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pages = await db.pageContent.findMany();
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: "Sayfa içerikleri yüklenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const result = pageContentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { pageType, content } = result.data;

    try {
      JSON.parse(content);
    } catch (e) {
      return NextResponse.json({ error: "İçerik geçerli bir JSON formatı olmalıdır." }, { status: 400 });
    }

    const updated = await db.pageContent.upsert({
      where: { pageType },
      update: { content },
      create: { pageType, content },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PageContent update error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
