// src/_stage/components/error/error-hero.tsx
export function ErrorHero({ error }: { error: Error }) {
	const name = error.name || 'Error';
	const message = error.message || 'An unknown error occurred';
	const stack = error.stack?.split('\n').slice(0, 10).join('\n');

	return (
		<section className="flex flex-col justify-between p-6 bg-black text-white border-b border-red-600">
			{/* Error Title and Message */}
			<div>
				<h1
					className="
						text-[clamp(2.5rem,8vw,6rem)]
						font-logo tracking-tight leading-none
						text-red-600
						[text-shadow:3px_3px_0_black]
						mb-4
					"
				>
					{name}
				</h1>

				<p
					className="
						text-lg lg:text-2xl font-subtitle tracking-wider
						text-gray-300
						bg-black/70 p-4 rounded border border-gray-700
						shadow-inner
						mb-6
					"
				>
					{message}
				</p>

				{/* Stack Trace */}
				{stack && (
					<div
						className="
							bg-gray-900
							text-gray-400
							text-xs font-mono
							p-4 rounded
							border-l-[6px] border-red-500
							max-h-60 overflow-auto whitespace-pre-wrap
							shadow-lg
						"
					>
						<pre>{stack}</pre>
					</div>
				)}
			</div>
		</section>
	);
}
