// src/directors/docs-fragment.tsx
import { Context } from 'hono';
import { z } from 'zod';
import { createDirector, createRecorder } from '../_core';
import { DocsActors, DocsConduit } from '../_stage/conduits/DocsConduit';

const DocsPartial = createDirector<DocsConduit>('Docs Fragment Director').init<Context>(input => ({
	conduit: new DocsConduit(input),
	recorder: createRecorder({
		onError: (recording, error) => {
			console.log({
				error: error.name + ': ' + error.message,
				recording,
			});
		},
	}),
}));

DocsPartial(
	DocsActors.Guard.Params.Check({ slug: z.string().default('what-is-cond8') }).SetEntries((n, v) => [`param ${n}`, v]),
	DocsActors.Fetcher.File.Get('param slug', slug => `/dist/content/docs/${slug}.html`).Set('html'),
);

export default DocsPartial.fin<string>(c8 => c8.var('html'));
