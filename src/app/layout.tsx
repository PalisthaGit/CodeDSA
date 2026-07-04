import type { Metadata, Viewport } from "next";
import { Patrick_Hand, Pacifico } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileSidebarProvider } from "@/lib/MobileSidebarContext";

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patrick-hand",
  display: "swap",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://dsanotes.com"),
  title: "DSANotes — Learn DSA step by step, for free",
  description:
    "Learn data structures and algorithms step by step. Clear explanations, interactive visualizers, and a hand-holding approach until you truly get it. Free forever.",
  keywords: [
    "DSA",
    "data structures",
    "algorithms",
    "learn DSA",
    "DSA visualizer",
    "free DSA course",
    "beginner DSA",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DSANotes — Learn DSA step by step, for free",
    description:
      "Learn data structures and algorithms step by step. Clear explanations, interactive visualizers, and a hand-holding approach until you truly get it. Free forever.",
    type: "website",
    url: "https://dsanotes.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "DSANotes — Learn DSA step by step, for free",
    description:
      "Learn data structures and algorithms step by step. Clear explanations, interactive visualizers, and a hand-holding approach until you truly get it. Free forever.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${patrickHand.variable} ${pacifico.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-text-primary">
        <MobileSidebarProvider>
          <Navbar />
          <main className="flex-1 pt-[52px]">{children}</main>
        </MobileSidebarProvider>
        <Footer />
      </body>
    </html>
  );
}
