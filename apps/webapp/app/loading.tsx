import PanelLoader from '@/components/panel-loader';

export default function Loading() {
  return (
    <div className="my-10 flex h-full w-full flex-col items-center justify-center">
      <div className="flex-1">
        <PanelLoader showBackground={false} />
      </div>
    </div>
  );
}
