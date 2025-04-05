// src/_stage/components/copy-button.tsx
export interface CopyButtonProps {
	children: string;
	copyData: string;
}

export const CopyButton = ({ children, copyData }: CopyButtonProps) => (
	<button
		data-copy={copyData}
		className="text-xs uppercase font-bold tracking-wide px-3 py-1 rounded bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition"
	>
		{children}
	</button>
);
