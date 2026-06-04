"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Giriş başarısız.");
      }
    } catch (err) {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 select-none bg-[#F2F2F7]">
      <Card className="w-full max-w-md rounded-2xl border-[#D1D1D6] shadow-apple-lg bg-white overflow-hidden">
        <CardHeader className="text-center pt-8 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#007AFF] flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-sm">
            A
          </div>
          <CardTitle className="text-2xl font-extrabold text-[#1D1D1F] tracking-tight">
            Yönetim Paneli
          </CardTitle>
          <CardDescription className="text-xs text-[#86868B]">
            Adil Hukuk Danışmanlık CMS Girişi
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-[#FF3B30]">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#FF3B30]" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">Kullanıcı Adı</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Kullanıcı adınızı girin"
                required
                className="h-11 rounded-xl border-[#D1D1D6] text-sm focus:ring-[#007AFF] focus:border-[#007AFF] bg-[#F2F2F7]/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">Şifre</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi girin"
                  required
                  className="h-11 rounded-xl border-[#D1D1D6] text-sm focus:ring-[#007AFF] focus:border-[#007AFF] bg-[#F2F2F7]/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold mt-2 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Giriş Yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
