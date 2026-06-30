import { redirect } from "next/navigation";
import { getUserData, clearAuthCookies } from "@/lib/cookies";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { UpdateForm } from "./_components/UpdateForm";
import { handleGetSilhouetteProfile } from "@/lib/actions/silhouette-action";

export default async function ProfilePage() {
  const user = await getUserData();
  const silhouetteResult = await handleGetSilhouetteProfile();
  const silhouette = silhouetteResult.success ? silhouetteResult.data : null;

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
          <div className="flex gap-3">
            <Link href={ROUTES.dashboard} className="w-fit rounded-full border border-[#A41515] px-5 py-3 text-sm font-bold text-[#820000] no-underline transition hover:bg-[#A41515] hover:text-white">
              Back to dashboard
            </Link>
            <form action={async () => {
              "use server";
              await clearAuthCookies();
              redirect("/login");
            }}>
              <button type="submit" className="w-fit rounded-full bg-[#820000] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5F0000]">
                Logout
              </button>
            </form>
          </div>
        </div>
        <div className="rounded-lg border border-[#E7B8B8] bg-white p-5 shadow-[0_10px_30px_rgba(74,29,29,0.06)] md:p-8">
          <UpdateForm initialUser={user} />
        </div>

        <section className="mt-8">
          <div className="rounded-2xl border border-[#E7B8B8] bg-white p-6 shadow-[0_10px_30px_rgba(74,29,29,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A41515]">Style Identity</p>
            <h2 className="mt-2 text-2xl font-bold text-[#260909]">Silhouette and color profile</h2>
            <p className="mt-2 max-w-2xl text-sm text-[#735656]">
              Keep your silhouette, face shape, and skin-tone data here so outfit generation stays personal.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["Gender", silhouette?.gender],
                ["Body type", silhouette?.bodyType],
                ["Height", silhouette?.height ? `${silhouette.height} cm` : ""],
                ["Weight", silhouette?.weight ? `${silhouette.weight} kg` : ""],
                ["Skin tone", silhouette?.skinTone],
                ["Face shape", silhouette?.faceShape],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9A7E74]">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#260909]">{value || "Not set"}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={ROUTES.silhouette}
                className="rounded-full bg-[#820000] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5F0000]"
              >
                Edit style profile
              </Link>
              <Link
                href={ROUTES.dashboard}
                className="rounded-full border border-[#A41515] px-5 py-3 text-sm font-bold text-[#820000] transition hover:bg-[#FFF7F7]"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
