"use client";

import { IconSvg } from "@/components/shared/icons";
import { FEATURES } from "@/constants";
import { motion } from "framer-motion";

export function FeaturesSection() {
	return (
		<motion.div
			className='grid md:grid-cols-3 gap-8 mt-16 w-full max-w-4xl'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 1.8 }}
		>
			{FEATURES.map((feature) => (
				<div
					key={feature.title}
					className='flex flex-col items-center p-4 text-center'
				>
					<div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
						<IconSvg path={feature.icon} />
					</div>
					<h3 className='text-lg font-semibold mb-2'>{feature.title}</h3>
					<p className='text-muted-foreground'>{feature.description}</p>
				</div>
			))}
		</motion.div>
	);
}
