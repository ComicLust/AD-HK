import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let settings = await db.integrationSettings.findUnique({
      where: { id: "default" }
    });

    if (!settings) {
      settings = await db.integrationSettings.create({
        data: {
          id: "default",
          googleAnalytics: "",
          searchConsole: ""
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch integration settings:", error);
    return NextResponse.json({ error: "Entegrasyon ayarları yüklenemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const settings = await db.integrationSettings.upsert({
      where: { id: "default" },
      update: {
        googleAnalytics: body.googleAnalytics ?? "",
        searchConsole: body.searchConsole ?? ""
      },
      create: {
        id: "default",
        googleAnalytics: body.googleAnalytics ?? "",
        searchConsole: body.searchConsole ?? ""
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to save integration settings:", error);
    return NextResponse.json({ error: "Entegrasyon ayarları kaydedilemedi." }, { status: 500 });
  }
}
