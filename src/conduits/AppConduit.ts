// src/conduits/AppConduit.ts
import { CoreRedprint, StrictKVBlueprintSync, StrictObjectKVService } from '../_core';

export class AppConduit extends CoreRedprint {
    public locals = new StrictObjectKVService('locals');

		constructor(body?: object) {
			super(body);
		}
}
