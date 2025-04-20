// src/_stage/actors/cache.ts
import { CoreRedprint } from '../../_core';

export const createCacheActors = <C8 extends CoreRedprint<any>>() => {
	const Get = (getKey: string) => ({
		Set: (setKey: string) => async (c8: C8) => {
			if (await c8.cache?.has(getKey)) {
				const value = await c8.cache?.get(getKey);
				c8.var(setKey, value);
			}
			return c8;
		},
	});

	const Set = (setKey: string, value: unknown) => async (c8: C8) => {
		await c8.cache?.set(setKey, value);
		return c8;
	};

	return {
		Get,
		Set,
	};
};
