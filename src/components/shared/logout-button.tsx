"use client";

import { signOut } from "@/action/auth";
import { LogOut } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

export function LogoutButton() {
	const router = useRouter();

	const { execute: executeSignOut, status } = useAction(signOut, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				// Clear any client-side state or caches here
				router.refresh(); // Force refresh to clear client state
				router.push("/sign-in");
				toast.success(data.data?.message);
			}
		},
		onError: ({ error }) => {
			if (error.serverError) {
				toast.error(error.serverError);
			} else {
				toast.error("Failed to sign out");
			}
		},
	});

	return (
		<Button
			variant='ghost'
			size='icon'
			onClick={() => executeSignOut({})}
			disabled={status === "executing"}
		>
			<LogOut className='h-5 w-5' />
		</Button>
	);
}
