import { Loader } from "lucide-react";

export default function GameLoading() {
	return (
		<div className='flex-1 flex items-center justify-center min-h-[60vh]'>
			<div className='relative flex flex-col items-center gap-6 animate-in fade-in duration-1000'>
				{/* Minimal glow effect */}
				<div className='absolute inset-0 -z-10 bg-primary/5 blur-[100px] rounded-full scale-150' />

				{/* Loader */}
				<div className='relative'>
					<Loader
						className='h-12 w-12 animate-spin text-primary/80'
						strokeWidth={1.5}
					/>
				</div>

				<div className='space-y-2 text-center'>
					<p className='text-base font-medium text-primary/80'>Yükleniyor</p>
					<p className='text-sm text-muted-foreground/60'>Lütfen bekleyin</p>
				</div>
			</div>
		</div>
	);
}
