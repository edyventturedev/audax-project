import { LutEditor } from "@/components/app/LutEditor";

export const metadata = { title: "Editar LUT — Admin" };

export default async function AdminEditLutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LutEditor id={id} />;
}
