// src/_core/CoreDomain/Redprints/ConduitUtils.ts
import { diff } from 'jest-diff';
import { FullLifecycleBlueprint } from '../../Lifecycle/LifecycleEventHooks';
import { C8Error } from '../../Recorder/C8Error';
import { RecorderEntry } from '../../Recorder/create-recorder';
import { LifecyclePayload } from '../../Recorder/Vacuum';
import { CoreBlueprint } from '../Blueprints/CoreBlueprint.js';
import { LifecycleBlueprint } from '../Blueprints/LifecycleBlueprint.js';
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

	close(
		payload: LifecyclePayload<C8>,
		directorPayload: LifecyclePayload<C8>,
		error?: Error,
		recording?: RecorderEntry[],
	): C8Error<C8> | void {
		for (const [, layer] of this._allBlueprintLayers()) {
			layer.close();
		}
		this.#closed = true;
		if (!error) return;
		return new C8Error<C8>(error, payload, directorPayload, recording);
	}

	async handleEvent(event: keyof FullLifecycleBlueprint<C8>, payload: Partial<LifecyclePayload<C8>>): Promise<void> {
		const recorder = payload.recorder;
		payload.event = event;
		const payloadCopy = { ...payload } as LifecyclePayload<C8>;
		for (const [key, layer] of this._allLifecycleBlueprintLayers()) {
			try {
				switch (event) {
					case 'onEnter':
						if (layer.onEnter) await layer.onEnter(payloadCopy, recorder);
						break;
					case 'onExit':
						if (layer.onExit) await layer.onExit(payloadCopy, recorder);
						break;

					case 'onDirectorEnter':
						if (layer.onDirectorEnter) await layer.onDirectorEnter(payloadCopy, recorder);
						break;
					case 'onDirectorExit':
						if (layer.onDirectorExit) await layer.onDirectorExit(payloadCopy, recorder);
						break;

					case 'onActorEnter':
						if (layer.onActorEnter) await layer.onActorEnter(payloadCopy, recorder);
						break;
					case 'onActorExit':
						if (layer.onActorExit) await layer.onActorExit(payloadCopy, recorder);
						break;
					case 'onActorError':
						if (layer.onActorError) await layer.onActorError(payloadCopy, recorder);
						break;

					case 'onActorAssertStart':
						if (layer.onActorAssertStart) await layer.onActorAssertStart(payloadCopy, recorder);
						break;
					case 'onActorAssertSuccess':
						if (layer.onActorAssertSuccess) await layer.onActorAssertSuccess(payloadCopy, recorder);
						break;
					case 'onActorAssertFail':
						if (layer.onActorAssertFail) await layer.onActorAssertFail(payloadCopy, recorder);
						break;

					case 'onDirectorAssertStart':
						if (layer.onDirectorAssertStart) await layer.onDirectorAssertStart(payloadCopy, recorder);
						break;
					case 'onDirectorAssertSuccess':
						if (layer.onDirectorAssertSuccess) await layer.onDirectorAssertSuccess(payloadCopy, recorder);
						break;
					case 'onDirectorAssertFail':
						if (layer.onDirectorAssertFail) await layer.onDirectorAssertFail(payloadCopy, recorder);
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
