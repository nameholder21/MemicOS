import { redirect } from 'next/navigation';

const DEFAULT_GRAPH_MODEL_ID = 'gemma-2-2b';

export default function GraphPage() {
  redirect(`/${DEFAULT_GRAPH_MODEL_ID}/graph`);
}
