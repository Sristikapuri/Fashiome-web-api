import { getUserData, clearAuthCookies } from "@/lib/cookies";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getUserData();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex flex-col">
      {/* Header */}
      <header className="bg-white px-8 py-5 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold text-[#9498C1]">
            FashioMe
          </h1>

          <div className="text-[#9498C1]">⚙️</div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="flex-1 bg-[#FAF7F4] px-6 py-10">
        <div className="mx-auto max-w-5xl">
          {/* Profile */}
          <div className="mb-8 flex items-center gap-4">
            <div className="h-20 w-20 rounded-full border-4 border-[#D4AF37] bg-white overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300"
                alt="profile"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#9498C1]">
                {user.firstName}
              </h2>

              <p className="text-sm text-[#6B5B4B]">
                {user.email || "user@example.com"}
              </p>

              <div className="mt-2 flex gap-2">
                <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-xs text-white">
                  Pro Member
                </span>

                <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-xs text-white">
                  Style Trendsetter
                </span>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Biometrics */}
            <div className="rounded-xl bg-white p-5 shadow-[0_4px_20px_rgba(74,29,29,0.06)]">
              <h3 className="mb-4 font-semibold text-[#9498C1]">
                My Biometrics
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between rounded-md bg-[#F3F4F6] p-3">
                  <span>Height</span>
                  <span>165 cm</span>
                </div>

                <div className="flex justify-between rounded-md bg-[#F3F4F6] p-3">
                  <span>Weight</span>
                  <span>58 kg</span>
                </div>

                <div className="flex justify-between rounded-md bg-[#F3F4F6] p-3">
                  <span>Skin Tone</span>
                  <span>Honey Warm</span>
                </div>

                <button className="mt-4 w-full rounded-full border border-[#D4AF37] py-2 text-sm text-[#D4AF37]">
                  Update Measurements
                </button>
              </div>
            </div>

            {/* Style Preferences */}
            <div className="rounded-xl bg-white p-5 shadow-[0_4px_20px_rgba(74,29,29,0.06)]">
              <h3 className="mb-4 font-semibold text-[#9498C1]">
                Style Preferences
              </h3>

              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#9498C1] px-3 py-1 text-xs text-white">
                  Modern Fusion
                </span>

                <span className="rounded-full bg-[#9498C1] px-3 py-1 text-xs text-white">
                  South Asian Traditional
                </span>

                <span className="rounded-full bg-[#9498C1] px-3 py-1 text-xs text-white">
                  Minimalist Luxury
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-[#F3F4F6] p-3">Office</div>
                <div className="rounded-md bg-[#F3F4F6] p-3">Wedding</div>
                <div className="rounded-md bg-[#F3F4F6] p-3">
                  Evening Dinner
                </div>
                <div className="rounded-md bg-[#F3F4F6] p-3">
                  Casual Weekend
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="mt-6 rounded-xl bg-white p-5 shadow-[0_4px_20px_rgba(74,29,29,0.06)]">
            <h3 className="mb-4 font-semibold text-[#9498C1]">
              Account Settings
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <button className="flex items-center justify-between rounded-lg bg-[#F3F4F6] p-4">
                <span>Edit Profile</span>
                <span>›</span>
              </button>

              <button className="flex items-center justify-between rounded-lg bg-[#F3F4F6] p-4">
                <span>Notification Settings</span>
                <span>›</span>
              </button>

              <button className="flex items-center justify-between rounded-lg bg-[#F3F4F6] p-4">
                <span>Privacy</span>
                <span>›</span>
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-10 flex justify-center">
            <form
              action={async () => {
                "use server";
                await clearAuthCookies();
                redirect("/login");
              }}
            >
              <button
                type="submit"
                className="rounded-full bg-[#9498C1] px-8 py-3 text-white transition hover:bg-[#7f83ad]"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#ebe6e2] bg-[#FAF7F4] px-8 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-[#6B5B4B]">
          <span>FashioMe</span>

          <div className="flex gap-6">
            <a href="#" className="text-[#6B5B4B] no-underline hover:text-[#D4AF37]">About</a>
            <a href="#" className="text-[#6B5B4B] no-underline hover:text-[#D4AF37]">Style Guide</a>
            <a href="#" className="text-[#6B5B4B] no-underline hover:text-[#D4AF37]">Terms</a>
            <a href="#" className="text-[#6B5B4B] no-underline hover:text-[#D4AF37]">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}