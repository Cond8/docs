// src/_core/CoreDomain/Blueprints/LifecycleBlueprint.ts
import { FullLifecycleBlueprint } from '../../Lifecycle/LifecycleEventHooks';
import { MetaHook } from '../../Metadata/hooks';
import { Recorder } from '../../Recorder/create-recorder.js';
import { CoreRedprint } from '../Redprints/CoreRedprint.js';
import { CoreBlueprint } from './CoreBlueprint.js';

export enum LifecycleRuntime {
	Prod = 'prod',
	Test = 'test',
	Always = 'always',
}

export interface LifecyclePayload<C8 extends CoreRedprint = CoreRedprint> {
	event: keyof FullLifecycleBlueprint<C8>;
	isTest?: boolean;

	directorName?: string;
	actorName?: string;

	c8: C8;
	recorder?: Recorder;

	hooks?: MetaHook[];

	inputMapper?: string;
	outputMapper?: string;

	input?: unknown;
	error?: Error;
	output?: unknown;

	metadata?: unknown[];

	actorFn?: string; // fn.toString()
	assertFn?: string; // fn.toString()
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
