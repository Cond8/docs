// src/_stage/components/ui/scroll-block.tsx
export function ScrollBlock({ value }: { value: unknown }) {
	const content = (() => {
		if (typeof value === 'string') return value;
		try {
			return JSON.stringify(value, null, 2);
		} catch {
			return '[unserializable]';
		}
	})();

	return (
		<pre className="bg-gray-950 text-gray-200 text-xs font-mono p-4 rounded border border-gray-800 max-h-64 overflow-auto whitespace-pre-wrap">
			{content}
		</pre>
	);
}
