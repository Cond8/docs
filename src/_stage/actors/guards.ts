// src/_stage/actors/guards.ts
import { Context } from 'hono';
import { z } from 'zod';
import { CoreRedprint } from '../../_core';

export const createGuardActors = <C8 extends CoreRedprint<Context>>() => {
	const Params = {
		Check: (schemaRecord: Record<string, z.KeySchema>) => ({
			SetEntries:
				<V>(callback: (key: string, value: V) => [string, V]) =>
				(c8: C8) =>
					Object.entries(schemaRecord).reduce((c8, [key, schema]) => {
						const param = c8.body.req.param(key);
						const result = schema.safeParse(param);
						if (!result.success) {
							throw new Error(`Invalid parameter: ${key} - ${result.error.message}`);
						}
						c8.var(...callback(key, result.data as V));
						return c8;
					}, c8),
		}),
	};

	const Body = {
		Check: (schemaRecord: Record<string, z.KeySchema>) => ({
			SetEntries:
				<V>(callback: (key: string, value: V) => [string, V]) =>
				async (c8: C8) => {
					const json = await c8.body.req.json();
					return Object.entries(schemaRecord).reduce((c8, [key, schema]) => {
						const bodyValue = json[key];
						const result = schema.safeParse(bodyValue);
						if (!result.success) {
							throw new Error(`Invalid body value: ${key} - ${result.error.message}`);
						}
						c8.var(...callback(key, result.data as V));
						return c8;
					}, c8);
				},
		}),
	};

	return {
		Params,
		Body,
	};
};
