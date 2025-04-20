// src/index.ts
import { Hono } from 'hono';
import { C8Error } from './_core/Recorder/C8Error';
import { HtmlCacheDurableObject } from './_stage/Durables/HtmlCacheDurableObject';
import { cors } from './_stage/middleware/cors';
import { LifeReloadServer } from './_stage/utils/life-reload-server';
import NotFoundDirector from './directors/404';
import DocsFragment from './directors/docs-fragment';
import DocsPages from './directors/docs-pages';
import ErrorHandlerDirector from './directors/error-handler';
import LandingPageDirector from './directors/landing-page';
import InvestorsPageDirector from './directors/sponsor-page';
import { OpenAIProxy } from './routes/openai-proxy';

// ---- App Setup ----
export { HtmlCacheDurableObject };

type Env = {
	MY_DURABLE_OBJECT: DurableObjectNamespace<HtmlCacheDurableObject>;
};

const app = new Hono<{ Bindings: Env }>();

// Apply CORS middleware to all routes
app.use(
	'*',
	cors({
		origin: [
			'https://app.cond8.dev',
			'https://cond8.dev',
			'http://localhost:5173',
			'http://127.0.0.1:5173',
			'http://localhost:8787',
			'http://127.0.0.1:8787',
		],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
		credentials: true,
	}),
);

// WebSocket endpoint for live reload
app.get('/live-reload', LifeReloadServer);

// OpenAI proxy routes
app.all('/api/openai/proxy/*', OpenAIProxy);

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

app.get('/partials/docs/:slug', async c => {
	const html = await DocsFragment(c);
	return c.html(html, 200, {
		'Content-Type': 'text/html; charset=utf-8',
	});
});

app.get('/sponsor-cond8', async c => {
	const html = await InvestorsPageDirector(c);
	return c.html(html, 200, {
		'Content-Type': 'text/html; charset=utf-8',
	});
});

// ❌ 404 fallback
app.notFound(async c => {
	const html = await NotFoundDirector(c);
	return c.html(html, 404, {
		'Content-Type': 'text/html; charset=utf-8',
	});
});

app.onError((err, c) => {
	const html = ErrorHandlerDirector(err as C8Error<any>);
	return c.html(html, 500, {
		'Content-Type': 'text/html; charset=utf-8',
	});
});

// 🚀 Export
export default app;
