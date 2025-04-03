// src/_stage/conduits/AppConduit.ts
import { Context } from 'hono';
import { CoreRedprint, StrictObjectKVService } from '../../_core';
import { createFetcherActors } from '../actors/fetchers';
import { createGuardActors } from '../actors/guards';
import { createModelerActors } from '../actors/modelers';
import { createStylerActors } from '../actors/stylers';
import { createVHXActors, VHXRedprint } from '../actors/vhx';
import { VHXService } from '../services/VhxService';

export class AppConduit extends CoreRedprint<Context> implements VHXRedprint<Context> {
	public locals = new StrictObjectKVService('locals');
	public vhx = new VHXService('vhx');

	constructor(c: Context) {
		super(c);
	}
}

export const VHXActors = createVHXActors<AppConduit>();
export const GuardActors = createGuardActors<AppConduit>();
export const ModelerActors = createModelerActors<AppConduit>();
export const FetcherActors = createFetcherActors<AppConduit>();
export const StylingActors = createStylerActors<AppConduit>();
