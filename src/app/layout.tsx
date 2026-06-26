import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getUserData } from "@/lib/cookies";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FashioMe Web Project",
    template: "%s | FashioMe Web Project",
  },
  description:
    "Discover personalized outfit recommendations powered by AI.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const initialUser = await getUserData();

  return (
    <html lang="en">
      <body className="bg-page font-sans text-heading antialiased">
        <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
      </body>
    </html>
  );
}
