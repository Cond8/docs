import { JSX } from 'preact';
import { cn } from '../../utils/clsx.js';

export interface TextAreaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <textarea
      className={cn(
        'border border-foreground px-3 py-2 flex-1 bg-primary-foreground text-primary focus:outline-none focus:ring-2 focus:ring-primary',
        className,
      )}
      {...props}
    />
  );
}
