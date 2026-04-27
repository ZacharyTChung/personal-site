import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  title: "Zachary Chung. Engineer, athlete, explorer",
  description:
    "Personal site of Zachary Chung. Software engineer based in Los Angeles, open to relocating. Building things, training for an Ironman, and finding any excuse to be outside.",
  metadataBase: new URL("https://zacharychung.dev"),
  openGraph: {
    title: "Zachary Chung",
    description:
      "Engineer, athlete, explorer. Building things and chasing mountains.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${fraunces.variable} font-sans grain`}
      >
        {children}
      </body>
    </html>
  );
}
