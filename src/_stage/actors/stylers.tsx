import { Context } from 'hono';
import { MDXComponents, MDXContent } from 'mdx/types';
import { CoreRedprint } from '../../_core';

export const createStylerActors = <C8 extends CoreRedprint<Context>>() => {
	const MDXContentElement = {
		Get: (getKey: string) => ({
			Do: (components: MDXComponents) => ({
				Set: (setKey: string) => async (c8: C8) => {
					const MDXContent = c8.var(getKey) as MDXContent;

					const element = (
						<div className="prose prose-invert max-w-none">
							<MDXContent components={components} />
						</div>
					);

					// Store the resulting JSX.Element
					c8.var(setKey, element);

					return c8;
				},
			}),
		}),
	};

	return {
		MDXContentElement,
	};
};
