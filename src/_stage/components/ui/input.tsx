// src/_stage/components/ui/input.tsx
import { JSX } from 'preact';
import { cn } from '../../utils/clsx.js';

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'border border-foreground rounded px-3 py-2 flex-1 bg-primary-foreground text-primary focus:outline-none focus:ring-2 focus:ring-primary',
        className
      )}
      {...props}
    />
  );
}
