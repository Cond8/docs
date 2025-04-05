// src/_stage/components/code-block.tsx
export function CodeBlock({ code, variant = 'default' }: { code: string; variant?: 'default' | 'error' }) {
	const borderClass = variant === 'error' ? 'border-red-600' : 'border-gray-700';

	return (
		<pre
			className={`bg-black text-gray-200 font-mono text-xs p-4 rounded border-l-4 ${borderClass} max-h-64 overflow-auto whitespace-pre-wrap`}
		>
			<code>{code}</code>
		</pre>
	);
}
