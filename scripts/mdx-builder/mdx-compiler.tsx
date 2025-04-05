// scripts/mdx-builder/mdx-compiler.tsx
import { compile, run } from '@mdx-js/mdx';
import { MDXComponents } from 'mdx/types';
import { Fragment, h } from 'preact';
import { render } from 'preact-render-to-string';
import { mdxComponents } from './mdx-components';

type Options = {
	baseUrl?: string;
	components?: MDXComponents;
};

export async function compileMDXtoHTML(mdxSource: string, { components = mdxComponents }: Options = {}): Promise<string> {
	const compiled = await compile(mdxSource, {
		outputFormat: 'function-body',
	});
	const { default: MDXContent } = await run(compiled, {
		Fragment,
		jsx: h,
		jsxs: h,
		baseUrl: new URL('../../src/_stage/content/docs/', import.meta.url).href,
	});

	return render(
		<div className="prose prose-invert max-w-none">
			<MDXContent components={components} />
		</div>,
	);
}
