import type { Metadata } from "next";
import { fontVariables } from "@/design/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "YourBusiness.Cards — stunning digital business cards",
    template: "%s · YourBusiness.Cards",
  },
  description:
    "Create a beautiful, single-screen digital business card for your business in seconds. Share it anywhere with a link or QR code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
