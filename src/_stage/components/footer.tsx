// src/_stage/components/footer.tsx
export const Footer = () => (
	<footer className="w-full bg-background/80 border-t border-foreground mt-12 text-sm text-card-foreground">
		<div className="max-w-[800px] w-full mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between gap-4">
			<div className="flex flex-col gap-1">
				<span>© {new Date().getFullYear()} Cond8. All rights reserved.</span>
				<div className="flex gap-3">
					<a href="/privacy" className="hover:underline">
						Privacy
					</a>
					<a href="/terms" className="hover:underline">
						Terms
					</a>
					<a href="/legal" className="hover:underline">
						Legal
					</a>
				</div>
			</div>
			<div className="flex gap-4 items-center">
				<a href="https://github.com/cond8" target="_blank" className="hover:underline">
					GitHub
				</a>
				<a href="https://discord.gg/ca5yXrzcZz" target="_blank" className="hover:underline">
					Discord
				</a>
				<a href="/docs" className="hover:underline">
					Docs
				</a>
			</div>
		</div>
	</footer>
);
