import { redirect } from "next/navigation";
import { handleFindDuplicateUsers, handleFindTestFixtureUsers } from "@/lib/actions/admin/user-action";
import DuplicatesPanel from "./_components/DuplicatesPanel";

export default async function Page() {
  const [duplicatesResult, fixturesResult] = await Promise.all([
    handleFindDuplicateUsers(),
    handleFindTestFixtureUsers(),
  ]);

  for (const result of [duplicatesResult, fixturesResult]) {
    if (!result.success) {
      const msg = result.message?.toLowerCase() || "";
      if (msg.includes("unauthorized") || msg.includes("not found")) {
        redirect("/login?clear=true");
      }
      throw new Error(result.message || "Failed to load duplicate users");
    }
  }

  return (
    <DuplicatesPanel
      groups={duplicatesResult.groups ?? []}
      fixtureUsers={fixturesResult.users ?? []}
    />
  );
}
