export function ErrorHero({ error }: { error: Error }) {
	const name = error.name || 'Error';
	const message = error.message || 'An unknown error occurred';
	const stack = error.stack?.split('\n').slice(0, 10).join('\n');

	return (
		<section className="h-[70vh] flex flex-col justify-between bg-[var(--background)] text-[var(--primary)] p-6">
			<div>
				<h1 className="text-4xl font-black text-[var(--accent)] mb-4">{name}</h1>
				<p className="text-lg text-[var(--secondary)] mb-6 line-clamp-4">{message}</p>

				{stack && (
					<div className="bg-[var(--popover)] text-[var(--muted-foreground)] text-xs font-mono p-4 rounded border-l-4 border-[var(--danger-border)] max-h-40 overflow-auto whitespace-pre-wrap">
						<pre>{stack}</pre>
					</div>
				)}
			</div>

			<div className="text-center animate-bounce text-[var(--muted-foreground)] text-xs mt-6">
				<span className="opacity-70">▼ Scroll for details ▼</span>
			</div>
		</section>
	);
}
