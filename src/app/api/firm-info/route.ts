import { db } from "@/lib/db";
import { firmInfoSchema } from "@/lib/validations/cms";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let info = await db.firmInfo.findFirst();
    if (!info) {
      info = await db.firmInfo.create({
        data: {
          name: "Adil Hukuk Danışmanlık",
          address: "Florya Semti, Şenlik Köy Mah, Saçı Sokak, Florya Cd. No: 4/F, 34513 Bakırköy/İstanbul",
          gsm: "+90 531 776 02 83",
          phone: "+90 212 574 21 01",
          fax: "0 212 574 21 34",
          email: "info@adilhukukdanismanlik.com",
          whatsapp: "https://wa.me/905317760283",
          instagram: "https://www.instagram.com/adilhukukdanismanlikhizmetleri/",
          twitter: "https://x.com/adilhukuknet",
          youtube: "https://www.youtube.com/@adilhukuk",
          facebook: "https://www.facebook.com/profile.php?id=61580900027911",
          linkedin: "https://www.linkedin.com",
        },
      });
    }
    return NextResponse.json(info);
  } catch (error) {
    return NextResponse.json({ error: "Firma bilgileri yüklenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const result = firmInfoSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const first = await db.firmInfo.findFirst();
    if (!first) {
      const created = await db.firmInfo.create({
        data: result.data,
      });
      return NextResponse.json(created);
    }

    const updated = await db.firmInfo.update({
      where: { id: first.id },
      data: result.data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("FirmInfo update error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
