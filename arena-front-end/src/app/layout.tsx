import { AlertProvider } from "@/hooks/useAlerts";
import { ReactQueryProvider } from "@/providers";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutContentWrapper } from "./LayoutContentWrapper";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sua Arena - Plataforma de Gestão",
  description: "Plataforma de Gestão para arenas esportivas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <AlertProvider>
          <ReactQueryProvider>
            <LayoutContentWrapper>{children}</LayoutContentWrapper>
            <ReactQueryDevtools initialIsOpen={false} />
          </ReactQueryProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
