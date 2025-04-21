// src/_stage/actors/cache.ts
import { StagedActor } from '../../_core';
import { DocsConduit } from '../conduits/DocsConduit';

type GetCache<C8 extends DocsConduit> = {
	Set: (setKey: string) => StagedActor<C8>;
};

type SetCache<C8 extends DocsConduit> = {
	FromVar: (getVarKey: string) => StagedActor<C8>;
};

export const createCacheActors = <C8 extends DocsConduit>() => {
	function Get(getCacheKey: string): GetCache<C8>;
	function Get(getVarKey: string, pathResolver: (slug: string) => string): GetCache<C8>;
	function Get(getKey: string, pathResolver?: (slug: string) => string): GetCache<C8> {
		return {
			Set: (setKey: string) => async (c8: C8) => {
				let getCacheKey = getKey;
				if (pathResolver !== undefined) {
					const slug = c8.var.string(getKey);
					if (!slug) return c8;
					getCacheKey = pathResolver(slug);
				}

				const value = await c8.cache.optional(getCacheKey);
				if (value) c8.var.string(setKey, value);
				return c8;
			},
		};
	}

	function Set(setCacheKey: string): SetCache<C8>;
	function Set(setVarKey: string, pathResolver: (slug: string) => string): SetCache<C8>;
	function Set(setKey: string, pathResolver?: (slug: string) => string): SetCache<C8> {
		return {
			FromVar: (getVarKey: string) => async (c8: C8) => {
				let setCacheKey = setKey;
				if (pathResolver !== undefined) {
					const slug = c8.var.string(setKey);
					if (!slug) throw new Error(`[Set Cache]: var key: ${setKey} | cannot resolve the cache key`);
					setCacheKey = pathResolver(slug);
				}
				const valueToCache = c8.var.string(getVarKey);
				if (!valueToCache) throw new Error(`[Set Cache]: var key: ${getVarKey} | cannot find the var value to cache`);
				c8.cache.set(setCacheKey, valueToCache);
				return c8;
			},
		};
	}

	return {
		Get,
		Set,
	};
};
