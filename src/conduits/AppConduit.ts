// src/conduits/AppConduit.ts
import { CoreRedprint, StrictKVBlueprintSync, StrictObjectKVService } from '../_core';
import { createVHXActors } from '../actors/vhx';

export class AppConduit extends CoreRedprint {
    public locals = new StrictObjectKVService('locals');

		constructor(body?: object) {
			super(body);
		}
}

export const VHXActors = createVHXActors<AppConduit>()
