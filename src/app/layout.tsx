import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Script from "next/script";
import ClientRootLayout from "@/components/forums/Client-RootLayout";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  preload: true,
  weight: ["400"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title:
      "TheDemonTuan - The community shares Datapacks for Minecraft | TheDemonTuan",
    description:
      "The community shares best Datapacks for Minecraft ever, You can find and download the best Datapacks for Minecraft here.",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
