// src/_stage/components/topbar.tsx
import { cn } from '../utils/clsx.js';
import { TopbarLinks } from './topbar-links.js';

export interface TopbarProps {
	landingPage?: boolean;
	urlSelected?: string;
	sponsorPage?: boolean;
}

export const Topbar = ({ landingPage, urlSelected, sponsorPage }: TopbarProps) => (
	<header className="w-full border-b border-foreground bg-background/80">
		<div
			className={cn(
				landingPage || sponsorPage ? 'max-w-[800px]' : 'max-w-[1024px]',
				'mw-full mx-auto py-4 flex flex-col md:flex-row justify-between items-center',
			)}
		>
			{landingPage || sponsorPage ? (
				<div
					className={cn('h-1 w-16 mb-4 md:mb-0', sponsorPage ? 'bg-emerald-600' : 'bg-red-600')}
					style={{
						boxShadow: '3px 5px 0 black',
						transform: 'rotate(-0.2deg)',
					}}
					role="presentation"
					aria-hidden="true"
				/>
			) : (
				<a
					href="/"
					className="text-3xl font-logo text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
				>
					Cond8
				</a>
			)}

			<TopbarLinks urlSelected={urlSelected} />
		</div>
	</header>
);
