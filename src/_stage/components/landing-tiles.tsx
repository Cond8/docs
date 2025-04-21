// src/_stage/components/landing-tiles.tsx
import { Tile } from './ui/tile';
const tiles = [
	{
		href: 'https://app.cond8.dev',
		title: 'Go to Cond8 browser app',
		desc: 'Demo the Cond8 browser app (pre-alpha build)',
		size: 'md:col-start-1 md:row-start-1 md:row-span-6', // BIG
	},
	{
		href: '/domains',
		title: 'Domain-Specific Language Models',
		desc: 'Use small, domain-specific language models that understand your app. Let them brute-force their way through tests, one actor at a time.',
		size: 'md:col-start-2 md:col-span-2 md:row-start-1 md:row-span-5', // WIDE
	},
	{
		href: '/sponsor-cond8',
		title: 'Sponsor Cond8',
		desc: 'Support the future of small language models—models that live locally, think fast, and stay close to the problem.',
		size: 'md:col-start-1 md:row-start-7 md:row-span-6', // TALL NARROW
	},
	{
		href: '/docs/what-is-cond8',
		title: 'The Core Idea',
		desc: 'An execution engine that treats code like math. Scenes, actors, and pure composition—no frameworks, just logic.',
		size: 'md:col-start-2 md:row-start-6 md:row-span-7', // MEDIUM-LARGE
	},
	{
		href: '/philosophy',
		title: 'Why Cond8 Exists',
		desc: 'Not a framework. A language for telling the computer exactly what you mean.',
		size: 'md:col-start-3 md:row-start-6 md:row-span-7', // SMALL
	},
];

export const TileSection = () => (
	<section
		className="
      w-full max-w-6xl gap-6
      grid grid-cols-1
      md:grid-cols-3 md:grid-rows-[repeat(12,minmax(0,1fr))]
    "
	>
		{tiles.map((t, i) => (
			<div key={t.href} className={t.size}>
				<Tile idx={i} tiles={tiles} />
			</div>
		))}
	</section>
);
