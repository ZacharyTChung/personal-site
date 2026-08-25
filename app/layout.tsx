import type { Metadata, Viewport } from "next";
import { Nunito, Baloo_2, Caveat } from "next/font/google";
import "./globals.css";

// friendly rounded body
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// chunky rounded headings
const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// handwritten accents (eyebrows, doodle labels, captions)
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zachary Chung, Software Engineer",
  description:
    "I'm a software engineer based in LA. I build web and mobile apps, train for triathlons, and spend a lot of time outside.",
  metadataBase: new URL("https://zacharychung.vercel.app"),
  openGraph: {
    title: "Zachary Chung",
    description:
      "Software engineer based in LA. I build things and spend time outside.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcf9f3" },
    { media: "(prefers-color-scheme: dark)", color: "#181a21" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${nunito.variable} ${baloo.variable} ${caveat.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
