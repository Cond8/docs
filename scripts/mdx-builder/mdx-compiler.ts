import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { VFile } from 'vfile';

export async function compileMDXtoHTML(mdxSource: string, options: { filepath?: string } = {}): Promise<string> {
	const file = new VFile({ value: mdxSource, path: options.filepath });

	try {
		const result = await unified()
			.use(remarkParse) // parse markdown
			.use(remarkGfm) // github flavored markdown
			.use(remarkFrontmatter) // frontmatter
			.use(remarkRehype, { allowDangerousHtml: true }) // convert to HTML AST
			.use(rehypeSlug) // add ids to headings
			.use(rehypeAutolinkHeadings) // add anchor links
			.use(rehypeStringify, { allowDangerousHtml: true }) // serialize HTML
			.process(file);

		return String(result.value);
	} catch (err: any) {
		console.error('❌ MDX to HTML compilation failed:', file.path);
		if (err?.message) console.error(err.message);
		throw err;
	}
}
