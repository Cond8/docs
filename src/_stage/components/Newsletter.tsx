// src/_stage/components/Newsletter.tsx
import { JSX } from 'preact';
import { cn } from '../utils/clsx.js';
import { Button } from './ui/button';
import { Input } from './ui/input';

export interface NewsletterProps {
	title: string;
	description?: string;
	className?: string;
}

export function Newsletter({ title, description, className }: NewsletterProps): JSX.Element {
	const baseContainer = `
    my-6
    transition-all duration-200
    hover:scale-[1.015] hover:shadow-lg
    flex flex-col gap-2 items-start
  `;

	return (
		<div className={cn(baseContainer, className)}>
			<div id="newsletter-cta" className="w-full">
				{description && <p className="text-sm text-foreground/80 leading-snug mb-2">{description}</p>}
				<form
					className="flex flex-col sm:flex-row gap-2 w-full"
					hx-post="/newsletter/subscribe"
					hx-target="#newsletter-cta"
					hx-swap="outerHTML"
				>
					<Input type="email" name="email" placeholder={title} required className="peer" />
					<Button variant="brutalist" size="input" type="submit" className="peer-invalid:pointer-events-none peer-invalid:opacity-30">
						Subscribe
					</Button>
				</form>
			</div>
		</div>
	);
}
