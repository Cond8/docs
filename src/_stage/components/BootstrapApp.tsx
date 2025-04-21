import { JSX } from 'preact';
import { cn } from '../utils/clsx.js';
import { Button } from './ui/button.js';
import { Input } from './ui/input.js';

export interface BootstrapAppProps {
	title: string;
	description?: string;
	className?: string;
	externalUrl: string; // The base external URL to redirect to
	paramName?: string; // The query param name for the input, defaults to 'email'
}

export function BootstrapApp({ title, description, className, externalUrl, paramName = 'email' }: BootstrapAppProps): JSX.Element {
	const baseContainer = `
    my-6
    transition-all duration-200
    hover:scale-[1.015] hover:shadow-lg
    flex flex-col gap-2 items-start
  `;

	function handleSubmit(e: JSX.TargetedEvent<HTMLFormElement, Event>) {
		e.preventDefault();
		const form = e.currentTarget;
		const input = form.elements.namedItem('external-input') as HTMLInputElement;
		if (input && input.value) {
			const url = new URL(externalUrl);
			url.searchParams.set(paramName, input.value);
			window.open(url.toString(), '_blank');
		}
	}

	return (
		<div className={cn(baseContainer, className)}>
			<div id="external-newsletter-cta" className="w-full">
				{description && <p className="text-sm text-foreground/80 leading-snug mb-2">{description}</p>}
				<form className="flex flex-col sm:flex-row gap-2 w-full" onSubmit={handleSubmit}>
					<Input type="email" name="external-input" placeholder={title} required className="peer" />
					<Button variant="brutalist" size="input" type="submit" className="peer-invalid:pointer-events-none peer-invalid:opacity-30">
						Generate Workflow
					</Button>
				</form>
			</div>
		</div>
	);
}
