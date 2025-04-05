// src/_stage/components/copy-button.tsx
import { Button } from './ui/button';

export interface CopyButtonProps {
	children: string;
	copyData: string;
}

export const CopyButton = ({ children, copyData }: CopyButtonProps) => (
	<Button
		data-copy={copyData}
		className="text-xs uppercase font-bold tracking-wide px-3 py-1 rounded bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition"
	>
		{children}
	</Button>
);
