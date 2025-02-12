"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
	totalPages: number;
	currentPage: number;
	baseUrl: string;
}

export function Pagination({
	totalPages,
	currentPage,
	baseUrl,
}: PaginationProps) {
	const searchParams = useSearchParams();

	const createPageUrl = (page: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", page.toString());
		return `${baseUrl}?${params.toString()}`;
	};

	if (totalPages <= 1) return null;

	return (
		<div className='flex justify-center gap-2 mt-8'>
			<Button variant='outline' asChild disabled={currentPage === 1}>
				<Link href={createPageUrl(currentPage - 1)}>Önceki</Link>
			</Button>

			<div className='flex items-center gap-2'>
				{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
					<Button
						key={page}
						variant={currentPage === page ? "default" : "outline"}
						asChild
					>
						<Link href={createPageUrl(page)}>{page}</Link>
					</Button>
				))}
			</div>

			<Button variant='outline' asChild disabled={currentPage === totalPages}>
				<Link href={createPageUrl(currentPage + 1)}>Sonraki</Link>
			</Button>
		</div>
	);
}
