import { compile } from '@mdx-js/mdx';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import { VFile } from 'vfile';

export async function compileMDXtoJSX(mdxSource: string, options: { filepath?: string } = {}): Promise<string> {
	const file = new VFile({ value: mdxSource, path: options.filepath });

	try {
		const result = await compile(file, {
			jsx: true,
			outputFormat: 'function-body',
			providerImportSource: null,
			format: 'mdx',
			remarkPlugins: [remarkGfm, remarkFrontmatter],
			rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
		});

		return String(result.value);
	} catch (err: any) {
		console.error('❌ MDX compilation failed:', file.path);
		if (err?.message) console.error(err.message);
		throw err;
	}
}
