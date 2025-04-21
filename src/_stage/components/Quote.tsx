// src/_stage/components/Quote.tsx
import { JSX } from 'preact';
import { cn } from '../utils/clsx.js';

export interface QuoteProps {
  children: preact.ComponentChildren;
  author?: string;
  className?: string;
}

export function Quote({ children, author, className }: QuoteProps): JSX.Element {
  return (
    <blockquote
      className={cn(
        'relative border-l-8 border-accent bg-muted/40 rounded-xl p-6 my-8 text-lg font-medium text-muted-foreground shadow-sm',
        'before:content-["❝"] before:absolute before:-left-4 before:top-2 before:text-4xl before:text-accent',
        className
      )}
    >
      <div className="pl-2">{children}</div>
      {author && (
        <footer className="mt-4 text-right text-base italic text-accent">— {author}</footer>
      )}
    </blockquote>
  );
}
