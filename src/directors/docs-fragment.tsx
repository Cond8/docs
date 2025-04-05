import { Context } from 'hono';
import { z } from 'zod';
import { createDirector } from '../_core';
import { DocsActors, DocsConduit } from '../_stage/conduits/DocsConduit';

const DocsFragment = createDirector<DocsConduit>('Docs Fragment Director').init<Context>(input => ({
	conduit: new DocsConduit(input),
}));

DocsFragment(
	DocsActors.Guard.Params.Check({ slug: z.string().default('what-is-cond8') }).SetEntries((n, v) => [`param ${n}`, v]),
	DocsActors.Fetcher.File.Get('param slug', slug => `/files/docs/${slug}.md`).Set('markdown'),
	DocsActors.Modeler.MD.Get('markdown').Set('html'),
);

export default DocsFragment.fin<string>(c8 => c8.var('html'));
