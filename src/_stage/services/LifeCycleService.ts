import { CoreRedprint, LifecycleBlueprint, LifecyclePayload, OnActorExitHook, Recorder } from '../../_core';

export class LifeCycleService<C8 extends CoreRedprint> extends LifecycleBlueprint implements OnActorExitHook {
	constructor(key: string) {
		super(key);
	}

	onActorExit(payload: LifecyclePayload<C8>, recorder: Recorder) {
		recorder(payload.actorName || 'No actor name', payload.actorFn, payload.metadata);
	}

	get readonly(): unknown {
		return undefined;
	}
}
