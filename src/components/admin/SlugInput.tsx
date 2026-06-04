"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, RefreshCw } from "lucide-react";

export function convertToSlug(text: string): string {
  if (!text) return "";
  
  let slug = text.trim().toLowerCase();
  
  const map: Record<string, string> = {
    "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u",
    "â": "a", "î": "i", "û": "u"
  };

  for (const key in map) {
    slug = slug.replace(new RegExp(key, "g"), map[key]);
  }

  return slug
    .replace(/[^a-z0-9\s-]/g, "") 
    .replace(/\s+/g, "-")          
    .replace(/-+/g, "-")           
    .replace(/^-+|-+$/g, "");      
}

interface SlugInputProps {
  sourceValue: string;
  value: string;
  onChange: (slug: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SlugInput({ sourceValue, value, onChange, placeholder = "slug", disabled = false }: SlugInputProps) {
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    if (isLocked && sourceValue) {
      onChange(convertToSlug(sourceValue));
    }
  }, [sourceValue, isLocked, onChange]);

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
        <Input
          value={value}
          onChange={(e) => onChange(convertToSlug(e.target.value))}
          disabled={disabled || isLocked}
          placeholder={placeholder}
          className="pl-10 rounded-xl border-[#D1D1D6] text-sm focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
        />
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsLocked(!isLocked)}
        className={`rounded-xl border-[#D1D1D6] font-medium text-xs flex items-center gap-1.5 h-11 ${
          isLocked ? "bg-[#F2F2F7] text-[#1D1D1F]" : "bg-white text-[#007AFF] border-[#007AFF]/30"
        }`}
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isLocked ? "" : "animate-spin text-[#007AFF]"}`} />
        {isLocked ? "Kilidi Aç" : "Otomatik"}
      </Button>
    </div>
  );
}
