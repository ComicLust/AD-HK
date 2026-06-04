import { db } from "@/lib/db";
import { blogPostSchema } from "@/lib/validations/cms";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await db.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
      include: { author: true },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Yazılar yüklenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = blogPostSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { title, slug, summary, content, category, coverImage, authorId, isPublished, tags } = result.data;

    const existing = await db.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Bu slug zaten kullanılmaktadır." }, { status: 400 });
    }

    const newPost = await db.blogPost.create({
      data: {
        title,
        slug,
        summary,
        content,
        category,
        coverImage: coverImage || null,
        authorId: authorId || null,
        isPublished,
        tags: JSON.stringify(tags),
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("BlogPost create error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
