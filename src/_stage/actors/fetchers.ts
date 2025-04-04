// src/_stage/actors/fetchers.ts
import { Context } from 'hono';
import { CoreRedprint, Recorder } from '../../_core';

export const createFetcherActors = <C8 extends CoreRedprint<Context>>() => {
	const File = {
		Get: (getKey: string, pathResolver: (slug: string) => string) => ({
			Set: (setKey: string) => async (c8: C8, recorder?: Recorder) => {
				const slug = c8.var.string(getKey);

				recorder?.('slug', slug);

				const assetPath = pathResolver(slug); // e.g. './files/docs/my-post.md'

				let res;

				try {
					res = await c8.body.env.ASSETS.fetch(new Request(assetPath));
				} catch (error) {
					console.log('error caught in fetcher');
					throw error;
				}

				if (!res.ok) {
					throw new Error(`Failed to fetch asset '${assetPath}': ${res.status} ${res.statusText}`);
				}

				const text = await res.text();

				recorder?.('MD string', assetPath, text.slice(0, 300));

				c8.var.string(setKey, text);
				return c8;
			},
		}),
	};

	return {
		File,
	};
};
