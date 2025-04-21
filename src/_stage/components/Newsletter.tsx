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
    border border-foreground w-full my-5
    bg-background hover:bg-background/90
    transition-all duration-200
    hover:scale-[1.015] hover:shadow-lg
    p-5 sm:p-6
    flex flex-col gap-2 items-start
  `;

	return (
		<div id="newsletter-cta" className={cn(baseContainer, className)}>
			<h3 className="font-title text-lg sm:text-xl uppercase mb-2 leading-none tracking-wide group-hover:translate-x-1 transition-transform duration-150">
				{title}
			</h3>
			{description && <p className="text-sm text-foreground/80 leading-snug mb-2">{description}</p>}
			<form
				className="flex flex-col sm:flex-row gap-2 w-full"
				action="/newsletter/subscribe"
				method="POST"
				// @ts-ignore
				hx-post="/newsletter/subscribe"
				hx-target="#newsletter-cta"
				hx-swap="outerHTML"
			>
				<Input
					type="email"
					name="email"
					placeholder="Enter your email"
					required
				/>
				<Button variant="brutalist" size="input" type="submit">
					Subscribe
				</Button>
			</form>
		</div>
	);

}
