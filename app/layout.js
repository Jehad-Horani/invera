import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "INVERA - Designing Landmarks, Building Value",
  description: "Premier real estate development, architecture, interior design, and renovation company in Jordan. Creating architectural masterpieces that redefine luxury living.",
  keywords: "real estate, architecture, interior design, renovation, Jordan, Amman, luxury properties",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-[#0B0B0B] text-[#F5F2EA]`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
