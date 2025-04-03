// src/_stage/conduits/AppConduit.ts
import { CoreRedprint, StrictKVBlueprintSync, StrictObjectKVService } from '../../_core';
import { createVHXActors } from '../actors/vhx';
import { VHXRedprint } from '../redprints/VHXRedprint';
import { VHXService } from '../services/VhxService';

export class AppConduit extends VHXRedprint {
	public locals = new StrictObjectKVService('locals');
	public vhx = new VHXService('vhx');

	constructor(body?: object) {
		super(body);
	}
}

export const VHXActors = createVHXActors<AppConduit>()
