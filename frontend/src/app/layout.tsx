import type { Metadata } from "next";
import "./output.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Elaxora Solutions | Final Year Projects",
  description: "Get premium, customized final-year projects with complete local setup and Viva mentoring. Build, Understand, and Present with confidence.",
  openGraph: {
    title: "Elaxora Solutions | Final Year Projects",
    description: "Get premium, customized final-year projects with complete local setup and Viva mentoring.",
    url: "https://elaxora-final-year-project.vercel.app",
    siteName: "Elaxora Solutions",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elaxora Solutions | Final Year Projects",
    description: "Premium customized final-year projects with full mentoring.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased pb-16 md:pb-0">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
