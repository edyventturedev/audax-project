import { BlogEditor } from "@/components/app/BlogEditor";

export const metadata = { title: "Editar artículo — Admin" };

export default async function AdminEditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BlogEditor id={id} />;
}
