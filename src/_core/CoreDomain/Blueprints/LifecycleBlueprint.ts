// src/_core/CoreDomain/Blueprints/LifecycleBlueprint.ts
import { Recorder } from '../../Recorder/create-recorder.js';
import { CouldPromise } from '../../utils/fn-promise-like.js';
import { CoreRedprint } from '../Redprints/CoreRedprint.js';
import { CoreBlueprint } from './CoreBlueprint.js';

export enum LifecycleRuntime {
  Prod = 'prod',
  Test = 'test',
  Always = 'always',
}

export interface LifecyclePayload<C8 extends CoreRedprint = CoreRedprint> {
  event: keyof LifecycleBlueprint<C8>;
  isTest?: boolean;

  directorName?: string;
  actorName?: string;

  c8: C8;
  recorder?: Recorder;

  input?: unknown;
  error?: Error;
  output?: unknown;

  metadata?: unknown[];

  actorFn?: string; // fn.toString()
  assertionFn?: string; // fn.toString()
}

export abstract class LifecycleBlueprint<
  C8 extends CoreRedprint,
> extends CoreBlueprint {
  protected constructor(
    protected readonly key: string,
    public runtime: LifecycleRuntime = LifecycleRuntime.Always,
    public isActive = true,
  ) {
    super(key);
  }

  abstract onEnter?(payload: LifecyclePayload<C8>): CouldPromise<void>;
  abstract onExit?(payload: LifecyclePayload<C8>): CouldPromise<void>;

  abstract onDirectorEnter?(payload: LifecyclePayload<C8>): CouldPromise<void>;
  abstract onDirectorExit?(payload: LifecyclePayload<C8>): CouldPromise<void>;

  abstract onActorEnter?(payload: LifecyclePayload<C8>): CouldPromise<void>;
  abstract onActorExit?(payload: LifecyclePayload<C8>): CouldPromise<void>;
  abstract onActorError?(payload: LifecyclePayload<C8>): CouldPromise<void>;

  abstract onActorAssertStart?(
    payload: LifecyclePayload<C8>,
  ): CouldPromise<void>;
  abstract onActorAssertSuccess?(
    payload: LifecyclePayload<C8>,
  ): CouldPromise<void>;
  abstract onActorAssertFail?(
    payload: LifecyclePayload<C8>,
  ): CouldPromise<void>;

  abstract onDirectorAssertStart?(
    payload: LifecyclePayload<C8>,
  ): CouldPromise<void>;
  abstract onDirectorAssertSuccess?(
    payload: LifecyclePayload<C8>,
  ): CouldPromise<void>;
  abstract onDirectorAssertFail?(
    payload: LifecyclePayload<C8>,
  ): CouldPromise<void>;
}
