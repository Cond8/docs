// src/_stage/components/error-metadata-grid.tsx
export function MetadataGrid({ items }: { items: unknown[] }) {
	if (!items?.length) return null;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{items.map((item, idx) => (
				<div
					key={idx}
					className="bg-gray-950 border border-gray-700 rounded p-3 text-xs text-gray-200 font-mono whitespace-pre-wrap overflow-auto max-h-40"
				>
					<pre>{formatItem(item)}</pre>
				</div>
			))}
		</div>
	);
}

function formatItem(value: unknown): string {
	try {
		return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
	} catch {
		return '[unserializable]';
	}
}
