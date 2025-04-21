// src/_stage/components/ResourceCard.tsx
import { ExternalLink } from 'lucide-preact';
import { JSX } from 'preact';
import { cn } from '../utils/clsx.js';

export interface ResourceCardProps {
	href: string;
	title: string;
	description: string;
	icon?: string | JSX.Element;
	className?: string;
}

export function ResourceCard({ href, title, description, icon, className }: ResourceCardProps): JSX.Element {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={cn(
				'block border border-muted rounded-xl p-4 my-6 transition-shadow hover:shadow-lg bg-muted/40 hover:bg-muted/60',
				'no-underline',
				className,
			)}
			style={{ textDecoration: 'none' }}
		>
			<div className="flex items-center gap-4">
				{icon && (
					<span className="text-3xl" aria-hidden="true">
						{icon}
					</span>
				)}
				<div className="flex-1 min-w-0">
					<div className="font-bold text-lg text-accent hover:underline truncate">{title}</div>
					<div className="text-muted-foreground text-base mt-1 truncate">{description}</div>
				</div>
				<span className="ml-2 text-muted-foreground opacity-80 group-hover:opacity-100" aria-label="Opens in new tab">
					<ExternalLink size={22} />
				</span>
			</div>
		</a>
	);
}
