import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Seattle Emergency Response Map",
  description: "Real-time visualization of Seattle Fire Department 911 emergency response incidents on an interactive map. Track fire, medical, and other emergency responses across Seattle.",
  keywords: ["Seattle", "911", "emergency", "fire department", "incidents", "real-time", "map"],
  authors: [{ name: "CamC9" }],
  openGraph: {
    title: "Seattle Emergency Response Map",
    description: "Real-time visualization of Seattle emergency response incidents",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
