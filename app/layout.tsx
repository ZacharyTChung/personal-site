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
    "Software engineer in LA working across engineering and product. Projects, stack, and how to get in touch.",
  metadataBase: new URL("https://zacharychung.vercel.app"),
  openGraph: {
    title: "Zachary Chung",
    description:
      "Software engineer in LA working across engineering and product.",
    type: "website",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Zachary Chung",
  jobTitle: "Software Engineer",
  url: "https://zacharychung.vercel.app",
  sameAs: [
    "https://github.com/ZacharyTChung",
    "https://www.linkedin.com/in/zachary-chung-07012a319/",
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:border-2 focus:border-foreground/20 focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:text-foreground focus:shadow-md"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
