import { db } from "@/lib/db";
import { navLinkSchema } from "@/lib/validations/cms";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const navLinks = await db.navLink.findMany({
      where: { parentId: null },
      include: {
        children: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(navLinks);
  } catch (error) {
    return NextResponse.json({ error: "Navigasyon menüsü yüklenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = navLinkSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { label, href, icon, isActive, parentId, tab } = result.data;

    const maxLink = await db.navLink.findFirst({
      where: { parentId: parentId || null },
      orderBy: { order: "desc" },
    });
    const order = maxLink ? maxLink.order + 1 : 0;

    const newLink = await db.navLink.create({
      data: {
        label,
        href,
        icon: icon || null,
        isActive,
        parentId: parentId || null,
        tab: tab || null,
        order,
      },
    });

    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    console.error("NavLink create error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
