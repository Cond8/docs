import { CoreRedprint, StrictKVBlueprintSync, StrictObjectKVService } from '../Cond8';

export class AppConduit extends CoreRedprint {
    public locals = new StrictObjectKVService('locals');

		constructor(body?: object) {
			super(body);
		}
}
