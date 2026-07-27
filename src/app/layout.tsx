import type { Metadata } from "next";
import { Playfair_Display, Noto_Serif, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kutsal Kitap Asistanı — Dinlerarası Bilgelik",
  description:
    "Sorularınızı İslam, Hristiyanlık ve Yahudilik kutsal kitapları perspektifinden tarafsızca araştırın. Dinlerarası karşılaştırma için akademik ve saygılı bir rehber.",
  keywords: [
    "kutsal kitap",
    "dinlerarası",
    "İslam",
    "Hristiyanlık",
    "Yahudilik",
    "Kuran",
    "İncil",
    "Tevrat",
    "din karşılaştırma",
  ],
  authors: [{ name: "Holy Book Assistant" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${notoSerif.variable} ${inter.variable} antialiased bg-background text-foreground font-serif`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
