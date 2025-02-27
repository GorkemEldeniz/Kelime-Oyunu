import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { db } from "@/lib/db";
import { verifyToken } from "@/services/auth/token-service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("access_token")?.value;

	if (!accessToken) {
		redirect("/sign-in");
	}

	const payload = await verifyToken(
		accessToken,
		process.env.JWT_ACCESS_SECRET!
	);

	if (!payload) {
		redirect("/sign-in");
	}

	const user = await db.user.findUnique({
		where: { id: payload.id as number },
		select: {
			email: true,
			username: true,
		},
	});

	if (!user) {
		redirect("/sign-in");
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<Header user={user} />
			<main className='flex-1 container mx-auto px-4 py-8'>{children}</main>
			<Footer />
		</div>
	);
}
