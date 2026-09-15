import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LojaTech | Tecnologia para o seu dia a dia",
    template: "%s | LojaTech",
  },
  description: "Uma loja de tecnologia simples, moderna e preparada para crescer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-950 text-slate-100">
        <Header />
        <div className="flex min-h-[calc(100vh-4rem)] flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
