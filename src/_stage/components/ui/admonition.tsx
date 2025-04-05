// src/_stage/components/admonition.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { JSX } from 'preact';
import { cn } from '../../utils/clsx.js';

const admonition = cva('my-4 p-4 rounded border-l-4', {
	variants: {
		type: {
			info: 'bg-note text-note-foreground border-note-border',
			caution: 'bg-caution text-caution-foreground border-caution-border',
			tip: 'bg-tip text-tip-foreground border-tip-border',
			danger: 'bg-danger text-danger-foreground border-danger-border',
		},
	},
	defaultVariants: {
		type: 'info',
	},
});

interface AdmonitionProps extends VariantProps<typeof admonition> {
	title?: string;
	children: JSX.Element;
	className?: string;
}

export function Admonition({ type, title, children, className }: AdmonitionProps) {
	const defaultTitle = {
		info: 'Info',
		caution: 'Caution',
		tip: 'Tip',
		danger: 'Danger',
	}[type ?? 'info'];

	return (
		<div className={cn(admonition({ type }), className)}>
			<strong className="block mb-2">{title ?? defaultTitle}:</strong>
			<div className="text-sm">{children}</div>
		</div>
	);
}
