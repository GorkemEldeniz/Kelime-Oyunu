"use client";

import { IconSvg } from "@/components/shared/icons";
import { HOW_TO_PLAY_STEPS } from "@/constants";
import { motion } from "framer-motion";

export function HowToPlaySection() {
	return (
		<motion.section
			className='w-full max-w-4xl mt-16'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 1.4 }}
		>
			<h2 className='text-3xl font-bold mb-8'>Nasıl Oynanır?</h2>
			<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
				{HOW_TO_PLAY_STEPS.map((step, index) => (
					<motion.div
						key={step.title}
						className='p-6 rounded-lg border bg-card'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
						whileHover={{ y: -5 }}
					>
						<div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto'>
							<IconSvg path={step.icon} />
						</div>
						<h3 className='text-lg font-semibold mb-2'>{step.title}</h3>
						<p className='text-sm text-muted-foreground'>{step.description}</p>
					</motion.div>
				))}
			</div>
		</motion.section>
	);
}
