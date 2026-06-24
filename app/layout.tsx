import type { Metadata } from "next";
import localFont from "next/font/local";
import { Tajawal, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Navbar } from "@/src/components/navbar";
import { ReadingProgressProvider } from "@/src/lib/reading-progress";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
  metadataBase: new URL("https://shkislam.vercel.app"),
  title: {
    template: "%s | SHK Islam",
    default: "SHK Islam - منصة إسلامية للدعاة والخطباء",
  },
  description:
    "Specialized Islamic web platform targeted at Da'iyahs (preachers), Khateebs (speakers), and students of Islamic knowledge.",
  robots: {
    index: true,
    follow: true,
  },
  keywords: ['Islamic platform', 'Da\'iyahs', 'Khateebs', 'Islamic knowledge', 'Arabic content','shkislam','SHK Islam','ismail projects','shkislam.vercel.app', 'shkislam.com','shkislam.net','shkislam.org','shkislam.io','shkislam.co','shkislam.dev','shkislam.app','shkislam.online','shkislam.site','shkislam.tech','shk projects','shk islam','shk islamic platform','shk islamic web platform','shk islamic website','shk islamic online platform','shk islamic online website','shk islamic online service','shk islamic online application','shk islamic online app','shk islamic online tool','shk islamic online resource','hadiths','quran','islamic teachings','islamic education','islamic learning','islamic resources','islamic articles','islamic videos','islamic lectures','islamic sermons','islamic khutbahs','islamic dawah','islamic preaching','islamic speaking','islamic communication','islamic outreach'],
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  verification: {
    google: "fgXIud_IWt2XmIdXE9hXYw7ThvGhOPvJu5LkIkoNGOM",
  },
  openGraph: {
    title: "SHK Islam",
    description:
      "Specialized Islamic web platform targeted at Da'iyahs (preachers), Khateebs (speakers), and students of Islamic knowledge.",
    images: ["/assets/logo.png"],
  },
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
      className={cn("h-full", "antialiased", tajawal.variable, uthmanic.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SHK Islam",
              url: "https://shkislam.vercel.app",
              logo: "https://shkislam.vercel.app/assets/logo.png",
              description:
                "Specialized Islamic web platform targeted at Da'iyahs, Khateebs, and students of Islamic knowledge.",
            }),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ReadingProgressProvider>
            <Navbar />
            {children}
            <Toaster position="top-center" dir="rtl" />
          </ReadingProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
