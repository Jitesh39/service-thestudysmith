"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { usePathname } from "next/navigation";

import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";
import NotificationHandler from "@/components/NotificationHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isBlogDetailed = pathname?.startsWith("/blog/");
  const hideFloatingIcons = isDashboard || isBlogDetailed;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2773187784082106"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <NotificationHandler />
        {children}
        {!hideFloatingIcons && (
          <>
            <ScrollToTop />
            <WhatsAppButton />
            <Chatbot />
          </>
        )}
      </body>
    </html>
  );
}
