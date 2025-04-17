// src/index.ts
import { DurableObject } from 'cloudflare:workers';
import { Hono } from 'hono';
import { C8Error } from './_core/Recorder/C8Error';
import { cors } from './_stage/middleware/cors';
import { LifeReloadServer } from './_stage/utils/life-reload-server';
import DocsFragment from './directors/docs-fragment';
import DocsPages from './directors/docs-pages';
import ErrorHandlerDirector from './directors/error-handler';
import LandingPageDirector from './directors/landing-page';
import { Gpt4_1NanoProxy } from './routes/openai-proxy';

export class MyDurableObject extends DurableObject {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async sayHello(name: string): Promise<string> {
		return `Hello, ${name}!`;
	}
}

// ---- App Setup ----

type Env = {
	MY_DURABLE_OBJECT: DurableObjectNamespace<MyDurableObject>;
};

const app = new Hono<{ Bindings: Env }>();

// WebSocket endpoint for live reload
app.get('/live-reload', LifeReloadServer);

// Apply CORS middleware globally
app.use(
	'*',
	cors({
		origin: ['https://cond8-offline.pages.dev', 'http://localhost:5173'],
		methods: ['GET', 'POST', 'OPTIONS'],
		allowedHeaders: ['Content-Type'],
		credentials: true,
	}),
);

app.get('/app/*', async c => {
	const url = new URL(c.req.url);
	const proxiedPath = url.pathname.replace(/^\/app/, '');
	const proxiedUrl = `https://cond8-offline.pages.dev${proxiedPath}${url.search}`;

	// Validate the target URL is only cond8-offline.pages.dev
	if (!proxiedUrl.startsWith('https://cond8-offline.pages.dev')) {
		return c.text('Invalid proxy target', 403);
	}

	// Forward the request to the target URL
	const res = await fetch(proxiedUrl, {
		headers: {
			...c.req.raw.headers,
			// Remove potentially sensitive headers
			host: 'cond8-offline.pages.dev',
			origin: 'https://cond8-offline.pages.dev',
			referer: 'https://cond8-offline.pages.dev',
		},
	});

	// Create a new response with security headers
	const response = new Response(res.body, {
		status: res.status,
		statusText: res.statusText,
		headers: {
			// Forward only specific headers from the original response
			'content-type': res.headers.get('content-type') || 'application/octet-stream',
			'content-length': res.headers.get('content-length') || '',
			'cache-control': res.headers.get('cache-control') || 'no-cache',
			// Security headers
			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'DENY',
			'X-XSS-Protection': '1; mode=block',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
		},
	});

	return response;
});

app.post('/api/openai/gpt_4_1_nano/proxy/*', Gpt4_1NanoProxy);
app.get('/api/openai/gpt_4_1_nano/proxy/*', Gpt4_1NanoProxy);

// 🏠 Landing Page route
app.get('/', async c => {
	const html = await LandingPageDirector(c);
	return c.html(html, 200, {
		'Content-Type': 'text/html; charset=utf-8',
	});
});

app.get('/docs/:slug', async c => {
	const html = await DocsPages(c);
	return c.html(html, 200, {
		'Content-Type': 'text/html; charset=utf-8',
	});
});

app.get('partials/docs/:slug', async c => {
	const html = await DocsFragment(c);
	return c.html(html, 200, {
		'Content-Type': 'text/html; charset=utf-8',
	});
});

// ❌ 404 fallback
app.notFound(c => c.text('Not Found', 404));

app.onError((err, c) => {
	const html = ErrorHandlerDirector(err as C8Error<any>);
	return c.html(html, 500, {
		'Content-Type': 'text/html; charset=utf-8',
	});
});

// 🚀 Export
export default app;
