import SearchInferenceReleasePane from '@/components/panes/search-inference-release-pane';

export default async function Page() {
  return (
    <div className="flex w-full max-w-screen-lg flex-col items-center pt-5">
      <SearchInferenceReleasePane />
    </div>
  );
}
