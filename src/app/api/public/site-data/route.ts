import { getSiteData } from "@/lib/getSiteData";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json(data);
}
