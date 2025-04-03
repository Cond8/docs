// src/_core/CoreDomain/Redprints/ConduitUtils.ts
import { diff } from 'jest-diff';
import { FullLifecycleBlueprint } from '../../Lifecycle/LifecycleEventHooks';
import { CoreBlueprint } from '../Blueprints/CoreBlueprint.js';
import { LifecycleBlueprint, LifecyclePayload } from '../Blueprints/LifecycleBlueprint.js';
import { CoreRedprint } from './CoreRedprint.js';

export type ReadonlyState = {
	var: <T>(key: PropertyKey) => T;
	string: (key: PropertyKey) => string;
	[key: string]: unknown;
};

export class ConduitUtils<C8 extends CoreRedprint> {
	#closed = false;
	#lastReadonly: Record<string, unknown> = {};

	constructor(readonly c8: C8) {}

	get isClosed(): boolean {
		return this.#closed;
	}

	get readonly(): ReadonlyState {
		const readonly: Record<string, unknown> = {};
		for (const [key, layer] of this._allBlueprintLayers()) {
			readonly[key] = layer.readonly;
		}
		return {
			var: <T>(key: PropertyKey): T => this.c8.var(key) as T,
			string: (key: PropertyKey): string => String(this.c8.var(key)),
			...readonly,
		};
	}

	stringify(): string {
		const state = this.readonly;
		return JSON.stringify(state, null, 2);
	}

	diff(): string {
		const current = this.readonly;
		const result = diff(this.#lastReadonly, current);
		this.#lastReadonly = current;
		return result ?? '[No changes in diff]';
	}

	close(): void {
		for (const [, layer] of this._allBlueprintLayers()) {
			layer.close();
		}
		this.#closed = true;
	}

	async handleEvent(event: keyof FullLifecycleBlueprint<C8>, payload: LifecyclePayload<C8>): Promise<void> {
		const recorder = payload.recorder;
		for (const [key, layer] of this._allLifecycleBlueprintLayers()) {
			try {
				switch (event) {
					case 'onEnter':
						if (layer.onEnter) await layer.onEnter(payload, recorder);
						break;
					case 'onExit':
						if (layer.onExit) await layer.onExit(payload, recorder);
						break;

					case 'onDirectorEnter':
						if (layer.onDirectorEnter) await layer.onDirectorEnter(payload, recorder);
						break;
					case 'onDirectorExit':
						if (layer.onDirectorExit) await layer.onDirectorExit(payload, recorder);
						break;

					case 'onActorEnter':
						if (layer.onActorEnter) await layer.onActorEnter(payload, recorder);
						break;
					case 'onActorExit':
						if (layer.onActorExit) await layer.onActorExit(payload, recorder);
						break;
					case 'onActorError':
						if (layer.onActorError) await layer.onActorError(payload, recorder);
						break;

					case 'onActorAssertStart':
						if (layer.onActorAssertStart) await layer.onActorAssertStart(payload, recorder);
						break;
					case 'onActorAssertSuccess':
						if (layer.onActorAssertSuccess) await layer.onActorAssertSuccess(payload, recorder);
						break;
					case 'onActorAssertFail':
						if (layer.onActorAssertFail) await layer.onActorAssertFail(payload, recorder);
						break;

					case 'onDirectorAssertStart':
						if (layer.onDirectorAssertStart) await layer.onDirectorAssertStart(payload, recorder);
						break;
					case 'onDirectorAssertSuccess':
						if (layer.onDirectorAssertSuccess) await layer.onDirectorAssertSuccess(payload, recorder);
						break;
					case 'onDirectorAssertFail':
						if (layer.onDirectorAssertFail) await layer.onDirectorAssertFail(payload, recorder);
						break;

					default:
						console.log('Unhandled event:', key, event);
				}
			} catch (error) {
				console.error('Error handling event:', key, event);
				console.error(error);
			}
		}
	}

	// === Internal iterators ===

	private *_allBlueprintLayers(): Generator<[string, CoreBlueprint]> {
		for (const [key, value] of Object.entries(this.c8)) {
			if (value instanceof CoreBlueprint) yield [key, value];
		}
	}

	private *_allLifecycleBlueprintLayers(): Generator<[string, FullLifecycleBlueprint<C8>]> {
		for (const [key, layer] of this._allBlueprintLayers()) {
			if (layer instanceof LifecycleBlueprint && layer.isActive) {
				yield [key, layer as unknown as FullLifecycleBlueprint<C8>];
			}
		}
	}
}
