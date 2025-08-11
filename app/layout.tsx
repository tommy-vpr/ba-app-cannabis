// app/layout.tsx
import "./globals.css";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./components/Providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brand Ambassador Dashboard | BA App",
  description:
    "Effortlessly manage brand ambassadors with the BA App — featuring HubSpot integration, lead status filters, zip code search, and real-time updates.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-[#06070a]`}
      >
        <Providers>
          <Toaster position="top-center" />

          {children}
        </Providers>
      </body>
    </html>
  );
}
