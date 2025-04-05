// scripts/build-client.ts
import { transformFile } from '@swc/core';
import chokidar from 'chokidar';
import fs from 'fs/promises';
import path from 'path';

const inputDir = path.resolve('scripts');
const outputDir = path.resolve('public/scripts');

const buildFile = async (filePath: string) => {
	const rel = path.relative(inputDir, filePath);
	const outPath = path.join(outputDir, rel.replace(/\.tsx?$/, '.js'));

	const { code } = await transformFile(filePath, {
		jsc: {
			parser: {
				syntax: 'typescript',
				tsx: true,
			},
			transform: {
				react: {
					runtime: 'automatic', // for JSX hooks
					importSource: 'preact',
				},
			},
			target: 'es2020',
		},
		module: {
			type: 'es6',
		},
		sourceMaps: false,
	});

	await fs.mkdir(path.dirname(outPath), { recursive: true });
	await fs.writeFile(outPath, code);
	console.log(`🌀 Built: ${rel}`);
};

const run = async () => {
	const watcher = chokidar.watch(`${inputDir}/**/*.{ts,tsx}`, {
		ignoreInitial: false,
	});

	watcher.on('add', buildFile);
	watcher.on('change', buildFile);
};

run();
