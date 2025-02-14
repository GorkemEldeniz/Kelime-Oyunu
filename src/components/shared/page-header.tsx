"use client";

import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

interface PageHeaderProps {
	title: string;
	icon: keyof typeof Icons;
}

export function PageHeader({ title, icon }: PageHeaderProps) {
	const IconComponent = Icons[icon] as React.ComponentType<LucideProps>;

	return (
		<div className='flex items-center gap-3 mb-8'>
			<IconComponent className='w-8 h-8 text-primary' />
			<h1 className='text-3xl font-bold'>{title}</h1>
		</div>
	);
}
