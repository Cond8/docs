import concurrently from 'concurrently';

concurrently(
	[
		{
			command: 'pnpm dev:css',
			name: 'tailwind',
			prefixColor: 'blue',
		},
		{
			command: 'pnpm dev:js',
			name: 'scripts',
			prefixColor: 'magenta',
		},
		{
			command: 'wrangler dev --local',
			name: 'cf-worker',
			prefixColor: 'yellow',
		},
	],
	{
		prefix: 'name',
		killOthers: ['failure'],
	},
).result.catch(() => {
	process.exit(1);
});
