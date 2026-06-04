import { db } from "@/lib/db";
import { dilekceSchema } from "@/lib/validations/cms";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dilekceler = await db.dilekce.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(dilekceler);
  } catch (error) {
    return NextResponse.json({ error: "Dilekçeler yüklenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = dilekceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { title, category, downloadUrl, fileFormat, isActive } = result.data;

    const maxDilekce = await db.dilekce.findFirst({
      orderBy: { order: "desc" },
    });
    const order = maxDilekce ? maxDilekce.order + 1 : 0;

    const newDilekce = await db.dilekce.create({
      data: {
        title,
        category,
        downloadUrl,
        fileFormat,
        order,
        isActive,
      },
    });

    return NextResponse.json(newDilekce, { status: 201 });
  } catch (error) {
    console.error("Dilekce create error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
