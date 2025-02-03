export default function StandingsLoadingPage() {
	return (
		<div className='container max-w-4xl py-8 space-y-8'>
			{/* Header Skeleton */}
			<div className='flex items-center gap-3 mb-8'>
				<div className='w-8 h-8 rounded-full bg-primary/10 animate-pulse' />
				<div className='h-8 w-32 bg-primary/10 rounded-lg animate-pulse' />
			</div>

			{/* Tabs Skeleton */}
			<div className='h-10 w-full bg-primary/10 rounded-lg animate-pulse mb-8' />

			{/* Content Skeleton */}
			<div className='space-y-4'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className='bg-card/50 backdrop-blur-sm p-4 rounded-lg border border-primary/10 flex items-center gap-4'
					>
						<div className='w-8 h-8 bg-primary/10 rounded-full animate-pulse' />
						<div className='flex-1 space-y-2'>
							<div className='h-4 w-32 bg-primary/10 rounded animate-pulse' />
							<div className='h-3 w-48 bg-primary/10 rounded animate-pulse' />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
