import { db } from "@/lib/db";
import { navLinkSchema } from "@/lib/validations/cms";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const link = await db.navLink.findUnique({
      where: { id },
      include: { children: true },
    });
    if (!link) {
      return NextResponse.json({ error: "Menü elemanı bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = navLinkSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { label, href, icon, isActive, parentId, tab } = result.data;

    const updated = await db.navLink.update({
      where: { id },
      data: {
        label,
        href,
        icon: icon || null,
        isActive,
        parentId: parentId || null,
        tab: tab || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("NavLink update error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // ParentId null constraint handles children cascading deletion if defined correctly in Prisma:
    // parent NavLink? @relation("NavChildren", fields: [parentId], references: [id], onDelete: Cascade)
    // So we can simply delete the link, and Prisma handles cascade!
    await db.navLink.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("NavLink delete error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
