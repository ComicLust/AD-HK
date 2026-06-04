import { db } from "@/lib/db";
import { videoSchema } from "@/lib/validations/cms";
import { getYoutubeInfo } from "../route";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const video = await db.video.findUnique({
      where: { id },
    });
    if (!video) {
      return NextResponse.json({ error: "Video bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = videoSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { title, description, videoUrl, isActive } = result.data;

    let finalVideoUrl = videoUrl;
    let finalThumbnailUrl = "";

    const ytInfo = getYoutubeInfo(videoUrl);
    if (ytInfo) {
      finalVideoUrl = ytInfo.embedUrl;
      finalThumbnailUrl = ytInfo.thumbnailUrl;
    }

    const updated = await db.video.update({
      where: { id },
      data: {
        title,
        description: description || null,
        videoUrl: finalVideoUrl,
        thumbnailUrl: finalThumbnailUrl || null,
        isActive,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Video update error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.video.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
