import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const list = await db.mediaLibrary.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(list);
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return NextResponse.json({ error: "Medya kütüphanesi yüklenemedi." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID parametresi eksik." }, { status: 400 });
    }

    const item = await db.mediaLibrary.findUnique({
      where: { id }
    });

    if (!item) {
      return NextResponse.json({ error: "Medya bulunamadı." }, { status: 404 });
    }

    // Try deleting physical file
    try {
      const filePath = join(process.cwd(), "public", item.url);
      await unlink(filePath);
    } catch (fsErr) {
      console.warn("Could not delete physical file, it may have been deleted already:", fsErr);
    }

    // Delete database record
    await db.mediaLibrary.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete media:", error);
    return NextResponse.json({ error: "Medya silinemedi." }, { status: 500 });
  }
}
