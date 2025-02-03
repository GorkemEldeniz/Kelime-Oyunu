"use client";

import { DEMO_WORDS } from "@/constants";
import { motion } from "framer-motion";

function AnimatedWord({
	word,
	mean,
	index,
}: {
	word: string;
	mean: string;
	index: number;
}) {
	return (
		<motion.div
			className='p-4 rounded-md bg-muted'
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5, delay: 0.6 + index * 0.2 }}
			whileHover={{ x: 5 }}
		>
			<div className='font-mono text-xl tracking-wider mb-2'>
				{word.split("").map((letter, i) => (
					<motion.span
						key={i}
						className='inline-block mx-1'
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.8 + index * 0.2 + i * 0.1 }}
						whileHover={{ scale: 1.2, color: "var(--primary)" }}
					>
						{letter}
					</motion.span>
				))}
			</div>
			<p className='text-sm text-muted-foreground'>{mean}</p>
		</motion.div>
	);
}

export function DemoSection() {
	return (
		<motion.div
			className='w-full max-w-md p-6 rounded-lg border bg-card text-card-foreground shadow-sm my-8'
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5, delay: 0.4 }}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
		>
			<div className='space-y-4'>
				{DEMO_WORDS.map((item, index) => (
					<AnimatedWord key={item.word} {...item} index={index} />
				))}
			</div>
		</motion.div>
	);
}
