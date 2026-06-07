import type { Metadata } from "next";
import { Inter, Fraunces, Silkscreen } from "next/font/google";
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

// pixel accent font for the game-HUD chrome (labels, key caps, prompts)
const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-hud",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zachary Chung — software engineer in LA",
  description:
    "I'm a software engineer in LA. I build web and mobile apps, train for triathlons, and spend a lot of time outside. Have a look around.",
  metadataBase: new URL("https://zacharychung.dev"),
  openGraph: {
    title: "Zachary Chung",
    description:
      "Software engineer in LA who builds things and trains a little too much.",
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
        className={`${inter.variable} ${fraunces.variable} ${silkscreen.variable} font-sans grain`}
      >
        {children}
      </body>
    </html>
  );
}
