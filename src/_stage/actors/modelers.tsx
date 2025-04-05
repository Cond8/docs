// src/_stage/actors/modelers.ts
import Markdown from 'markdown-to-jsx';
import { CoreRedprint, createRole } from '../../_core';
import { Components } from '../components/md-components';

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
			Do: (mdComponents: Components) => ({
				Set: (setKey: string) =>
					createRole<C8>(
						'Render Markdown to JSX',
						'Converts a Markdown string into JSX using markdown-to-jsx.',
					)((c8, recorder) => {
						const markdownString = c8.var.string(getKey);
						recorder?.('markdownString', markdownString);

						const markdownJsx = <Markdown options={{ overrides: mdComponents }}>{markdownString}</Markdown>;

						console.log(markdownJsx);

						c8.var(setKey, markdownJsx);
						return c8;
					}),
			}),
		}),
	};

	const Default = (callback: (c8: C8) => C8) => (c8: C8) => callback(c8);

	return Object.assign(Default, {
		String,
		MD,
	});
};
