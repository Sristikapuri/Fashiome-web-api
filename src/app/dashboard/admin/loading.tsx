import StatusScreen, { Spinner } from "./_components/StatusScreen";

export default function Loading() {
  return (
    <StatusScreen
      title="Loading admin dashboard"
      description="Preparing the user management tools and admin workspace."
    >
      <Spinner className="h-6 w-6" />
    </StatusScreen>
  );
}
