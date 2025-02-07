"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className='min-h-[90vh] flex flex-col items-center justify-center gap-6 px-6 py-16'>
			<FileQuestion
				className='stroke-primary dark:stroke-primary-foreground w-32 h-32 text-muted-foreground'
				strokeWidth={1.5}
			/>
			<h1 className='text-3xl font-bold tracking-tight'>Sayfa Bulunamadı</h1>
			<p className='text-muted-foreground text-center max-w-[500px]'>
				Aradığınız sayfaya ulaşılamıyor. Sayfa kaldırılmış, adı değiştirilmiş
				veya geçici olarak kullanım dışı olabilir.
			</p>
			<Button asChild>
				<Link href='/' className='gap-2'>
					<ArrowLeft size={16} />
					Ana Sayfaya Dön
				</Link>
			</Button>
		</div>
	);
}
