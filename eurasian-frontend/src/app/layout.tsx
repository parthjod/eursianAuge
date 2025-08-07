import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/toaster";
import Navbar from '../components/Navbar';
import Footer from "../components/Footer";
import { UserProvider } from "../contexts/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eurasian - AI-Powered Cybersecurity",
  description: "Advanced cybersecurity powered by AI agents to protect your digital presence across social media platforms.",
  keywords: ["Eurasian", "cybersecurity", "AI", "social media", "protection", "threat detection"],
  authors: [{ name: "Eurasian Team" }],
  openGraph: {
    title: "Eurasian - AI-Powered Cybersecurity",
    description: "Advanced cybersecurity powered by AI agents to protect your digital presence across social media platforms.",
    url: "https://eurasian.com",
    siteName: "Eurasian",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eurasian - AI-Powered Cybersecurity",
    description: "Advanced cybersecurity powered by AI agents to protect your digital presence across social media platforms.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <UserProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
