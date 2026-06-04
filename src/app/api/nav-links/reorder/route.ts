import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json(); // Expects array of { id, order, parentId }
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });
    }

    await db.$transaction(
      body.map((item) =>
        db.navLink.update({
          where: { id: item.id },
          data: {
            order: item.order,
            parentId: item.parentId !== undefined ? item.parentId : undefined
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
