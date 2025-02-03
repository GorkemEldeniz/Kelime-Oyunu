import { CTAButtons } from "@/components/home/cta-buttons";
import { DemoSection } from "@/components/home/demo-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { HowToPlaySection } from "@/components/home/how-to-play-section";
import { cookies } from "next/headers";

export default async function Home() {
	// Get auth status from cookie on server side
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get("refresh_token");
	const isAuthenticated = !!refreshToken?.value;

	return (
		<div className='min-h-screen flex flex-col'>
			<main className='flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center gap-8'>
				<HeroSection />
				<DemoSection />
				<CTAButtons isAuthenticated={isAuthenticated} />
				<HowToPlaySection />
				<FeaturesSection />
			</main>
		</div>
	);
}
