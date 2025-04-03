// src/_core/CoreDomain/Redprints/CoreRedprint.ts
import { CoreBlueprint } from '../Blueprints/CoreBlueprint.js';
import { StrictKVBlueprintSync } from '../Blueprints/StrictKVBlueprint-Sync.js';
import { StrictKVBlueprint } from '../Blueprints/StrictKVBlueprint.js';
import { ConduitUtils } from './ConduitUtils.js';

export abstract class CoreRedprint<T> {
	public readonly utils: ConduitUtils<this>;

	public abstract locals: StrictKVBlueprintSync;
	public cache?: StrictKVBlueprint;
	[key: symbol]: CoreBlueprint;

	protected constructor(readonly body: T) {
		this.utils = new ConduitUtils(this);
	}

	public var<V>(key: PropertyKey, value?: V): V | undefined {
		if (value === undefined) {
			return this.locals.get(key) as V;
		}
		this.locals.set(key, value);
	}
}
