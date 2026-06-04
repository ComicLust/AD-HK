import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Fetch SMTP settings
    const smtp = await db.smtpSettings.findUnique({ where: { id: "default" } });

    // Save submission as local analytics/log event
    await db.localAnalytics.create({
      data: {
        event: "click",
        path: "/iletisim",
        targetId: `contact-form-${name}`,
        userAgent: `Name: ${name}, Email: ${email}, Phone: ${phone}`
      }
    });

    if (smtp && smtp.host && smtp.username && smtp.password && smtp.fromEmail) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtp.host,
          port: smtp.port,
          secure: smtp.secure,
          auth: {
            user: smtp.username,
            pass: smtp.password
          }
        });

        await transporter.sendMail({
          from: `"${smtp.fromName}" <${smtp.fromEmail}>`,
          to: smtp.fromEmail, // Sent to the firm's email address
          replyTo: email,
          subject: `Yeni İletişim Formu Mesajı: ${subject}`,
          text: `Yeni İletişim Formu Mesajı\n\nAd Soyad: ${name}\nE-posta: ${email}\nTelefon: +90${phone}\nKonu: ${subject}\n\nMesaj:\n${message}`,
          html: `
            <h3>Yeni İletişim Formu Mesajı</h3>
            <p><b>Ad Soyad:</b> ${name}</p>
            <p><b>E-posta:</b> ${email}</p>
            <p><b>Telefon:</b> +90${phone}</p>
            <p><b>Konu:</b> ${subject}</p>
            <br/>
            <p><b>Mesaj:</b></p>
            <p style="white-space: pre-wrap; background-color: #f2f2f7; padding: 15px; border-radius: 10px;">${message}</p>
          `
        });
      } catch (mailError) {
        console.error("Failed to send contact mail:", mailError);
      }
    } else {
      console.log("SMTP not configured or incomplete. Form submitted locally:", { name, email, phone, subject, message });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact Form submit error:", error);
    return NextResponse.json({ error: "Mesaj gönderilemedi." }, { status: 500 });
  }
}
