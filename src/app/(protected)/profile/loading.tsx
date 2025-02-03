export default function Loading() {
	return (
		<div className='container max-w-4xl py-8 space-y-8'>
			{/* Header Skeleton */}
			<div className='flex items-center gap-3 mb-8'>
				<div className='w-8 h-8 rounded-full bg-primary/10 animate-pulse' />
				<div className='h-8 w-32 bg-primary/10 rounded-lg animate-pulse' />
			</div>

			{/* Stats Overview Skeleton */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className='p-4 bg-card/50 backdrop-blur-sm rounded-lg border animate-pulse'
					>
						<div className='h-4 w-24 bg-primary/10 rounded mb-2' />
						<div className='h-6 w-16 bg-primary/10 rounded' />
					</div>
				))}
			</div>

			{/* Game History Skeleton */}
			<div className='space-y-6'>
				<div className='flex items-center gap-2'>
					<div className='w-5 h-5 rounded bg-primary/10 animate-pulse' />
					<div className='h-6 w-32 bg-primary/10 rounded animate-pulse' />
				</div>

				<div className='space-y-4'>
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className='p-4 bg-card/50 backdrop-blur-sm rounded-lg border animate-pulse'
						>
							<div className='flex justify-between items-start'>
								<div className='space-y-2'>
									<div className='h-5 w-24 bg-primary/10 rounded' />
									<div className='h-4 w-48 bg-primary/10 rounded' />
								</div>
								<div className='h-4 w-24 bg-primary/10 rounded' />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
