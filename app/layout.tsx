import type { Metadata } from "next";
import { Geist, Geist_Mono ,Mulish} from "next/font/google";
import TopNav from "@/components/top-nav";
import "./globals.css";

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Smart Home BEMS",
  description: "smart home building energy management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mulish.className} antialiased bg-[#A5DCEC]`}
      >
        {children}
      </body>
    </html>
  );
}
