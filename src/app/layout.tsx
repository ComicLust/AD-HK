import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { db } from "@/lib/db";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adil Hukuk Danışmanlık | Güven, Uzmanlık ve Çözüm Odaklı Hukuki Hizmet",
  description:
    "Adil Hukuk Danışmanlık Bürosu olarak, müvekkillerimize hak ettikleri nitelikli ve güvenilir hukuki hizmeti sunuyoruz. Ceza, Aile, Ticaret, Miras Hukuku ve daha fazlası.",
  keywords: [
    "Adil Hukuk",
    "Hukuk Bürosu",
    "Avukat",
    "Danışmanlık",
    "Ceza Hukuku",
    "Aile Hukuku",
    "Ticaret Hukuku",
    "İstanbul Avukat",
    "Bakırköy Avukat",
  ],
  authors: [{ name: "Adil Hukuk Danışmanlık" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚖️</text></svg>",
  },
  openGraph: {
    title: "Adil Hukuk Danışmanlık",
    description: "Güven, Uzmanlık ve Çözüm Odaklı Hukuki Hizmet",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let integrations = null;
  try {
    integrations = await db.integrationSettings.findUnique({
      where: { id: "default" }
    });
  } catch (e) {
    console.error("Failed to load integrations in layout:", e);
  }

  const gaId = integrations?.googleAnalytics;
  const searchConsoleTag = integrations?.searchConsole;

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {searchConsoleTag && (
          <meta name="google-site-verification" content={searchConsoleTag} />
        )}
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
