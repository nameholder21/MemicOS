import UmapProvider from "@/components/provider/umap-provider";
import List from "./list";

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <UmapProvider>
      <List listId={params.id} />
    </UmapProvider>
  );
}
