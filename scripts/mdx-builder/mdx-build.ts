import dedent from 'dedent';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileMDXtoJSX } from './mdx-compiler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.resolve(__dirname, '../../src/content');
const OUTPUT_DIR = path.resolve(__dirname, '../../src/content/dist');

async function buildAllMDX(): Promise<void> {
	const files = await fs.readdir(SOURCE_DIR);
	await fs.mkdir(OUTPUT_DIR, { recursive: true });

	for (const file of files) {
		if (!file.endsWith('.mdx') || file.startsWith('.')) continue;

		const sourcePath = path.join(SOURCE_DIR, file);
		const outputPath = path.join(OUTPUT_DIR, file.replace(/\.mdx$/, '.tsx'));

		const mdx = await fs.readFile(sourcePath, 'utf8');
		const jsx = await compileMDXtoJSX(mdx, { filepath: file });

		const output = dedent`
      /** Generated from ${file} **/
      export default function MDXContent(props: Record<string, unknown>) {
        ${jsx}
      }
    `;

		await fs.writeFile(outputPath, output, 'utf8');
		console.log(`✅ Built: ${file}`);
	}
}

buildAllMDX().catch(err => {
	console.error('❌ MDX build failed:', err);
	process.exit(1);
});
