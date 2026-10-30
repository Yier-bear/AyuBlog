import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { siteConfig } from "../siteConfig";
import MobileBackButton from "../components/MobileBackButton";
import SplashScreen from "../components/SplashScreen";
import ClickEffect from "../components/ClickEffect";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const notoSerif = Noto_Serif_SC({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: { default: siteConfig.title, template: `%s · ${siteConfig.title}` },
  description: siteConfig.bio,
  keywords: ["AI 产品", "AI Product", "Agent", "用户体验", "产品设计", "ayu"],
  authors: [{ name: "ayu" }],
  creator: "ayu",
  icons: { icon: siteConfig.faviconUrl, apple: siteConfig.faviconUrl },
  openGraph: { title: siteConfig.title, description: siteConfig.bio, type: "website", locale: "zh_CN" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} ${notoSerif.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full overflow-x-hidden font-serif text-[#493d3a]">
        <ThemeProvider>
          <SplashScreen />
          <div className="ayu-ambient" aria-hidden="true"><span className="ayu-blob ayu-blob-a" /><span className="ayu-blob ayu-blob-b" /><span className="ayu-blob ayu-blob-c" /></div>
          <div className="relative z-10 min-h-screen">{children}</div>
          <div className="md:hidden"><MobileBackButton /></div>
          <ClickEffect />
        </ThemeProvider>
      </body>
    </html>
  );
}
