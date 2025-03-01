import { LoadingSquare } from './svg/loading-square';

export default function PanelLoader({
  className = '',
  style = {},
  showBackground = true,
}: {
  className?: string;
  style?: React.CSSProperties;
  showBackground?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${
        showBackground ? 'rounded-xl border border-slate-200 bg-white shadow-md' : ''
      } px-6 py-3 ${className}`}
      style={style}
    >
      <div className="mb-1 flex h-24 w-24 items-center justify-center px-0 font-bold text-slate-300">
        <LoadingSquare size={48} className="text-sky-700" />
      </div>
    </div>
  );
}
