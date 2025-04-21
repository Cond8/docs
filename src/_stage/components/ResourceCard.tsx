// src/_stage/components/ResourceCard.tsx
import { JSX } from 'preact';
import { cn } from '../utils/clsx.js';

export interface ResourceCardProps {
  href: string;
  title: string;
  description: string;
  icon?: string | JSX.Element;
  className?: string;
}

export function ResourceCard({ href, title, description, icon, className }: ResourceCardProps): JSX.Element {
  return (
    <a
      href={href}
      className={cn(
        'block border border-muted rounded-xl p-4 my-6 transition-shadow hover:shadow-lg bg-muted/40 hover:bg-muted/60',
        'no-underline',
        className
      )}
      style={{ textDecoration: 'none' }}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <span className="text-3xl" aria-hidden="true">{icon}</span>
        )}
        <div>
          <div className="font-bold text-lg text-accent hover:underline">{title}</div>
          <div className="text-muted-foreground text-base mt-1">{description}</div>
        </div>
      </div>
    </a>
  );
}
