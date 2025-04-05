// src/_stage/conduits/DocsConduit.ts
import { Context } from 'hono';
import { CoreRedprint, StrictObjectKVService } from '../../_core';
import { createFetcherActors } from '../actors/fetchers';
import { createGuardActors } from '../actors/guards';
import { createHtmlActors, HtmlRedprint } from '../actors/html';
import { createModelerActors } from '../actors/modelers';
import { createVHXActors, VHXRedprint } from '../actors/vhx';
import { HtmlSlotsService } from '../services/HtmlSlotsService';
import { LifeCycleService } from '../services/LifeCycleService';
import { VHXService } from '../services/VhxService';

export class DocsConduit extends CoreRedprint<Context> implements VHXRedprint<Context>, HtmlRedprint {
	public locals = new StrictObjectKVService('locals');
	public vhx = new VHXService('vhx');
	public html = new HtmlSlotsService('html');

	public lifeCycle = new LifeCycleService('lifeCycle');

	constructor(c: Context) {
		super(c);
	}
}

export const DocsActors = {
	VHX: createVHXActors<DocsConduit>(),
	Guard: createGuardActors<DocsConduit>(),
	Modeler: createModelerActors<DocsConduit>(),
	Fetcher: createFetcherActors<DocsConduit>(),
	Html: createHtmlActors<DocsConduit>(),
};
