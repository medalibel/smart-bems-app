import type { Metadata } from "next";
import { Geist, Geist_Mono ,Mulish} from "next/font/google";
import SideNav from "@/components/sidenav";
import TopNav from "@/components/top-nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        <header>
          <div className="h-16 px-[30px] flex items-center justify-between bg-[#0f6589]">
            <img src="/logo.jpg" alt="Logo" className="w-12 h-12 mr-3" />
            <h1 className=" text-2xl text-white font-bold">SmartHome Energy Management System</h1>
            <div className="text-xl">🔔 👤</div>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-5 bg-[#188bb4] text-white p-3">
            <TopNav />
          </nav>
        </header>

        <main className="flex-grow p-4 md:overflow-y-auto md:p-5">{children}</main>

        <footer className='mt-8 p-4 bg-[#0f6f89] text-center text-white'>© 2025 SmartHome Energy Management System</footer>
        
      </body>
    </html>
  );
}
