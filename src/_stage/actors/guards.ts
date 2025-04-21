// src/_stage/actors/guards.ts
import { Context } from 'hono';
import { z } from 'zod';
import { CoreRedprint } from '../../_core';
import { StagedActor } from '../../_core/CoreInfra/create-actor';
import { createDirector } from '../../_core/CoreInfra/create-director';
import { LifecyclePayload } from '../../_core/Lifecycle/Vacuum';
import { Recorder } from '../../_core/Recorder/create-recorder';

const ParamsSetEntries =
	<C8 extends CoreRedprint<Context>, V>(schemaRecord: Record<string, z.KeySchema>, callback: (key: string, value: V) => [string, V]) =>
	(c8: C8) =>
		Object.entries(schemaRecord).reduce((c8, [key, schema]) => {
			const param = c8.body.req.param(key);
			const result = schema.safeParse(param);
			if (!result.success) {
				throw new Error(`Invalid parameter: ${key} - ${result.error.message}`);
			}
			c8.var(...callback(key, result.data as V));
			return c8;
		}, c8);

const ParamsCatch =
	<C8 extends CoreRedprint<Context>, V>(schemaRecord: Record<string, z.KeySchema>, callback: (key: string, value: V) => [string, V]) =>
	(...actors: StagedActor<C8>[]) => {
		const CatchActor = createDirector<C8>('Catch')(...actors).AsActor;
		return (c8: C8, recorder: Recorder | undefined, directorPayload: LifecyclePayload<C8>) => {
			return Object.entries(schemaRecord).reduce((c8, [key, schema]) => {
				const param = c8.body.req.param(key);
				const result = schema.safeParse(param);
				if (!result.success) {
					return CatchActor(c8, recorder, directorPayload) as C8;
				}
				c8.var(...callback(key, result.data as V));
				return c8;
			}, c8);
		};
	};

const BodySetEntries =
	<C8 extends CoreRedprint<Context>, V>(schemaRecord: Record<string, z.KeySchema>, callback: (key: string, value: V) => [string, V]) =>
	async (c8: C8) => {
		const json = await c8.body.req.parseBody();
		return Object.entries(schemaRecord).reduce((c8, [key, schema]) => {
			const bodyValue = json[key];
			const result = schema.safeParse(bodyValue);
			if (!result.success) {
				throw new Error(`Invalid body value: ${key} - ${result.error.message}`);
			}
			c8.var(...callback(key, result.data as V));
			return c8;
		}, c8);
	};

const BodyCatch =
	<C8 extends CoreRedprint<Context>, V>(schemaRecord: Record<string, z.KeySchema>, callback: (key: string, value: V) => [string, V]) =>
	(...actors: StagedActor<C8>[]) => {
		const CatchActor = createDirector<C8>('Catch')(...actors).AsActor;
		return async (c8: C8, recorder: Recorder | undefined, directorPayload: LifecyclePayload<C8>) => {
			const json = await c8.body.req.parseBody();
			return Object.entries(schemaRecord).reduce((c8, [key, schema]) => {
				const bodyValue = json[key];
				const result = schema.safeParse(bodyValue);
				if (!result.success) {
					return CatchActor(c8, recorder, directorPayload) as C8;
				}
				c8.var(...callback(key, result.data as V));
				return c8;
			}, c8);
		};
	};

export const createGuardActors = <C8 extends CoreRedprint<Context>>() => {
	const Params = {
		Check: (schemaRecord: Record<string, z.KeySchema>) => ({
			SetEntries: <V>(callback: (key: string, value: V) => [string, V]) =>
				Object.assign(ParamsSetEntries<C8, V>(schemaRecord, callback), {
					Catch: ParamsCatch<C8, V>(schemaRecord, callback),
				}),
		}),
	};

	const Body = {
		Check: (schemaRecord: Record<string, z.KeySchema>) => ({
			SetEntries: <V>(callback: (key: string, value: V) => [string, V]) =>
				Object.assign(BodySetEntries<C8, V>(schemaRecord, callback), {
					Catch: BodyCatch<C8, V>(schemaRecord, callback),
				}),
		}),
	};

	return {
		Params,
		Body,
	};
};
