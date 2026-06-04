import { db } from "@/lib/db";
import { comparePassword, signJWT } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Kullanıcı adı ve şifre gereklidir." }, { status: 400 });
    }

    const admin = await db.adminUser.findUnique({
      where: { username },
    });

    if (!admin || !comparePassword(password, admin.password)) {
      return NextResponse.json({ error: "Geçersiz kullanıcı adı veya şifre." }, { status: 401 });
    }

    const token = await signJWT({ username: admin.username });

    const response = NextResponse.json({ success: true, user: { username: admin.username } });
    
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
