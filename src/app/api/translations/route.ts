import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const list = await db.translation.findMany({ orderBy: { key: "asc" } });
    
    if (list.length === 0) {
      const defaults = [
        { key: "nav.home", tr: "Ana Sayfa", en: "Home" },
        { key: "nav.about", tr: "Hakkımızda", en: "About Us" },
        { key: "nav.services", tr: "Hizmetlerimiz", en: "Services" },
        { key: "nav.team", tr: "Ekibimiz", en: "Our Team" },
        { key: "nav.media", tr: "Medya", en: "Media" },
        { key: "nav.dilekceler", tr: "Örnek Dilekçeler", en: "Sample Petitions" },
        { key: "nav.contact", tr: "İletişim", en: "Contact" },
        { key: "contact.callNow", tr: "Hemen Ara", en: "Call Now" },
        { key: "contact.formName", tr: "Ad Soyad", en: "Name & Surname" },
        { key: "contact.formEmail", tr: "E-posta", en: "E-mail" },
        { key: "contact.formPhone", tr: "Telefon", en: "Phone" },
        { key: "contact.formSubject", tr: "Konu", en: "Subject" },
        { key: "contact.formMessage", tr: "Mesaj", en: "Message" },
        { key: "contact.formSubmit", tr: "Mesaj Gönder", en: "Send Message" },
        { key: "footer.text", tr: "Adil Hukuk Danışmanlık Bürosu olarak, müvekkillerimize hak ettikleri nitelikli ve güvenilir hukuki hizmeti sunmayı temel ilkemiz kabul ediyoruz.", en: "As Adil Law Consultancy Office, we accept it as our core principle to provide our clients with the qualified and reliable legal services they deserve." }
      ];
      
      await Promise.all(defaults.map(item => db.translation.create({ data: item })));
      const freshList = await db.translation.findMany({ orderBy: { key: "asc" } });
      return NextResponse.json(freshList);
    }
    
    return NextResponse.json(list);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Çeviriler yüklenemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await db.translation.create({
      data: {
        key: body.key,
        tr: body.tr,
        en: body.en
      }
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Çeviri eklenemedi." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const item = await db.translation.update({
      where: { id: body.id },
      data: {
        key: body.key,
        tr: body.tr,
        en: body.en
      }
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Çeviri güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID bulunamadı." }, { status: 400 });
    
    await db.translation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Çeviri silinemedi." }, { status: 500 });
  }
}
