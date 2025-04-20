// src/_stage/actors/cache.ts
import { DocsConduit } from '../conduits/DocsConduit';

export const createCacheActors = <C8 extends DocsConduit>() => {
	const Get = (getKey: string) => ({
		Set: (setKey: string) => async (c8: C8) => {
			const value = await c8.cache.optional(getKey);
			if (value) c8.var.string(setKey, value);
			return c8;
		},
	});

	const Set = (setKey: string, getKey: string) => async (c8: C8) => {
		const value = c8.var.string(getKey);
		await c8.cache.set(setKey, value);
		return c8;
	};

	return {
		Get,
		Set,
	};
};
