// src/_stage/components/cta.tsx
import { cn } from '../utils/clsx.js';
import { Button } from './ui/button';

interface CTAProps {
	title: string;
	description: string;
	action: {
		label: string;
		onClick?: () => void;
	};
	className?: string;
}

export function CTA({ title, description, action, className }: CTAProps) {
	const baseContainer = 'border w-full bg-muted text-muted-foreground p-4';

	return (
		<div className={cn(baseContainer, className)}>
			<h3 className="font-title text-xl sm:text-2xl">{title}</h3>
			<p className="text-paragraph font-light text-foreground/90">{description}</p>
			<Button onClick={action.onClick}>{action.label}</Button>
		</div>
	);
}
