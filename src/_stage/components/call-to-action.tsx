// src/_stage/components/cta.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { JSX } from 'preact';
import { cn } from '../utils/clsx.js';

const ctaVariants = cva('p-4 rounded-xl border shadow-md', {
	variants: {
		variant: {
			primary: 'bg-primary text-primary-foreground border-primary-border',
			secondary: 'bg-secondary text-secondary-foreground border-secondary-border',
			destructive: 'bg-danger text-danger-foreground border-danger-border',
		},
	},
	defaultVariants: {
		variant: 'primary',
	},
});

interface CTAProps extends VariantProps<typeof ctaVariants> {
	title: string;
	description?: string;
	action: {
		label: string;
		onClick?: () => void;
		href?: string;
	};
	icon?: JSX.Element;
	className?: string;
}

export function CTA({ title, description, action, variant, icon, className }: CTAProps) {
	const Button = () =>
		action.href ? (
			<a href={action.href} className="inline-block mt-3 px-4 py-2 rounded font-medium bg-white text-black hover:underline">
				{action.label}
			</a>
		) : (
			<button type="button" onClick={action.onClick} className="mt-3 px-4 py-2 rounded font-medium bg-white text-black hover:underline">
				{action.label}
			</button>
		);

	return (
		<div className={cn(ctaVariants({ variant }), className)}>
			<div className="flex items-start gap-3">
				{icon && <div className="text-xl">{icon}</div>}
				<div>
					<h3 className="text-lg font-semibold">{title}</h3>
					{description && <p className="text-sm mt-1">{description}</p>}
					<Button />
				</div>
			</div>
		</div>
	);
}
