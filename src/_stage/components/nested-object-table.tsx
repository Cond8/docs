// src/_stage/components/nested-object-table.tsx
import { Fragment } from 'preact/jsx-runtime';

export function NestedObjectTable({ object }: { object: Record<string, Record<string, unknown>> }) {
	if (!object || typeof object !== 'object') return null;

	return (
		<div className="space-y-6">
			{Object.entries(object).map(([layer, entries]) => {
				if (typeof entries !== 'object' || entries == null) return null;

				return (
					<Fragment key={layer}>
						<h4 className="text-xs uppercase font-bold tracking-wide text-green-300 mb-2">{layer}</h4>
						<div className="w-full overflow-x-auto border border-gray-700 rounded">
							<table className="w-full text-left text-xs table-fixed">
								<thead className="bg-gray-800 text-gray-300">
									<tr>
										<th className="p-2 w-1/3 border-b border-gray-700">Key</th>
										<th className="p-2 border-b border-gray-700">Value</th>
									</tr>
								</thead>
								<tbody className="bg-gray-950 text-gray-100">
									{Object.entries(entries).map(([k, v]) => (
										<tr key={k} className="border-t border-gray-800 hover:bg-gray-900">
											<td className="p-2 font-bold break-words">{k}</td>
											<td className="p-2 break-words">
												<pre className="whitespace-pre-wrap">{formatValue(v)}</pre>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Fragment>
				);
			})}
		</div>
	);
}

function formatValue(value: unknown): string {
	if (typeof value === 'string') return value;
	if (typeof value === 'number' || typeof value === 'boolean') return value.toString();
	try {
		return JSON.stringify(value, null, 2);
	} catch {
		return '[unserializable]';
	}
}
