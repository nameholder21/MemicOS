import ManualDashboard from './manual-dashboard';

// mostly an internal tool for testing to see if dashboards were generated correctly. may remove in the future.

export default async function Page() {
  return (
    <div className="h-[calc(100vh-110px)] w-full pt-0 sm:h-auto sm:px-2">
      <ManualDashboard />
    </div>
  );
}
