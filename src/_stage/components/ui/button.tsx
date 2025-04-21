// src/_stage/components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cn } from '../../utils/clsx';

const buttonVariants = cva(
	`
	  inline-flex items-center justify-center gap-2
	  whitespace-nowrap text-sm font-medium
	  transition-colors
	  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
	  disabled:pointer-events-none disabled:opacity-50
	  [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`,
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-sm',
				destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-sm',
				outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-sm',
				secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 rounded-sm',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
				brutalist: 'bg-foreground text-background shadow hover:bg-foreground/90',
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 px-3 text-xs rounded-md',
				lg: 'h-10 px-8 rounded-md',
				icon: 'h-9 w-9',
				input: 'h-11 px-4 py-2',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
	return <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
