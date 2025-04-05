import { compile, run } from '@mdx-js/mdx';
import { MDXContent } from 'mdx/types.js'; // optional if you want typings
import { Fragment, h } from 'preact';
import { render } from 'preact-render-to-string';

export async function compileMDXtoHTML(mdxSource: string, options: { baseUrl: string }): Promise<string> {
	try {
		const compiled = await compile(mdxSource, {
			outputFormat: 'function-body',
			format: 'mdx',
			jsx: true,
		});

		const module = await run(compiled, {
			baseUrl: options.baseUrl,
			jsx: h,
			jsxs: h,
			Fragment,
		});

		const Content = module.default as MDXContent;

		return render(h('div', { class: 'prose prose-invert max-w-none' }, h(Content, {})));
	} catch (err: any) {
		console.error('❌ MDX to HTML compilation failed');
		if (err?.message) console.error(err.message);
		throw err;
	}
}
