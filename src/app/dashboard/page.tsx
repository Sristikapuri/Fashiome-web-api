import { getUserData, clearAuthCookies } from "@/lib/cookies";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { redirect } from "next/navigation";

const statItems = [
  { label: "Saved Looks", value: "24" },
  { label: "Style Score", value: "88%" },
  { label: "Wardrobe Items", value: "42" },
];

const preferenceTags = ["Modern Fusion", "South Asian Traditional", "Minimal Luxury"];

export default async function Dashboard() {
  const user = await getUserData();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FFF7F7] text-[#260909]">
      <header className="border-b border-[#E7B8B8] bg-[#FFF7F7]/95 px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href={ROUTES.dashboard} className="font-serif text-2xl font-bold text-[#820000] no-underline">
            FashioMe
          </Link>

          <nav className="flex items-center gap-2 text-sm font-semibold">
            <Link href={ROUTES.profile} className="rounded-full px-4 py-2 text-[#735656] no-underline transition hover:bg-white hover:text-[#820000]">
              Profile
            </Link>
            <form action={async () => {
              "use server";
              await clearAuthCookies();
              redirect("/login");
            }}>
              <button type="submit" className="rounded-full border border-[#A41515] px-4 py-2 text-[#820000] transition hover:bg-[#A41515] hover:text-white">
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="px-5 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-lg bg-[#4A0000] p-6 text-white shadow-[0_18px_40px_rgba(74,29,29,0.14)] md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-5">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-[#A41515] bg-white">
                    <img
                      src={user.profileImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300"}
                      alt="profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FFDADA]">Dashboard</p>
                    <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="mt-2 text-sm text-[#FFECEC]">{user.email}</p>
                  </div>
                </div>
                <Link href={ROUTES.profile} className="inline-flex w-fit rounded-full bg-[#A41515] px-5 py-3 text-sm font-bold text-white no-underline transition hover:bg-white hover:text-[#4A0000]">
                  Edit Profile
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {statItems.map((item) => (
                  <div key={item.label} className="rounded-lg border border-white/15 bg-white/10 p-4">
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#FFDADA]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#E7B8B8] bg-white p-6 shadow-[0_10px_30px_rgba(74,29,29,0.06)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A41515]">Account</p>
              <h2 className="mt-2 text-2xl font-bold text-[#260909]">Profile completion</h2>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#FFECEC]">
                <div className="h-full w-[78%] rounded-full bg-[#820000]" />
              </div>
              <p className="mt-3 text-sm text-[#735656]">Keep your size, style, and account details updated for better recommendations.</p>
              <div className="mt-6 grid gap-3">
                <Link href={ROUTES.profile} className="rounded-lg border border-[#E7B8B8] px-4 py-3 text-sm font-semibold text-[#260909] no-underline transition hover:border-[#820000] hover:bg-[#FFF7F7]">
                  Update profile details
                </Link>
                <Link href={ROUTES.password} className="rounded-lg border border-[#E7B8B8] px-4 py-3 text-sm font-semibold text-[#260909] no-underline transition hover:border-[#820000] hover:bg-[#FFF7F7]">
                  Change password
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-[#E7B8B8] bg-white p-6 shadow-[0_10px_30px_rgba(74,29,29,0.06)]">
              <h2 className="text-xl font-bold text-[#260909]">My Biometrics</h2>
              <div className="mt-5 divide-y divide-[#E7B8B8]">
                {[
                  ["Age", `${user.age}`],
                  ["Gender", user.gender],
                  ["Skin Tone", "Honey Warm"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-4 text-sm">
                    <span className="font-semibold text-[#735656]">{label}</span>
                    <span className="font-bold capitalize text-[#260909]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#E7B8B8] bg-white p-6 shadow-[0_10px_30px_rgba(74,29,29,0.06)]">
              <h2 className="text-xl font-bold text-[#260909]">Style Preferences</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {preferenceTags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[#FFECEC] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#820000]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-[#FFF7F7] p-4">
                  <p className="text-sm font-bold text-[#260909]">Party & Events</p>
                  <p className="mt-1 text-xs text-[#735656]">Elevated outfits ready for special plans.</p>
                </div>
                <div className="rounded-lg bg-[#FFF7F7] p-4">
                  <p className="text-sm font-bold text-[#260909]">Casual Weekend</p>
                  <p className="mt-1 text-xs text-[#735656]">Comfortable looks with polished details.</p>
                </div>
              </div>
            </div>
          </section>

          <div className="rounded-lg border border-[#E7B8B8] bg-white p-6 shadow-[0_10px_30px_rgba(74,29,29,0.06)]">
            <h2 className="text-xl font-bold text-[#260909]">Account Settings</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Link href={ROUTES.profile} className="flex items-center justify-between rounded-lg bg-[#FFF7F7] p-4 text-sm font-semibold text-[#260909] no-underline transition hover:bg-[#FFECEC]">
                <span>Edit Profile</span>
                <span aria-hidden="true">›</span>
              </Link>
              <Link href={ROUTES.password} className="flex items-center justify-between rounded-lg bg-[#FFF7F7] p-4 text-sm font-semibold text-[#260909] no-underline transition hover:bg-[#FFECEC]">
                <span>Password</span>
                <span aria-hidden="true">›</span>
              </Link>
              <button className="flex items-center justify-between rounded-lg bg-[#FFF7F7] p-4 text-left text-sm font-semibold text-[#260909] transition hover:bg-[#FFECEC]">
                <span>Notifications</span>
                <span aria-hidden="true">›</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
