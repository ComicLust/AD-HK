import { db } from "@/lib/db";
import { teamMemberSchema } from "@/lib/validations/cms";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const member = await db.teamMember.findUnique({
      where: { id },
    });
    if (!member) {
      return NextResponse.json({ error: "Ekip üyesi bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = teamMemberSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { name, title, category, bio, initials, photo, specializations, socialLinks, slug, isActive } = result.data;

    const existing = await db.teamMember.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Bu slug başka bir ekip üyesi tarafından kullanılmaktadır." }, { status: 400 });
    }

    const updated = await db.teamMember.update({
      where: { id },
      data: {
        name,
        title,
        category,
        bio,
        initials,
        photo,
        specializations: JSON.stringify(specializations),
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        slug,
        isActive,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("TeamMember update error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.teamMember.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
