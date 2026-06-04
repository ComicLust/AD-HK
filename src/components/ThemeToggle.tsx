"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl text-[#1D1D1F]/70 hover:text-[#1D1D1F] hover:bg-[rgba(0,0,0,0.04)]">
        <span className="sr-only">Tema Değiştir</span>
        <Sun className="w-4.5 h-4.5 opacity-0" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-xl text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all duration-200"
      title={isDark ? "Aydınlık Moda Geç" : "Karanlık Moda Geç"}
    >
      <span className="sr-only">Tema Değiştir</span>
      {isDark ? (
        <Sun className="w-4.5 h-4.5 text-[#FF9500] transition-transform duration-300 rotate-0" />
      ) : (
        <Moon className="w-4.5 h-4.5 text-[#007AFF] transition-transform duration-300 rotate-12" />
      )}
    </Button>
  );
}
