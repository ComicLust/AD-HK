import { db } from "@/lib/db";
import { basindaBizSchema } from "@/lib/validations/cms";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await db.basindaBiz.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Haberler yüklenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = basindaBizSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { title, source, sourceDomain, link, isActive } = result.data;

    const maxItem = await db.basindaBiz.findFirst({
      orderBy: { order: "desc" },
    });
    const order = maxItem ? maxItem.order + 1 : 0;

    const newItem = await db.basindaBiz.create({
      data: {
        title,
        source,
        sourceDomain,
        link,
        order,
        isActive,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("BasindaBiz create error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
