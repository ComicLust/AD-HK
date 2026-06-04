import { db } from "@/lib/db";
import { videoSchema } from "@/lib/validations/cms";
import { NextResponse } from "next/server";

function getYoutubeInfo(url: string) {
  let videoId = "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    videoId = match[2];
  }

  if (videoId) {
    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    };
  }
  return null;
}

export async function GET() {
  try {
    const videos = await db.video.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: "Videolar yüklenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    const maxVideo = await db.video.findFirst({
      orderBy: { order: "desc" },
    });
    const order = maxVideo ? maxVideo.order + 1 : 0;

    const newVideo = await db.video.create({
      data: {
        title,
        description: description || null,
        videoUrl: finalVideoUrl,
        thumbnailUrl: finalThumbnailUrl || null,
        order,
        isActive,
      },
    });

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error("Video create error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
export { getYoutubeInfo };
