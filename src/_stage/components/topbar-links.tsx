// src/_stage/components/topbar-links.tsx
import { cn } from '../utils/clsx.js';

const links = [
	{ url: 'https://app.cond8.dev', title: 'Browser App', rightSeparator: true },

	{ url: '/docs', title: 'Docs' },
	{ url: '/blogs', title: 'Blogs' },
];

export interface LinkProps {
	idx: number;
	isSelected?: boolean;
}

export const Link = ({ idx, isSelected }: LinkProps) => {
	const { url, title, rightSeparator } = links[idx];
	return (
		<>
			<a
				href={url}
				className={cn(
					isSelected ? 'underline' : 'hover:underline',
					'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground',
				)}
			>
				{title}
			</a>
			{rightSeparator ? <div className="hidden md:block h-4 w-[2px] bg-muted-foreground" aria-hidden="true" /> : null}
		</>
	);
};

export interface TopbarLinksProps {
	urlSelected?: string;
}

export const TopbarLinks = ({ urlSelected }: TopbarLinksProps) => (
	<nav className="flex flex-col md:flex-row items-center font-bold space-y-2 md:space-y-0 md:space-x-4" aria-label="Main navigation">
		{links.map(({ url }, index) => (
			<Link key={url} idx={index} isSelected={urlSelected === url} />
		))}
	</nav>
);
