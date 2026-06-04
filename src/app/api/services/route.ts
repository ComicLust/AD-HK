import { db } from "@/lib/db";
import { serviceSchema } from "@/lib/validations/cms";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const services = await db.service.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Hizmetler yüklenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = serviceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { slug, name, icon, description, fullDescription, isActive, trustPoints } = result.data;

    const existing = await db.service.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Bu slug zaten kullanılmaktadır." }, { status: 400 });
    }

    const maxService = await db.service.findFirst({
      orderBy: { order: "desc" },
    });
    const order = maxService ? maxService.order + 1 : 0;

    const newService = await db.service.create({
      data: {
        slug,
        name,
        icon,
        description,
        fullDescription,
        isActive,
        order,
        trustPoints: JSON.stringify(trustPoints),
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Service create error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
