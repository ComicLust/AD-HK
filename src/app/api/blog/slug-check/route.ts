import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id"); // Optional, to exclude current entity when editing

    if (!slug) {
      return NextResponse.json({ error: "Slug parametresi zorunludur." }, { status: 400 });
    }

    const existing = await db.blogPost.findUnique({
      where: { slug },
    });

    const isUnique = !existing || (id !== null && existing.id === id);

    return NextResponse.json({ isUnique });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
