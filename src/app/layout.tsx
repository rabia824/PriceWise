import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PriceWise | Premium Smart Price Comparison Platform",
  description: "Find the best deals across Trendyol, Amazon, Hepsiburada, and N11 in seconds with smart tracking and recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
