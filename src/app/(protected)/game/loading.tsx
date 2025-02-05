import { Loader } from "lucide-react";

export default function GameLoading() {
	return (
		<div className='flex-1 flex items-center justify-center min-h-[50vh] bg-background/50 backdrop-blur-sm'>
			<div className='flex flex-col items-center gap-6 p-8 rounded-xl bg-card/30 shadow-lg animate-in fade-in duration-700'>
				<div className='relative'>
					<div className='absolute inset-0 animate-pulse bg-primary/20 rounded-full blur-xl'></div>
					<Loader className='h-16 w-16 animate-spin text-primary relative z-10' />
				</div>
				<div className='space-y-2 text-center'>
					<p className='text-xl font-semibold text-primary'>Oyun yükleniyor</p>
					<p className='text-sm text-muted-foreground animate-pulse'>
						Lütfen bekleyin...
					</p>
				</div>
			</div>
		</div>
	);
}
