// src/directors/docs-fragment.tsx
import { Context } from 'hono';
import { z } from 'zod';
import { createDirector, createRecorder } from '../_core';
import { CTA } from '../_stage/components/call-to-action';
import { DocsActors, DocsConduit } from '../_stage/conduits/DocsConduit';

const DocsFragment = createDirector<DocsConduit>('Docs Fragment Director').init<Context>(input => ({
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

DocsFragment(
	DocsActors.Guard.Params.Check({ slug: z.string().default('what-is-cond8') }).SetEntries((n, v) => [`param ${n}`, v]),
	DocsActors.Fetcher.File.Get('param slug', slug => `/files/docs/${slug}.md`).Set('markdown'),
	DocsActors.Modeler.MD.Get('markdown').Set('html'),

	DocsActors.Html.InitHtml('html'),
	DocsActors.Html.SetSlot(
		'Callout 1',
		<CTA
			title={'Learn about Cond8 in any way you want.'}
			description={'Press the button to learn more about Cond8.'}
			action={{
				label: 'Learn More',
				onClick: () => console.log('Learn More Clicked'),
			}}
		/>,
	),
	DocsActors.Html.SetSlot(
		'Callout 2',
		<CTA
			title={'Learn about Cond8 in any way you want.'}
			description={'Press the button to learn more about Cond8.'}
			action={{
				label: 'Learn More',
				onClick: () => console.log('Learn More Clicked'),
			}}
		/>,
	),

	DocsActors.Html.Finalize.Set('Slotted HTML'),
);

export default DocsFragment.fin<string>(c8 => c8.var('Slotted HTML'));
