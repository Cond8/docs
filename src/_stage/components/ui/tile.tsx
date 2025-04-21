// src/_stage/components/ui/tile.tsx
export interface TileProps {
	idx: number;
	tiles: {
		href: string;
		title: string;
		desc: string;
		size: string;
	}[];
}

export const Tile = ({ idx, tiles }: TileProps) => {
	const { href, title, desc } = tiles[idx];
	return (
		<a
			href={href}
			className="
        group h-full w-full flex flex-col justify-between
        border border-border
        p-5 sm:p-6
        bg-background/70 hover:bg-background/90
        transition-all duration-200
        hover:scale-[1.015] hover:shadow-lg
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
