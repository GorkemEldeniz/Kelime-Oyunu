import { Footer } from "@/components/shared/footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/context/theme-provider";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export const metadata: Metadata = {
	title: "Kelime Oyunu",
	description:
		"Kelime Oyunu Web Uygulaması - Türkçe kelime bilginizi test edin ve geliştirin. Online kelime oyunu ile eğlenceli bir öğrenme deneyimi yaşayın.",
	keywords: [
		"kelime oyunu",
		"türkçe kelime oyunu",
		"online kelime oyunu",
		"kelime bilgisi",
		"türkçe öğrenme",
		"eğitici oyun",
	],
	authors: [{ name: "Kelime Oyunu" }],
	creator: "Kelime Oyunu",
	publisher: "Kelime Oyunu",
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
	},
	openGraph: {
		type: "website",
		locale: "tr_TR",
		url: "https://kelime-oyunu.vercel.app",
		title: "Kelime Oyunu",
		description:
			"Kelime Oyunu Web Uygulaması - Türkçe kelime bilginizi test edin ve geliştirin.",
		siteName: "Kelime Oyunu",
	},
	twitter: {
		card: "summary_large_image",
		title: "Kelime Oyunu",
		description:
			"Kelime Oyunu Web Uygulaması - Türkçe kelime bilginizi test edin ve geliştirin.",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='tr' suppressHydrationWarning>
			<head>
				<link rel='icon' href='/favicon.ico' sizes='any' />
				<link rel='icon' href='/favicon.svg' type='image/svg+xml' />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
			>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Footer />
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
