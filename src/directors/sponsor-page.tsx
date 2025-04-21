// src/directors/sponsorship-page.tsx
import { Context } from 'hono';
import { createDirector } from '../_core';
import { DefaultHeaders } from '../_stage/components/default-headers';
import { Footer } from '../_stage/components/footer';
import { SponsorshipTileSection } from '../_stage/components/sponsor-tiles';
import { Topbar } from '../_stage/components/topbar';
import { DocsActors, DocsConduit } from '../_stage/conduits/DocsConduit';

const SponsorshipPageDirector = createDirector<DocsConduit>(
	'sponsorship-page director',
	'a static sponsorship page director',
	'uses sponsorship-tiles.tsx',
).init<Context>(c => ({
	conduit: new DocsConduit(c),
}));

SponsorshipPageDirector(
	DocsActors.Cache.Get('sponsorship-page html').Set('html'),
	DocsActors.Support.If(c8 => !c8.var.has('html')).Then(
		DocsActors.VHX.Title('Sponsor Cond8'),
		DocsActors.VHX.Header(<DefaultHeaders />),
		DocsActors.VHX.Template(
			<div className="bg-card text-card-foreground relative">
				<div className="absolute inset-0 bg-[url('/sponsor-cond8-bg.png')] bg-cover bg-center opacity-30" />
				<div className="relative z-10">
					<div className="h-full flex flex-col">
						<Topbar sponsorPage />

						<div className="flex flex-grow items-center justify-center px-4">
							<main id="sponsorship-page" className="max-w-[800px] w-full">
								<div className="relative inline-block w-full">
									<div className="mt-12">
										<h3 className="font-logo uppercase tracking-tight leading-none text-[5vw] text-center">Sponsor</h3>
									</div>
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
										<img
											src="/sponsor-logo.svg"
											alt="Sponsor Logo"
											width={120}
											className="transform -translate-x-[20px] translate-y-[20px]"
										/>
									</div>
									<div
										className="h-2 bg-emerald-600 mt-2"
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
									Support the Future of Small Language Models
								</h2>

								<p className="text-center text-xl lg:text-2xl text-foreground/80 mt-6 lg:mt-8 mb-12">
									We're building the infrastructure to make Small Language Models practical—models that live locally, think fast, and stay
									close to the problem.
								</p>

								<SponsorshipTileSection />
							</main>
						</div>
					</div>

					<Footer />
				</div>
			</div>,
		),
		DocsActors.VHX.Finalize.Set('html'),
		DocsActors.Cache.Set('sponsorship-page html').FromVar('html'),
	),
);

export default SponsorshipPageDirector.fin(c8 => c8.var.string('html'));
