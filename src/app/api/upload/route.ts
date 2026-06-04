import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // "image" | "document"

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    
    let relativePath = "";
    let absoluteDir = "";
    let savedBuffer = buffer;
    let savedMime = file.type;

    if (type === "image") {
      const nameWithoutExt = cleanFileName.substring(0, cleanFileName.lastIndexOf(".")) || cleanFileName;
      const webpFilename = `${timestamp}-${nameWithoutExt}.webp`;
      
      relativePath = `/uploads/images/${webpFilename}`;
      absoluteDir = join(process.cwd(), "public", "uploads", "images");
      
      await mkdir(absoluteDir, { recursive: true });
      
      const webpBuffer = await sharp(buffer).webp().toBuffer();
      savedBuffer = webpBuffer;
      savedMime = "image/webp";
      await writeFile(join(absoluteDir, webpFilename), webpBuffer);
    } else {
      const filename = `${timestamp}-${cleanFileName}`;
      relativePath = `/uploads/dilekceler/${filename}`;
      absoluteDir = join(process.cwd(), "public", "uploads", "dilekceler");
      
      await mkdir(absoluteDir, { recursive: true });
      await writeFile(join(absoluteDir, filename), buffer);
    }

    // Register file in MediaLibrary
    try {
      await db.mediaLibrary.create({
        data: {
          fileName: type === "image" ? `${cleanFileName.substring(0, cleanFileName.lastIndexOf(".")) || cleanFileName}.webp` : cleanFileName,
          url: relativePath,
          fileSize: savedBuffer.byteLength,
          mimeType: savedMime
        }
      });
    } catch (dbErr) {
      console.error("Failed to register media in DB:", dbErr);
      // Continue even if database registry fails, to not block the editor.
    }

    return NextResponse.json({ url: relativePath });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Dosya yüklenirken bir hata oluştu." }, { status: 500 });
  }
}
