// scripts/mdx-builder/mdx-watch.ts
import chokidar from 'chokidar';
import { ChildProcess, spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __watchDir = path.resolve(__dirname, '../../src/_stage/content');

console.log(__watchDir);

let subprocess: ChildProcess | null = null;

function rebuild(): void {
	console.log('🔁 Rebuilding...');
	if (subprocess) subprocess.kill();
	const buildPath = path.join(__dirname, 'mdx-build.ts');
	subprocess = spawn('pnpm', ['exec', 'tsx', buildPath], { stdio: 'inherit', shell: true });

	subprocess.on('exit', code => {
		if (code !== 0) {
			console.error(`🚨 Build failed with exit code ${code}`);
		}
	});
}

console.log('👀 Watching MDX files...');
chokidar
	.watch(__watchDir, {
		persistent: true,
		ignoreInitial: false,
	})
	.on('all', (event, filePath) => {
		console.log(`📄 ${event}: ${filePath}`);
		rebuild();
	});
