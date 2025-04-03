import { Context } from 'hono';
import { z } from 'zod';
import { createDirector } from '../_core';
import { DefaultHeaders } from '../_stage/components/default-headers';
import { DocsSidebar } from '../_stage/components/docs-sidebar';
import { Footer } from '../_stage/components/footer';
import { mdxComponents } from '../_stage/components/mdx-components';
import { Topbar } from '../_stage/components/topbar';
import { AppConduit, FetcherActors, GuardActors, ModelerActors, StylingActors, VHXActors } from '../_stage/conduits/AppConduit';

const slugToTitle = (slug: string): string =>
	slug
		.replace(/-/g, ' ')
		.replace(/\s+/g, ' ')
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

const DocsPages = createDirector<AppConduit>('docs-page director', '').init<Context>(c => {
	return {
		conduit: new AppConduit(c),
	};
});

DocsPages(
	GuardActors.Params.Get({ slug: z.string().default('what-is-cond8') }).Set(n => `param ${n}`),
	ModelerActors.String.Get('param slug').Do(slugToTitle).Set('title'),

	VHXActors.Title.Get('title', title => `Cond8 Docs - ${title}`),
	VHXActors.Header(<DefaultHeaders />),
	VHXActors.Template(
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

	FetcherActors.File.Get('param slug', slug => `http://localhost:8787/files/docs/${slug}.mdx`).Set('MDX'),
	ModelerActors.MDX.Get('MDX').MDXContentElement.Set('MDX'),
	StylingActors.MDXContentElement.Get('MDX').Do(mdxComponents).Set('MDX'),

	VHXActors.Slot('content', c8 => c8.var('MDX')),
	VHXActors.WrapHtml,
);

export default DocsPages.fin<string>(c8 => c8.var('html'));
