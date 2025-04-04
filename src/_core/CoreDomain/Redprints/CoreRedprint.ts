// src/_core/CoreDomain/Redprints/CoreRedprint.ts
import { CoreBlueprint } from '../Blueprints/CoreBlueprint.js';
import { StrictKVBlueprintSync } from '../Blueprints/StrictKVBlueprint-Sync.js';
import { StrictKVBlueprint } from '../Blueprints/StrictKVBlueprint.js';
import { ConduitUtils } from './ConduitUtils.js';

export abstract class CoreRedprint<T extends object = object> {
	public readonly utils: ConduitUtils<this>;

	public abstract locals: StrictKVBlueprintSync;
	public cache?: StrictKVBlueprint;
	[key: symbol]: CoreBlueprint;

	protected constructor(readonly body: T) {
		this.utils = new ConduitUtils(this);
	}

	get var() {
		const defaultVar = <V>(key: PropertyKey, value?: V): V => {
			if (value === undefined) {
				return this.locals.get(key) as V;
			}
			this.locals.set(key, value);
			return value;
		};

		const checkedVar = <V>(check: (val: unknown) => val is V, typeName: string) => {
			return (key: PropertyKey, value?: V): V => {
				if (value === undefined) {
					const current = this.locals.get(key);
					if (!check(current)) {
						throw new Error(`Expected ${String(key)} to be a ${typeName}, but got ${typeof current}`);
					}
					return current;
				}
				if (!check(value)) {
					throw new Error(`Cannot set ${String(key)}: expected ${typeName}, got ${typeof value}`);
				}
				this.locals.set(key, value);
				return value;
			};
		};

		return Object.assign(defaultVar, {
			string: checkedVar<string>((x): x is string => typeof x === 'string', 'string'),
			number: checkedVar<number>((x): x is number => typeof x === 'number', 'number'),
			boolean: checkedVar<boolean>((x): x is boolean => typeof x === 'boolean', 'boolean'),
			functional: checkedVar<(...args: unknown[]) => unknown>(
				(x): x is (...args: unknown[]) => unknown => typeof x === 'function',
				'function',
			),
		});
	}
}
