// src/_stage/components/CTA.tsx
import { JSX } from 'preact';
import { cn } from '../utils/clsx.js';
import { Button } from './ui/button';

export interface CTAProps {
	title: string;
	description?: string;
	action?: {
		label: string;
		href?: string;
		onClick?: () => void;
	};
	className?: string;
}


export function CTA({ title, description, action, className }: CTAProps): JSX.Element {
	const baseContainer = `
    border border-foreground w-full my-5
    bg-background hover:bg-background/90
    transition-all duration-200
    hover:scale-[1.015] hover:shadow-lg
    p-5 sm:p-6
    flex flex-col gap-2 items-start
  `;

	return (
		<div className={cn(baseContainer, className)}>
			<h3 className="font-title text-lg sm:text-xl uppercase mb-2 tracking-wide group-hover:translate-x-1 transition-transform duration-150">
				{title}
			</h3>
			<p className="text-sm text-foreground/80 leading-snug mb-2">{description}</p>
			{action && action.href ? (
				<a href={action.href}>
					<Button>{action.label}</Button>
				</a>
			) : action ? (
				<Button onClick={action.onClick}>{action.label}</Button>
			) : null}
		</div>
	);
}
