import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeX Learning",
  description: "Learn LaTeX by typing math expressions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
