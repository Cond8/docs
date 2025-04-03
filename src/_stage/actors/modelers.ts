import { compile, run } from '@mdx-js/mdx';
import { Context } from 'hono';
import { Fragment, h } from 'preact';
import { CoreRedprint } from '../../_core';

export const createModelerActors = <C8 extends CoreRedprint<Context>>() => {
	const String = {
		Get: (getKey: string) => ({
			Do: (action: (str: string) => string) => ({
				Set: (setKey: string) => (c8: C8) => {
					const value = c8.var(getKey) as string;
					const result = action(value);
					c8.var(setKey, result);
					return c8;
				},
			}),
		}),
	};

	const MDX = {
		Get: (getKey: string) => ({
			MDXContentElement: {
				Set: (setKey: string) => async (c8: C8) => {
					const mdx = c8.var(getKey) as string;
					const compiled = await compile(mdx, {
						outputFormat: 'function-body',
						jsx: true,
						jsxRuntime: 'automatic',
						jsxImportSource: 'preact',
						development: true,
					});
					const { default: MDXContentElement } = await run(compiled, {
						Fragment,
						jsx: h,
						jsxs: h,
					});

					c8.var(setKey, MDXContentElement);
					return c8;
				},
			},
		}),
	};

	return {
		String,
		MDX,
	};
};
