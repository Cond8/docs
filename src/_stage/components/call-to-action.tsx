// src/_stage/components/cta.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { JSX } from 'preact';
import { cn } from '../utils/clsx.js';

const ctaVariants = cva(
	// base landing-style classes
	'group h-full w-full flex flex-col justify-between border p-5 sm:p-6 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg',
	{
		variants: {
			variant: {
				primary: 'bg-primary text-primary-foreground border-primary-border hover:bg-primary/90',
				secondary: 'bg-secondary text-secondary-foreground border-secondary-border hover:bg-secondary/90',
				destructive: 'bg-destructive text-destructive-foreground border-destructive-border hover:bg-destructive/90',
				info: 'bg-note text-note-foreground border-note-border hover:bg-note/90',
				caution: 'bg-caution text-caution-foreground border-caution-border hover:bg-caution/90',
				tip: 'bg-tip text-tip-foreground border-tip-border hover:bg-tip/90',
				danger: 'bg-danger text-danger-foreground border-danger-border hover:bg-danger/90',
			},
		},
		defaultVariants: {
			variant: 'primary',
		},
	},
);

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

export function CTA({ title, description, action, icon, className, variant }: CTAProps) {
	const content = (
		<div className="flex flex-col justify-between h-full">
			<div className="flex items-start gap-3">
				{icon && <div className="text-xl">{icon}</div>}
				<div>
					<h3 className="font-title text-lg sm:text-xl uppercase mb-2 tracking-wide group-hover:translate-x-1 transition-transform duration-150">
						{title}
					</h3>
					{description && <p className="text-sm text-foreground/80 leading-snug">{description}</p>}
				</div>
			</div>
			{!action.href && (
				<button
					type="button"
					onClick={action.onClick}
					className="mt-3 inline-block px-4 py-2 rounded font-medium bg-white text-black hover:underline"
				>
					{action.label}
				</button>
			)}
		</div>
	);

	const containerClasses = cn(ctaVariants({ variant }), className);

	if (action.href) {
		return (
			<a href={action.href} className={containerClasses}>
				{content}
			</a>
		);
	}

	return <div className={containerClasses}>{content}</div>;
}
