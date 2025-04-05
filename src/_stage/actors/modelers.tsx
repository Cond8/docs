// src/_stage/actors/modelers.ts
import { micromark } from 'micromark';
import { CoreRedprint, createRole } from '../../_core';

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

	const MD = {
		Get: (getKey: string) => ({
			Set: (setKey: string) =>
				createRole<C8>(
					'Render Markdown to HTML',
					'Converts a Markdown string into raw HTML for .markdown CSS styling.',
				)((c8, recorder) => {
					const markdownString = c8.var.string(getKey);
					recorder?.('markdownString', markdownString);

					const html = micromark(markdownString);
					recorder?.('html', html);

					c8.var(setKey, html);

					return c8;
				}),
		}),
	};

	const Default = (callback: (c8: C8) => C8) => (c8: C8) => callback(c8);

	return Object.assign(Default, {
		String,
		MD,
	});
};
