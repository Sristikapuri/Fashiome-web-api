import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getUserData } from "@/lib/cookies";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
    title: {
    default: "FashioMe | Personal Style, Reimagined",
    template: "%s | FashioMe",
  },
  description:
    "Discover personalized outfits, shop your style, and build a wardrobe that feels like you.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const initialUser = await getUserData();

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className="bg-page font-sans text-heading antialiased" suppressHydrationWarning>
        <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
      </body>
    </html>
  );
}
