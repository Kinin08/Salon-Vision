import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Salon Vision - Sistema de Gestão para Salões de Beleza",
  description:
    "Sistema completo de gestão para salões de beleza. Agendamento, controle de estoque e análise de desempenho em uma única plataforma.",
  keywords: [
    "salão de beleza",
    "gestão",
    "agendamento",
    "estoque",
    "beleza",
    "cabelo",
    "manicure",
  ],
  authors: [{ name: "Salon Vision" }],
  openGraph: {
    title: "Salon Vision - Sistema de Gestão para Salões de Beleza",
    description:
      "Sistema completo de gestão para salões de beleza. Agendamento, controle de estoque e análise de desempenho.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5e6e8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1520" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
