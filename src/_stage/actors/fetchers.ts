import { Context } from 'hono';
import { CoreRedprint, Recorder } from '../../_core';

export const createFetcherActors = <C8 extends CoreRedprint<Context>>() => {
	const File = {
		Get: (getKey: string, pathResolver: (slug: string) => string) => ({
			Set: (setKey: string) => async (c8: C8, recorder: Recorder) => {
				const slug = c8.var(getKey);
				if (typeof slug !== 'string') {
					throw new Error(`Fetcher: '${getKey}' must resolve to a string.`);
				}

				const assetPath = pathResolver(slug); // e.g. './files/docs/my-post.md'

				const res = await c8.body.env.ASSETS.fetch(new Request(assetPath));

				if (!res.ok) {
					throw new Error(`Failed to fetch asset '${assetPath}': ${res.status} ${res.statusText}`);
				}

				const text = await res.text();

				recorder('MD string', assetPath, text.slice(0, 300));

				c8.var(setKey, text);
				return c8;
			},
		}),
	};

	return {
		File,
	};
};
