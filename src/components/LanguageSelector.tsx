"use client";

import { useLanguage } from "@/hooks/useSiteData";
import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 h-9 rounded-xl text-foreground/70 hover:text-foreground hover:bg-foreground/5 px-2.5"
        title="Dil Seçin / Select Language"
      >
        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
          {language === "tr" ? "🇹🇷 TR" : "🇬🇧 EN"}
        </span>
      </Button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-36 bg-card rounded-2xl shadow-apple-lg border border-border py-1.5 z-50 overflow-hidden">
          <button
            onClick={() => {
              setLanguage("tr");
              setOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-foreground/80 hover:text-[#007AFF] hover:bg-[#007AFF]/6 transition-all"
          >
            <span className="flex items-center gap-2">
              <span className="text-sm">🇹🇷</span>
              <span>Türkçe</span>
            </span>
            {language === "tr" && <Check className="w-3.5 h-3.5 text-[#007AFF]" />}
          </button>
          <button
            onClick={() => {
              setLanguage("en");
              setOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-foreground/80 hover:text-[#007AFF] hover:bg-[#007AFF]/6 transition-all"
          >
            <span className="flex items-center gap-2">
              <span className="text-sm">🇬🇧</span>
              <span>English</span>
            </span>
            {language === "en" && <Check className="w-3.5 h-3.5 text-[#007AFF]" />}
          </button>
        </div>
      )}
    </div>
  );
}
