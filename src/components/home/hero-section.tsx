"use client";

import { motion } from "framer-motion";

export function HeroSection() {
	return (
		<>
			<motion.h1
				className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				Kelime Oyunu
			</motion.h1>

			<motion.p
				className='text-xl text-muted-foreground max-w-2xl'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				Türkçe kelime haznenizi geliştirin, kelimeleri tahmin edin ve eğlenceli
				bir öğrenme deneyimi yaşayın.
			</motion.p>
		</>
	);
}
