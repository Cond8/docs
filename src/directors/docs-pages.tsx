// src/directors/docs-pages.tsx
import { Context } from 'hono';
import { z } from 'zod';
import { createDirector, createRecorder } from '../_core';
import { DefaultHeaders } from '../_stage/components/default-headers';
import { DocsSidebar } from '../_stage/components/docs-sidebar';
import { Footer } from '../_stage/components/footer';
import { mdComponents } from '../_stage/components/md-components';
import { Topbar } from '../_stage/components/topbar';
import { DocsActors, DocsConduit } from '../_stage/conduits/DocsConduit';

const slugToTitle = (slug: string): string =>
	slug
		.replace(/-/g, ' ')
		.replace(/\s+/g, ' ')
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

const DocsPages = createDirector<DocsConduit>('docs-page director', '').init<Context>(c => {
	return {
		conduit: new DocsConduit(c),
		recorder: createRecorder(),
	};
});

DocsPages(
	DocsActors.Guard.Params.Check({ slug: z.string().default('what-is-cond8') }).SetEntries((n, v) => [`param ${n}`, v]),

	(c8, recorder) => {
		recorder?.('testing');
		return c8;
	},

	DocsActors.Fetcher.File.Get('param slug', slug => `/files/docs/${slug}.md`).Set('markdown'),
	(c8, recorder) => {
		recorder?.('testing 2');
		return c8;
	},

	DocsActors.Modeler.MD.Get('markdown').Do(mdComponents).Set('markdown jsx'), // << I put this actor to the front for debugging

	(c8, recorder) => {
		recorder?.('testing 3');
		return c8;
	},

	DocsActors.Modeler.String.Get('param slug').Do(slugToTitle).Set('title'),
	DocsActors.VHX.Title.Get('title', title => `Cond8 Docs - ${title}`),
	DocsActors.VHX.Header(<DefaultHeaders />),
	DocsActors.VHX.Template(
		<div className="min-h-screen flex flex-col">
			<div
				className="
          sticky top-0 z-50 bg-background/80
          border-b border-foreground
          backdrop-blur
        "
			>
				<Topbar urlSelected="/docs" />
			</div>

			<div className="flex flex-grow justify-center px-4 py-8">
				<main id="landing-page" className="flex space-x-4 max-w-[1024px] w-full">
					<DocsSidebar />
					<div className="flex-grow max-w-[800px] w-full">
						<slot name="content" />
					</div>
				</main>
			</div>

			<Footer />
		</div>,
	),
	DocsActors.VHX.Slot('content', c8 => c8.var('markdown jsx')),
	DocsActors.VHX.Finalize.Set('html'),
);

export default DocsPages.fin<string>(c8 => c8.var('html'));
