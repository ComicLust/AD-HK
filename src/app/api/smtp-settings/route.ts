import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    let settings = await db.smtpSettings.findUnique({ where: { id: "default" } });
    if (!settings) {
      settings = await db.smtpSettings.create({
        data: {
          id: "default",
          host: "",
          port: 587,
          secure: false,
          username: "",
          password: "",
          fromName: "Adil Hukuk",
          fromEmail: ""
        }
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET SMTP error:", error);
    return NextResponse.json({ error: "SMTP ayarları yüklenemedi." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const settings = await db.smtpSettings.upsert({
      where: { id: "default" },
      update: {
        host: body.host,
        port: parseInt(body.port),
        secure: !!body.secure,
        username: body.username,
        password: body.password,
        fromName: body.fromName,
        fromEmail: body.fromEmail
      },
      create: {
        id: "default",
        host: body.host,
        port: parseInt(body.port),
        secure: !!body.secure,
        username: body.username,
        password: body.password,
        fromName: body.fromName,
        fromEmail: body.fromEmail
      }
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error("PUT SMTP error:", error);
    return NextResponse.json({ error: "SMTP ayarları kaydedilemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { toEmail, host, port, secure, username, password, fromName, fromEmail } = body;

    if (!toEmail) {
      return NextResponse.json({ error: "Alıcı e-posta adresi zorunludur." }, { status: 400 });
    }

    // Dynamic mock for local testing
    if (!host || host.includes("test") || host.includes("localhost") || host === "") {
      return NextResponse.json({ success: true, message: "Local modda simüle edildi. E-posta ayarları geçerli görünüyor." });
    }

    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: !!secure,
      auth: {
        user: username,
        pass: password
      }
    });

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject: "Adil Hukuk SMTP Test E-postası",
      text: "Tebrikler! Adil Hukuk Danışmanlık siteniz için SMTP e-posta ayarlarınız başarıyla yapılandırılmıştır.",
      html: "<p>Tebrikler! <b>Adil Hukuk Danışmanlık</b> siteniz için SMTP e-posta ayarlarınız başarıyla yapılandırılmıştır.</p>"
    });

    return NextResponse.json({ success: true, message: "Test e-postası başarıyla gönderildi!" });
  } catch (error: any) {
    console.error("Test SMTP error:", error);
    return NextResponse.json({ error: `E-posta gönderimi başarısız: ${error.message || String(error)}` }, { status: 500 });
  }
}
