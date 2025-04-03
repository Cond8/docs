import { Context } from 'hono';
import { CoreRedprint } from '../../_core';

export const createFetcherActors = <C8 extends CoreRedprint<Context>>() => {
	const File = {
		Get: (getKey: string, fn: (str: string) => string) => ({
			Set: (setKey: string) => async (c8: C8) => {
				const value = c8.var(getKey);
				if (typeof value !== 'string') {
					throw new Error(`Fetcher: '${getKey}' must resolve to a string.`);
				}

				const url = fn(value);

				const res = await fetch(url, {
					method: 'GET',
					headers: {
						Accept: 'text/markdown, text/plain, */*',
						'User-Agent': 'cond8-fetcher',
					},
				});

				if (!res.ok) {
					throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
				}

				const text = await res.text();
				c8.var(setKey, text);
				return c8;
			},
		}),
	};

	return {
		File,
	};
};
