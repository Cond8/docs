// src/directors/404.tsx
import { Context } from 'hono';
import { createDirector } from '../_core';
import { DefaultHeaders } from '../_stage/components/default-headers';
import { Footer } from '../_stage/components/footer';
import { Topbar } from '../_stage/components/topbar';
import { DocsActors, DocsConduit } from '../_stage/conduits/DocsConduit';

const NotFoundDirector = createDirector<DocsConduit>('404 director', 'a static 404 page director', 'uses 404.tsx').init<Context>(c => ({
	conduit: new DocsConduit(c),
}));

NotFoundDirector(
	DocsActors.VHX.Title('Page Not Found — Cond8 Docs'),
	DocsActors.VHX.Header(<DefaultHeaders />),
	DocsActors.VHX.Template(
		<div className="bg-card text-card-foreground relative">
			<div className="absolute inset-0 bg-[url('/landing-bg.png')] bg-cover bg-center opacity-30" />
			<div className="relative z-10">
				<div className="h-screen flex flex-col">
					<Topbar />

					<div className="flex flex-grow items-center justify-center px-4">
						<main id="not-found-page" className="max-w-[800px] w-full text-center">
							<div className="relative inline-block w-full">
								<div className="flex justify-center items-center">
									<h1
										className="
                      font-logo uppercase tracking-tight leading-none
                      text-[10vw] lg:text-[12rem]
                      [text-shadow:4px_4px_2px_black]
                      pointer-events-none select-none
                    "
									>
										404
									</h1>
								</div>
								<div
									className="h-2 bg-red-600 mt-2"
									style={{
										boxShadow: '3px 10px 0 black',
										transform: 'rotate(-0.2deg)',
									}}
								/>
							</div>

							<h2
								className="
                  w-full text-center font-subtitle uppercase
                  text-lg lg:text-3xl
                  tracking-widest text-foreground/80
                  my3 lg:mb-6 lg:mt-12
                "
							>
								Page Not Found
							</h2>

							<p className="mb-8 text-foreground/60">Sorry, the page you were looking for does not exist.</p>

							<a
								href="/"
								className="inline-block px-6 py-3 rounded bg-red-600 text-white font-bold uppercase shadow hover:bg-red-700 transition"
							>
								Go Home
							</a>
						</main>
					</div>

					<Footer />
				</div>
			</div>
		</div>,
	),
	DocsActors.VHX.Finalize.Set('html'),
);

export default NotFoundDirector.fin<string>(c8 => c8.var('html'));
