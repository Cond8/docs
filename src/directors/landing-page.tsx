// src/directors/landing-page.tsx
import { Context } from 'hono';
import { createDirector } from '../_core';
import { DefaultHeaders } from '../_stage/components/default-headers';
import { Footer } from '../_stage/components/footer';
import { TileSection } from '../_stage/components/landing-tiles';
import { Newsletter } from '../_stage/components/Newsletter';
import { Topbar } from '../_stage/components/topbar';
import { DocsActors, DocsConduit } from '../_stage/conduits/DocsConduit';

const LandingPageDirector = createDirector<DocsConduit>(
	'landing-page director',
	'a static landing page director',
	'uses landing-tiles.tsx',
).init<Context>(c => ({
	conduit: new DocsConduit(c),
}));

LandingPageDirector(
	DocsActors.Cache.Get('landing-page html').Set('html'),
	DocsActors.Support.If(c8 => !c8.var.has('html')).Then(
		DocsActors.VHX.Title('Cond8 Docs'),
		DocsActors.VHX.Header(<DefaultHeaders />),
		DocsActors.VHX.Template(
			<div className="bg-card text-card-foreground relative">
				<div className="absolute inset-0 bg-[url('/landing-bg.png')] bg-cover bg-center opacity-30" />
				<div className="relative z-10">
					<div className="h-screen flex flex-col">
						<Topbar landingPage />

						<div className="flex flex-grow items-center justify-center px-4">
							<main id="landing-page" className="max-w-[800px] w-full">
								<div className="relative inline-block w-full">
									<div className="flex justify-between items-center">
										<h1
											className="
                      font-logo uppercase tracking-tight leading-none
                      text-[10vw] lg:text-[17.5rem]
                      [text-shadow:4px_4px_2px_black]
                      pointer-events-none select-none
                    "
										>
											Cond8
										</h1>
										<img src="/VHX-logo.svg" alt="VHX Logo" width={180} className="transform -translate-x-[25px] translate-y-[20px]" />
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
                  text-lg lg:text-4xl
                  tracking-widest text-foreground/80
                  my3 lg:mb-6 lg:mt-12
                "
								>
									A text-to-workflow transformer
								</h2>

								<Newsletter title="Subscribe to the Cond8 Newsletter" />

								<TileSection />
							</main>
						</div>
					</div>

					<Footer />
				</div>
			</div>,
		),
		DocsActors.VHX.Finalize.Set('html'),
		DocsActors.Cache.Set('landing-page html').FromVar('html'),
	),
);

export default LandingPageDirector.fin<string>(c8 => c8.var('html'));
