import { db } from "@/lib/db";
import { serviceSchema } from "@/lib/validations/cms";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = await db.service.findUnique({
      where: { id },
    });
    if (!service) {
      return NextResponse.json({ error: "Hizmet bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = serviceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { slug, name, icon, description, fullDescription, isActive, trustPoints } = result.data;

    const existing = await db.service.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Bu slug başka bir hizmet tarafından kullanılmaktadır." }, { status: 400 });
    }

    const updated = await db.service.update({
      where: { id },
      data: {
        slug,
        name,
        icon,
        description,
        fullDescription,
        isActive,
        trustPoints: JSON.stringify(trustPoints),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Service update error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.service.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
