import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getTokenCookie } from "@/lib/cookies";
import { whoami } from "@/lib/api/auth";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const token = await getTokenCookie();
  if (!token) {
    redirect("/login");
  }

  let user;
  try {
    const result = await whoami(token);
    user = result.success ? result.data : null;
  } catch {
    user = null;
  }

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff9f5,_#f8eee8_45%,_#f4e6dc_100%)] text-[#260909] lg:flex">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} />
        <main className="flex-1 px-5 py-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
