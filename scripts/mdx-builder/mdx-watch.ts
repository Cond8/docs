import chokidar from 'chokidar';
import { ChildProcess, spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let subprocess: ChildProcess | null = null;

function rebuild(): void {
	if (subprocess) subprocess.kill();
	const buildPath = path.join(__dirname, 'mdx-build.ts');
	subprocess = spawn('tsx', [buildPath], { stdio: 'inherit' });

	subprocess.on('exit', code => {
		if (code !== 0) {
			console.error(`🚨 Build failed with exit code ${code}`);
		}
	});
}

console.log('👀 Watching MDX files...');
chokidar
	.watch(path.resolve(__dirname, '../../src/_stage/content/**/*.mdx'), {
		persistent: true,
		ignoreInitial: false,
	})
	.on('all', (event, filePath) => {
		console.log(`📄 ${event}: ${filePath}`);
		rebuild();
	});
