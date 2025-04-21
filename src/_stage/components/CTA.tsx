// src/_stage/components/CTA.tsx
import { JSX } from 'preact';
import { cn } from '../utils/clsx.js';
import { Button } from './ui/button';

export interface CTAProps {
	title: string;
	description: string;
	action: {
		label: string;
		href?: string;
		onClick?: () => void;
	};
	className?: string;
}

export function CTA({ title, description, action, className }: CTAProps): JSX.Element {
	const baseContainer = 'border w-full mt-4 bg-muted text-muted-foreground p-4 rounded-xl flex flex-col gap-4 items-start';

	return (
		<div className={cn(baseContainer, className)}>
			<h3 className="font-title text-xl sm:text-2xl">{title}</h3>
			<p className="text-paragraph font-light text-foreground/90">{description}</p>
			{action.href ? (
				<a href={action.href}>
					<Button>{action.label}</Button>
				</a>
			) : (
				<Button onClick={action.onClick}>{action.label}</Button>
			)}
		</div>
	);
}
