// src/components/error/lifecycle-block.tsx
import { Fragment } from 'preact/jsx-runtime';
import { LifecyclePayload } from '../../_core/Lifecycle/Vacuum';
import { CodeBlock } from './code-block';
import { MetadataGrid } from './error-metadata-grid';
import { NestedObjectTable } from './nested-object-table';
import { ScrollBlock } from './scroll-block';

interface Props {
	payload: LifecyclePayload;
}

export function ErrorPayload({ payload }: Props) {
	if (!payload) return null;

	return (
		<div className="space-y-6 font-mono text-sm text-[var(--foreground)]">
			{Object.entries(payload).map(([key, value]) => {
				if (value == null) return null;

				const title = <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--note-foreground)] mb-1">{key}</h3>;

				// Render the readonly c8 object as a nested table
				if (key === 'c8' && typeof value === 'object') {
					return (
						<Fragment key={key}>
							{title}
							<NestedObjectTable object={value} />
						</Fragment>
					);
				}

				// Special handling for Error instances
				if (key === 'error' && value instanceof Error) {
					return (
						<Fragment key={key}>
							{title}
							<div className="bg-[var(--danger)] text-[var(--danger-foreground)] p-4 rounded border-l-4 border-[var(--danger-border)] max-h-64 overflow-auto whitespace-pre-wrap">
								<pre>
									{value.name}: {value.message}
									{'\n'}
									{value.stack}
								</pre>
							</div>
						</Fragment>
					);
				}

				// Render metadata array in grid layout
				if (key === 'metadata' && Array.isArray(value)) {
					return (
						<Fragment key={key}>
							{title}
							<MetadataGrid items={value} />
						</Fragment>
					);
				}

				// Render function-like string fields
				if (['inputMapper', 'outputMapper', 'actorFn', 'assertFn'].includes(key) && typeof value === 'string') {
					return (
						<Fragment key={key}>
							{title}
							<CodeBlock code={value} variant="error" />
						</Fragment>
					);
				}

				// Fallback: stringify anything else
				return (
					<Fragment key={key}>
						{title}
						<ScrollBlock value={value} />
					</Fragment>
				);
			})}
		</div>
	);
}
