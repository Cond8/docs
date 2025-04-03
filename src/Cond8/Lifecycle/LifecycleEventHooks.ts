// packages/_core/src/Lifecycle/LifecycleEventHooks.ts
import { LifecyclePayload } from '../CoreDomain/Blueprints/LifecycleBlueprint.js';
import { CoreRedprint } from '../CoreDomain/Redprints/CoreRedprint.js';
import { CouldPromise } from '../utils/fn-promise-like.js';

export interface OnEnterHook<C8 extends CoreRedprint = CoreRedprint> {
  onEnter(payload: LifecyclePayload<C8>): CouldPromise<void>;
}

export interface OnExitHook<C8 extends CoreRedprint = CoreRedprint> {
  onExit(payload: LifecyclePayload<C8>): CouldPromise<void>;
}

export interface OnDirectorEnterHook<C8 extends CoreRedprint = CoreRedprint> {
  onDirectorEnter(payload: LifecyclePayload<C8>): CouldPromise<void>;
}

export interface OnDirectorExitHook<C8 extends CoreRedprint = CoreRedprint> {
  onDirectorExit(payload: LifecyclePayload<C8>): CouldPromise<void>;
}

export interface OnActorEnterHook<C8 extends CoreRedprint = CoreRedprint> {
  onActorEnter(payload: LifecyclePayload<C8>): CouldPromise<void>;
}

export interface OnActorExitHook<C8 extends CoreRedprint = CoreRedprint> {
  onActorExit(payload: LifecyclePayload<C8>): CouldPromise<void>;
}

export interface OnActorErrorHook<C8 extends CoreRedprint = CoreRedprint> {
  onActorError(payload: LifecyclePayload<C8>): CouldPromise<void>;
}

export interface OnActorAssertStartHook<
  C8 extends CoreRedprint = CoreRedprint,
> {
  onActorAssertStart(payload: LifecyclePayload<C8>): CouldPromise<void>;
}

export interface OnActorAssertSuccessHook<
  C8 extends CoreRedprint = CoreRedprint,
> {
  onActorAssertSuccess(payload: LifecyclePayload<C8>): CouldPromise<void>;
}

export interface OnActorAssertFailHook<C8 extends CoreRedprint = CoreRedprint> {
  onActorAssertFail(payload: LifecyclePayload<C8>): CouldPromise<void>;
}

export interface OnDirectorAssertStartHook<
  C8 extends CoreRedprint = CoreRedprint,
> {
  onDirectorAssertStart(payload: LifecyclePayload<C8>): CouldPromise<void>;
}

export interface OnDirectorAssertSuccessHook<
  C8 extends CoreRedprint = CoreRedprint,
> {
  onDirectorAssertSuccess(payload: LifecyclePayload<C8>): CouldPromise<void>;
}

export interface OnDirectorAssertFailHook<C8 extends CoreRedprint = CoreRedprint> {
  onDirectorAssertFail(payload: LifecyclePayload<C8>): CouldPromise<void>;
}
