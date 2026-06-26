import StatusScreen, { Spinner } from "./_components/StatusScreen";

export default function Loading() {
  return (
    <StatusScreen title="Loading admin" description="Preparing the admin workspace.">
      <Spinner className="h-6 w-6" />
    </StatusScreen>
  );
}
