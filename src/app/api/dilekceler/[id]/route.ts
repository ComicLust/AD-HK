import { db } from "@/lib/db";
import { dilekceSchema } from "@/lib/validations/cms";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const dilekce = await db.dilekce.findUnique({
      where: { id },
    });
    if (!dilekce) {
      return NextResponse.json({ error: "Dilekçe bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(dilekce);
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = dilekceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { title, category, downloadUrl, fileFormat, isActive } = result.data;

    const updated = await db.dilekce.update({
      where: { id },
      data: {
        title,
        category,
        downloadUrl,
        fileFormat,
        isActive,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Dilekce update error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.dilekce.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
