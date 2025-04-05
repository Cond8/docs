// src/_stage/services/LifeCycleService.ts
import { CoreRedprint, LifecycleBlueprint, LifecyclePayload, OnActorEnterHook, Recorder } from '../../_core';

export class LifeCycleService<C8 extends CoreRedprint> extends LifecycleBlueprint implements OnActorEnterHook {
	constructor(key: string) {
		super(key);
	}

	onActorEnter(payload: LifecyclePayload<C8>, recorder?: Recorder) {
		recorder?.('RECITAL:', payload.actorName || 'No actor name', payload.actorFn, payload.metadata);
	}

	get readonly(): unknown {
		return undefined;
	}
}
