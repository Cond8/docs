// src/_stage/components/landing-tiles.tsx
const tiles = [
  {
    href: '/docs/what-is-cond8',
    title: 'The Core Idea',
    desc: 'An execution engine that treats code like math. Scenes, actors, and pure composition—no frameworks, just logic.',
  },
  {
    href: '/domains',
    title: 'Domain-Specific Language Models',
    desc: 'Use small, domain-specific language models that understand your app. Let them brute-force their way through tests, one actor at a time.',
  },
  {
    href: '/get-started',
    title: 'Get Started',
    desc: 'Install Cond8 and scaffold your first system in seconds. No boilerplate. Total control.',
  },
  {
    href: '/architecture',
    title: 'Explore the Architecture ',
    desc: 'Directors. Conduits. Blueprints. Redprints. Scenes. Everything is procedural. Everything composes.',
  },
  {
    href: '/philosophy',
    title: 'Why Cond8 Exists',
    desc: 'Not a framework. A language for telling the computer exactly what you mean.',
  },
];

const Tile = ({ idx }) => {
  const { href, title, desc } = tiles[idx];
  return (
    <a
      key={href}
      href={href}
      className="
        group h-full w-full flex flex-col justify-between
        border border-foreground
        p-5 sm:p-6
        bg-background/70 hover:bg-background/90
        transition-all duration-200
        hover:scale-[1.01] hover:shadow-lg
      "
    >
      <h2
        className="
          font-title text-lg sm:text-xl uppercase mb-2
          tracking-wide group-hover:translate-x-1
          transition-transform duration-150
        "
      >
        {title}
      </h2>
      <p className="text-sm text-foreground/80 leading-snug">{desc}</p>
    </a>
  );
};

export const TileSection = () => (
  <section
    className="
      w-full max-w-6xl gap-6
      grid grid-cols-1
      md:grid-cols-3 md:grid-rows-[repeat(12,minmax(0,1fr))]
    "
  >
    {/* Top Left */}
    <div className="md:col-start-1 md:row-start-1 md:row-span-6">
      <Tile idx={0} />
    </div>

    {/* DSLM */}
    <div className="md:col-start-2 md:col-span-2 md:row-start-1 md:row-span-5">
      <Tile idx={1} />
    </div>

    {/* Bottom Left */}
    <div className="md:col-start-1 md:row-start-7 md:row-span-6">
      <Tile idx={2} />
    </div>

    {/* Explore */}
    <div className="md:col-start-2 md:row-start-6 md:row-span-7">
      <Tile idx={3} />
    </div>

    {/* Philosophy */}
    <div className="md:col-start-3 md:row-start-6 md:row-span-7">
      <Tile idx={4} />
    </div>
  </section>
);
