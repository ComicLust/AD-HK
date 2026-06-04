import { db } from "@/lib/db";
import { blogPostSchema } from "@/lib/validations/cms";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await db.blogPost.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!post) {
      return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = blogPostSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { title, slug, summary, content, category, coverImage, authorId, isPublished, tags } = result.data;

    const existing = await db.blogPost.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Bu slug başka bir yazı tarafından kullanılmaktadır." }, { status: 400 });
    }

    const updated = await db.blogPost.update({
      where: { id },
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error("BlogPost update error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.blogPost.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
