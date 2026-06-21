import { redirect } from "next/navigation";
import { getUserData } from "@/lib/cookies";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { UpdateForm } from "./_components/UpdateForm";

export default async function ProfilePage() {
  const user = await getUserData();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#FFF7F7] px-5 py-8 text-[#260909]">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A41515]">Account</p>
            <h1 className="mt-2 text-3xl font-bold text-[#260909] md:text-4xl">Update Profile</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#735656]">Manage the details used across your dashboard and outfit recommendations.</p>
          </div>
          <Link href={ROUTES.dashboard} className="w-fit rounded-full border border-[#A41515] px-5 py-3 text-sm font-bold text-[#820000] no-underline transition hover:bg-[#A41515] hover:text-white">
            Back to dashboard
          </Link>
        </div>
        <div className="rounded-lg border border-[#E7B8B8] bg-white p-5 shadow-[0_10px_30px_rgba(74,29,29,0.06)] md:p-8">
          <UpdateForm initialUser={user} />
        </div>
      </section>
    </main>
  );
}
