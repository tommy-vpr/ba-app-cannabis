// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import { getInitialDashboardData } from "@/app/actions/getInitialDashboardData";
import { ContactProvider } from "@/context/ContactContext";
import { EditContactModal } from "@/components/EditContactModal";
import { LogMeetingModal } from "@/components/LogMeetingModal";
import { cookies } from "next/headers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brand Ambassador Dashboard | BA App",
  description:
    "Effortlessly manage brand ambassadors with the BA App — featuring HubSpot integration, lead status filters, zip code search, and real-time updates.",
  metadataBase: new URL("https://ba-app-branded.vercel.app"),
  openGraph: {
    title: "Brand Ambassador Dashboard | BA App",
    description: "A modern CRM dashboard to manage brand ambassadors.",
    url: "https://ba-app-branded.vercel.app",
    siteName: "BA App",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/ba-open-graph.png",
        width: 1200,
        height: 630,
        alt: "BA App Dashboard Overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Ambassador Dashboard | BA App",
    description:
      "Manage ambassadors, track visits, and filter leads with HubSpot integration.",
    images: ["https://ba-app-branded.vercel.app/og-image.jpg"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const selectedBrand =
    (cookieStore.get("selected_brand")?.value as "litto" | "skwezed") ??
    "litto";

  const { contacts, after, hasNext, statusCounts } =
    await getInitialDashboardData(selectedBrand);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-[#06070a]`}
      >
        <Providers>
          <ContactProvider
            initialContacts={contacts}
            initialCursors={{ 1: after ?? null }}
            initialHasNext={hasNext}
            initialStatusCounts={statusCounts}
          >
            <Toaster position="top-center" />
            {children}
            {/* ✅ Mount EditContactModal globally here */}
            <EditContactModal />
            <LogMeetingModal />
          </ContactProvider>
        </Providers>
      </body>
    </html>
  );
}
