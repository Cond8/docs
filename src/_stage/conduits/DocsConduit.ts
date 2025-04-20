// src/_stage/conduits/DocsConduit.ts
import { Context } from 'hono';
import { CoreRedprint, StrictObjectKVService } from '../../_core';
import { createSupportActors } from '../../_core/CoreDomain/Actors/support';
import { createCacheActors } from '../actors/cache';
import { createFetcherActors } from '../actors/fetchers';
import { createGuardActors } from '../actors/guards';
import { createModelerActors } from '../actors/modelers';
import { createVHXActors, VHXRedprint } from '../actors/vhx';
import { HtmlCacheRemoteClient } from '../services/HtmlCacheService';
import { LifeCycleService } from '../services/LifeCycleService';
import { VHXService } from '../services/VhxService';

export class DocsConduit extends CoreRedprint<Context> implements VHXRedprint<Context> {
	public readonly locals = new StrictObjectKVService('locals');
	public readonly vhx = new VHXService('vhx');
	public readonly lifeCycle = new LifeCycleService('lifeCycle');
	public readonly cache: HtmlCacheRemoteClient;

	constructor(c: Context) {
		super(c);
		// Fix: Use Durable Object stub, not namespace
		const cacheNamespace = c.env.CACHE;
		const cacheId = cacheNamespace.idFromName('cache');
		const cacheStub = cacheNamespace.get(cacheId);
		this.cache = new HtmlCacheRemoteClient('cache', cacheStub);
	}
}

export const DocsActors = {
	Support: createSupportActors<DocsConduit>(),
	Cache: createCacheActors<DocsConduit>(),
	VHX: createVHXActors<DocsConduit>(),
	Guard: createGuardActors<DocsConduit>(),
	Modeler: createModelerActors<DocsConduit>(),
	Fetcher: createFetcherActors<DocsConduit>(),
};
