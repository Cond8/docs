// src/directors/docs-pages.tsx
import { Context } from 'hono';
import { z } from 'zod';
import { createDirector, createRecorder } from '../_core';
import { DefaultHeaders } from '../_stage/components/default-headers';
import { DocsSidebar } from '../_stage/components/docs-sidebar';
import { Footer } from '../_stage/components/footer';
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
	DocsActors.Cache.Get('param slug', slug => `${slug} html`).Set('html'),
	DocsActors.Support.If(c8 => !c8.var.has('html')).Then(
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
						<div className="flex-grow max-w-[800px] w-full markdown">
							<div id="htmx-target" hx-target="this">
								<slot name="Html Content" />
							</div>
						</div>
					</main>
				</div>

				<Footer />
			</div>,
		),
		DocsActors.Fetcher.File.Get('param slug', slug => `/dist/content/docs/${slug}.html`).Set('fragment'),
		DocsActors.VHX.HtmlFragment.Get('fragment').SetSlot('Html Content'),
		DocsActors.VHX.Finalize.Set('html'),
		DocsActors.Cache.Set('param slug', slug => `${slug} html`).FromVar('html'),
	),
);

export default DocsPages.fin<string>(c8 => c8.var('html'));
