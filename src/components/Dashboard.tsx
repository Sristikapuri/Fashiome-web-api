import { getUserData, clearAuthCookies } from "@/lib/cookies";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getUserData();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF7F4]">
      <h1 className="mb-4 text-4xl font-bold text-[#4A1D1F]">Hello, {user.firstName}</h1>
      <form action={async () => {
        "use server";
        await clearAuthCookies();
        redirect("/login");
      }}>
        <button
          type="submit"
          className="rounded-lg bg-[#4A1D1F] px-6 py-2 text-white hover:bg-[#6B3030]"
        >
          Logout
        </button>
      </form>
    </div>
  );
}