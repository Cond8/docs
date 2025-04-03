import { Context } from 'hono';
import { z } from 'zod';
import { CoreRedprint } from '../../_core';

export const createGuardActors = <C8 extends CoreRedprint<Context>>() => {
	const Params = {
		Get: (schemaRecord: Record<string, z.KeySchema>) => ({
			Set: (callback: (name: string) => string) => (c8: C8) =>
				Object.entries(schemaRecord).reduce((c8, [key, schema]) => {
					const param = c8.body.req.param(key);
					const result = schema.safeParse(param);
					if (!result.success) {
						throw new Error(`Invalid parameter: ${key} - ${result.error.message}`);
					}
					c8.var(callback(key), result.data);
					return c8;
				}, c8),
		}),
	};

	return {
		Params,
	};
};
