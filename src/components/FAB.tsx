"use client";

import { MessageCircle, Phone } from "lucide-react";
import { firmInfo } from "@/data/siteData";

export default function FAB() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Hemen Ara Button */}
      <a
        href={`tel:${firmInfo.gsm.replace(/\s/g, "")}`}
        aria-label="Hemen Ara"
        className="w-14 h-14 bg-[#007AFF] hover:bg-[#0066D6] text-white rounded-full flex items-center justify-center shadow-apple-lg transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <Phone className="w-6 h-6" />
      </a>

      {/* WhatsApp Button */}
      <a
        href={firmInfo.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile iletişime geç"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full flex items-center justify-center shadow-apple-lg transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
