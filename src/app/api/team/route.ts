import { db } from "@/lib/db";
import { teamMemberSchema } from "@/lib/validations/cms";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const team = await db.teamMember.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json({ error: "Ekip üyeleri yüklenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = teamMemberSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { name, title, category, bio, initials, photo, specializations, socialLinks, slug, isActive } = result.data;

    const existing = await db.teamMember.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Bu slug zaten kullanılmaktadır." }, { status: 400 });
    }

    const maxMember = await db.teamMember.findFirst({
      orderBy: { order: "desc" },
    });
    const order = maxMember ? maxMember.order + 1 : 0;

    const newMember = await db.teamMember.create({
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
        order,
      },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("TeamMember create error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
