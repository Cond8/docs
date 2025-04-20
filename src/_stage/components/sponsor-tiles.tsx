// src/_stage/components/sponsorship-tiles.tsx
import { Tile } from './ui/tile';

const tiles = [
	{
		href: '/sponsor/github',
		title: 'GitHub Sponsors',
		desc: 'Back Cond8 monthly, vote on features, and get your name (or logo) in our README and site footer.',
		size: 'md:col-start-1 md:row-start-1 md:col-span-2 md:row-span-3', // BIG
	},
	{
		href: 'https://www.twitch.tv/yourchannel',
		title: 'Watch Live Builds',
		desc: 'Join the Twitch stream, see real‑time commits, and chat about SLM infrastructure as it happens.',
		size: 'md:col-start-3 md:row-start-1 md:col-span-2 md:row-span-2', // WIDE
	},
	{
		href: '/sponsor/partner',
		title: 'Corporate Partner',
		desc: 'Shape the roadmap, get early drops, and integrate Cond8 workflows into your stack.',
		size: 'md:col-start-1 md:row-start-4 md:col-span-1 md:row-span-2', // TALL NARROW
	},
	{
		href: '/sponsor/one‑time',
		title: 'One‑Time Boost',
		desc: 'Buy me a coffee (or a GPU hour) and get a shout‑out in the next stream.',
		size: 'md:col-start-2 md:row-start-4 md:col-span-1 md:row-span-2', // SMALL
	},
	{
		href: '/sponsor/integration',
		title: 'Custom Integration',
		desc: 'Need Cond8 embedded in your product? Let’s scope it and build together.',
		size: 'md:col-start-3 md:row-start-3 md:col-span-2 md:row-span-3', // MEDIUM-LARGE
	},
];

export const SponsorshipTileSection = () => (
	<section
		className="
      w-full max-w-6xl gap-6
      grid grid-cols-1
      md:grid-cols-4 md:grid-rows-[repeat(5,minmax(0,1fr))]
    "
	>
		<div className="md:col-start-1 md:row-start-1 md:col-span-2 md:row-span-3">
			<div className="w-full h-full">
				<iframe src="https://github.com/sponsors/Cond8/card" title="Sponsor Cond8" className="w-full h-full border-none"></iframe>
			</div>
		</div>
		{tiles.map((t, i) => (
			<div key={t.href} className={t.size}>
				<Tile idx={i} tiles={tiles} />
			</div>
		))}
	</section>
);
