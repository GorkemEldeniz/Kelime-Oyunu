import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	if (!session) redirect("/sign-in");

	return (
		<div className='min-h-screen flex flex-col'>
			<Header userEmail={session.user.email} />
			<main className='flex-1 container mx-auto px-4 py-8'>{children}</main>
			<Footer />
		</div>
	);
}
