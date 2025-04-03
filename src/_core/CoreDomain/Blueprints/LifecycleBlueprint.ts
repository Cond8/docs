// src/_core/CoreDomain/Blueprints/LifecycleBlueprint.ts
import { CoreBlueprint } from './CoreBlueprint.js';

export enum LifecycleRuntime {
	Prod = 'prod',
	Test = 'test',
	Always = 'always',
}

export abstract class LifecycleBlueprint extends CoreBlueprint {
	protected constructor(
		protected readonly key: string,
		public runtime: LifecycleRuntime = LifecycleRuntime.Always,
		public isActive = true,
	) {
		super(key);
	}
}
