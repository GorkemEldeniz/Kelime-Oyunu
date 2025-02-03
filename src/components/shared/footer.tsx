import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
	const socialLinks = [
		{
			name: "Twitter",
			href: "https://x.com/eldeniz_gorkem",
			icon: Twitter,
		},
		{
			name: "GitHub",
			href: "https://github.com/GorkemEldeniz",
			icon: Github,
		},
		{
			name: "LinkedIn",
			href: "https://www.linkedin.com/in/g%C3%B6rkem-eldeniz-017886218/",
			icon: Linkedin,
		},
	];

	return (
		<footer className='border-t'>
			<div className='container mx-auto px-4 py-6'>
				<div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
					<div className='flex items-center gap-6'>
						{socialLinks.map((link) => (
							<Link
								key={link.name}
								href={link.href}
								className='text-muted-foreground hover:text-primary transition-colors'
								target='_blank'
								rel='noopener noreferrer'
								aria-label={link.name}
							>
								<link.icon className='h-5 w-5' strokeWidth={1.5} />
							</Link>
						))}
					</div>

					<p className='text-sm text-muted-foreground order-first sm:order-last'>
						Kelime Oyunu © {new Date().getFullYear()} Tüm hakları saklıdır.
					</p>
				</div>
			</div>
		</footer>
	);
}
