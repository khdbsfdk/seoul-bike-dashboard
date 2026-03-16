import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seoul Bike Dashboard",
  description: "Real-time Seoul public bike tracking dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="border-b bg-background sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="font-bold text-lg hover:text-primary transition-colors">
                🚲 따릉이 지도
              </Link>
              <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  대시보드
                </Link>
                <Link href="/guestbook" className="hover:text-foreground transition-colors">
                  방명록
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
