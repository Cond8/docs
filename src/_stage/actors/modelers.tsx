// src/_stage/actors/modelers.tsx
import { CoreRedprint } from '../../_core';

export const createModelerActors = <C8 extends CoreRedprint>() => {
	const String = {
		Get: (getKey: string) => ({
			Do: (action: (str: string) => string) => ({
				Set: (setKey: string) => (c8: C8) => {
					const value = c8.var.string(getKey);
					const result = action(value);
					c8.var.string(setKey, result);
					return c8;
				},
			}),
		}),
	};

	const Default = (callback: (c8: C8) => C8) => (c8: C8) => callback(c8);

	return Object.assign(Default, {
		String,
	});
};
