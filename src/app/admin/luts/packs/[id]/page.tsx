import { PackEditor } from "@/components/app/PackEditor";

export const metadata = { title: "Editar paquete — Admin" };

export default async function AdminEditPackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PackEditor id={id} />;
}
