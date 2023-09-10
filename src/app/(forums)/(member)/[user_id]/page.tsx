import { notFound } from "next/navigation";

export default function Page({ params }: { params: { user_id: string } }) {
	if (!decodeURIComponent(params?.user_id)?.startsWith("@")) notFound();
	return <div>My Post: {params.user_id}</div>;
}
