import { LifecyclePayload } from '../CoreDomain/Blueprints/LifecycleBlueprint';
import { CoreRedprint } from '../CoreDomain/Redprints/CoreRedprint';

export class Vacuum<C8 extends CoreRedprint> {
	constructor(private _collected: object) {}

	get payload(): LifecyclePayload<C8> {
		return this._collected as LifecyclePayload<C8>;
	}

	add(collection: Partial<LifecyclePayload>) {
		this._collected = {
			...this._collected,
			...collection,
		};
	}
}
