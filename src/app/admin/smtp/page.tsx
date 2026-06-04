"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, Mail, AlertTriangle, Send } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function SmtpSettingsPage() {
  const [smtp, setSmtp] = useState({
    host: "",
    port: 587,
    secure: false,
    username: "",
    password: "",
    fromName: "Adil Hukuk",
    fromEmail: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Test states
  const [testEmail, setTestEmail] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestOpen, setIsTestOpen] = useState(false);

  useEffect(() => {
    loadSmtp();
  }, []);

  const loadSmtp = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/smtp-settings");
      const data = await res.json();
      if (data && !data.error) {
        setSmtp({
          host: data.host || "",
          port: data.port || 587,
          secure: !!data.secure,
          username: data.username || "",
          password: data.password || "",
          fromName: data.fromName || "Adil Hukuk",
          fromEmail: data.fromEmail || ""
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: string, val: any) => {
    setSmtp((prev) => ({
      ...prev,
      [field]: val
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/smtp-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(smtp)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Ayarlar kaydedilemedi.");
      }
    } catch (err) {
      console.error(err);
      alert("Hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/smtp-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...smtp,
          toEmail: testEmail
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({ success: true, message: data.message });
      } else {
        setTestResult({ success: false, message: data.error || "Gönderim başarısız." });
      }
    } catch (err) {
      setTestResult({ success: false, message: "Bağlantı hatası oluştu." });
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none pb-10">
      <form onSubmit={handleSave} className="space-y-6">
        <Card className="rounded-3xl border-[#D1D1D6] shadow-sm bg-white dark:bg-card overflow-hidden">
          <CardHeader className="border-b border-[#E5E5EA] dark:border-border">
            <CardTitle className="text-base font-bold text-[#1D1D1F] dark:text-foreground">E-posta SMTP Ayarları</CardTitle>
            <CardDescription className="text-xs">
              Sitedeki iletişim formu mesajlarının yönlendirileceği ve sistem e-postalarının gönderileceği SMTP sunucusu bilgilerini yapılandırın.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F] dark:text-foreground">SMTP Sunucu Adresi (Host)</label>
                <Input
                  value={smtp.host}
                  onChange={(e) => handleFieldChange("host", e.target.value)}
                  placeholder="mail.example.com"
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] bg-white dark:bg-[#1C1C1E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F] dark:text-foreground">SMTP Portu</label>
                <Input
                  type="number"
                  value={smtp.port}
                  onChange={(e) => handleFieldChange("port", parseInt(e.target.value) || 587)}
                  placeholder="587"
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] bg-white dark:bg-[#1C1C1E]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F2F2F7]/50 dark:bg-foreground/5 rounded-2xl border border-[#D1D1D6]/40">
              <div className="space-y-0.5">
                <label className="text-xs font-bold text-[#1D1D1F] dark:text-foreground">Güvenli Bağlantı (SSL/TLS)</label>
                <p className="text-[10px] text-muted-foreground">Port 465 için aktif edin. Port 587/25 için pasif kalmalıdır.</p>
              </div>
              <Switch
                checked={smtp.secure}
                onCheckedChange={(checked) => handleFieldChange("secure", checked)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F] dark:text-foreground">Kullanıcı Adı (Username)</label>
                <Input
                  value={smtp.username}
                  onChange={(e) => handleFieldChange("username", e.target.value)}
                  placeholder="info@example.com"
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] bg-white dark:bg-[#1C1C1E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F] dark:text-foreground">Şifre (Password)</label>
                <Input
                  type="password"
                  value={smtp.password}
                  onChange={(e) => handleFieldChange("password", e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] bg-white dark:bg-[#1C1C1E]"
                />
              </div>
            </div>

            <hr className="border-border/60" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F] dark:text-foreground">Gönderici Adı</label>
                <Input
                  value={smtp.fromName}
                  onChange={(e) => handleFieldChange("fromName", e.target.value)}
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] bg-white dark:bg-[#1C1C1E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F] dark:text-foreground">Gönderici E-posta Adresi (From Email)</label>
                <Input
                  type="email"
                  value={smtp.fromEmail}
                  onChange={(e) => handleFieldChange("fromEmail", e.target.value)}
                  placeholder="info@example.com"
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] bg-white dark:bg-[#1C1C1E]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Dialog open={isTestOpen} onOpenChange={setIsTestOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" className="rounded-full px-5 py-2 border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF]/5 text-xs font-semibold h-9">
                <Send className="w-3.5 h-3.5 mr-1.5" /> Test E-postası Gönder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white dark:bg-card border-0 shadow-apple-lg">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-[#1D1D1F] dark:text-foreground">SMTP Bağlantı Testi</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Kaydedilmiş ayarları test etmek için bir alıcı adresi girerek test e-postası tetikleyin.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1D1D1F] dark:text-foreground">Alıcı E-posta Adresi</label>
                  <Input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="ornek@domain.com"
                    className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                  />
                </div>
                {testResult && (
                  <div className={`p-3 rounded-xl border text-xs flex gap-2 items-start ${
                    testResult.success 
                      ? "bg-[#34C759]/10 border-[#34C759]/20 text-[#34C759]"
                      : "bg-[#FF3B30]/10 border-[#FF3B30]/20 text-[#FF3B30]"
                  }`}>
                    {testResult.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{testResult.message}</span>
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setIsTestOpen(false)} className="rounded-full px-4 text-xs">Kapat</Button>
                  <Button type="button" onClick={handleTestEmail} disabled={isTesting || !testEmail} className="rounded-full px-5 bg-[#007AFF] hover:bg-[#0066D6] text-white text-xs font-semibold">
                    {isTesting ? "Gönderiliyor..." : "Test Et"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <div className="flex items-center gap-1 text-[#34C759] text-xs font-semibold">
                <CheckCircle className="w-4 h-4" /> Ayarlar kaydedildi
              </div>
            )}
            <Button
              type="submit"
              disabled={isSaving}
              className="rounded-full px-8 py-2.5 bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold text-xs h-9 shadow-sm"
            >
              {isSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
