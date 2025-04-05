// src/_stage/components/recording-block.tsx
import { Fragment } from 'preact/jsx-runtime';
import { RecorderEntry } from '../../_core';

interface Props {
	recording: RecorderEntry[];
}

export function RecordingBlock({ recording }: Props) {
	if (!Array.isArray(recording) || recording.length === 0) return null;

	return (
		<div className="space-y-6 font-mono text-sm">
			{recording.map((entry, i) => (
				<Fragment key={i}>
					<div className="border border-[var(--caution-border)] bg-[var(--card)] p-4 rounded max-h-64 overflow-auto">
						<div className="flex justify-between items-center mb-2">
							<h3 className="text-sm font-semibold text-[var(--caution-foreground)] uppercase tracking-wide">🎞️ {entry.filter}</h3>
							<span className="text-xs text-[var(--muted-foreground)]">{entry.ms} ms</span>
						</div>

						{Array.isArray(entry.metadata) && entry.metadata.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
								{entry.metadata.map((item, j) => (
									<div
										key={j}
										className="border border-zinc-700 bg-zinc-900 p-2 rounded text-xs overflow-auto max-h-32 whitespace-pre-wrap"
									>
										<pre>{JSON.stringify(item, null, 2)}</pre>
									</div>
								))}
							</div>
						) : (
							<p className="text-xs text-[var(--muted-foreground)]">No metadata available.</p>
						)}
					</div>
				</Fragment>
			))}
		</div>
	);
}
