import type { Metadata } from "next";
import localFont from "next/font/local";
import { Tajawal } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Navbar } from "@/src/components/navbar";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
});

const uthmanic = localFont({
  src: "../public/fonts/KFGQPC-Uthmanic-HAFS.otf",
  variable: "--font-uthmanic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SHK Islam",
  description:
    "Specialized Islamic web platform targeted at Da'iyahs (preachers), Khateebs (speakers), and students of Islamic knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${tajawal.variable} ${uthmanic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          {children}
          <Toaster position="top-center" dir="rtl" />
        </ThemeProvider>
      </body>
    </html>
  );
}
