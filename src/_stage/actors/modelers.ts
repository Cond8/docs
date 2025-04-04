// src/_stage/actors/modelers.ts
import { Context } from 'hono';
import { JSX } from 'preact';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { CoreRedprint, createRole } from '../../_core';
import { Components } from '../components/md-components';
import remarkSlots from '../utils/markdown/remark-slots';
import { transformToJSX } from '../utils/markdown/transform-to-jsx';

export const createModelerActors = <C8 extends CoreRedprint<Context>>() => {
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

	const MD = {
		Get: (getKey: string) => ({
			Do: (mdComponents: Components) => ({
				Set: (setKey: string) =>
					createRole<C8>(
						'From MD to JSX',
						'this is supposed to change markdownString into MDAST and then into JSX',
						'the remark slots plugin is used to parse custom slots',
					)(async (c8, recorder) => {
						const markdownString = c8.var(getKey) as string;

						const file = await unified()
							.use(remarkParse) // Markdown → MDAST
							.use(remarkSlots) // MDAST → MDAST (custom slot parsing)
							.use(transformToJSX(mdComponents)) // MDAST → JSX (your custom renderer)
							.process(markdownString);

						const markdownJsx = file.result as JSX.Element;

						c8.var(setKey, markdownJsx);
						return c8;
					}),
			}),
		}),
	};

	return {
		String,
		MD,
	};
};
