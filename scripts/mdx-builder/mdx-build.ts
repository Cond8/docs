import dedent from 'dedent';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileMDXtoJSX } from './mdx-compiler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIRS = ['docs', 'blogs'];
const BASE_SOURCE = path.resolve(__dirname, '../../src/content');
const BASE_OUTPUT = path.resolve(BASE_SOURCE, 'dist');

async function buildAllMDX(): Promise<void> {
	await fs.mkdir(BASE_OUTPUT, { recursive: true });

	for (const dir of CONTENT_DIRS) {
		const dirPath = path.join(BASE_SOURCE, dir);
		const outputDir = path.join(BASE_OUTPUT, dir);
		await fs.mkdir(outputDir, { recursive: true });

		const files = await fs.readdir(dirPath);

		for (const file of files) {
			if (!file.endsWith('.mdx') || file.startsWith('.')) continue;

			const sourcePath = path.join(dirPath, file);
			const outputPath = path.join(outputDir, file.replace(/\.mdx$/, '.tsx'));

			const mdx = await fs.readFile(sourcePath, 'utf8');
			const jsx = await compileMDXtoJSX(mdx, { filepath: `${dir}/${file}` });

			const output = dedent`
        /** Generated from ${dir}/${file} **/
        export default function MDXContent(props: Record<string, unknown>) {
          ${jsx}
        }
      `;

			await fs.writeFile(outputPath, output, 'utf8');
			console.log(`✅ Built: ${dir}/${file}`);
		}
	}
}

buildAllMDX().catch(err => {
	console.error('❌ MDX build failed:', err);
	process.exit(1);
});
