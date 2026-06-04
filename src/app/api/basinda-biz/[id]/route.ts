import { db } from "@/lib/db";
import { basindaBizSchema } from "@/lib/validations/cms";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await db.basindaBiz.findUnique({
      where: { id },
    });
    if (!item) {
      return NextResponse.json({ error: "Haber bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = basindaBizSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { title, source, sourceDomain, link, isActive } = result.data;

    const updated = await db.basindaBiz.update({
      where: { id },
      data: {
        title,
        source,
        sourceDomain,
        link,
        isActive,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("BasindaBiz update error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.basindaBiz.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
