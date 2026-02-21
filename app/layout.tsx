import type { Metadata } from "next";
import { Noto_Serif_JP, Zen_Antique } from "next/font/google";
import "./globals.css";

const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

const zenAntique = Zen_Antique({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-zen-antique",
  display: "swap",
});

export const metadata: Metadata = {
  title: "チ。ジェネレーター",
  description:
    "漫画「チ。−地球の運動について−」風のロゴ画像を生成するツール",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${notoSerifJp.variable} ${zenAntique.variable}`}>
        {children}
      </body>
    </html>
  );
}
