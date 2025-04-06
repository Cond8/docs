// src/index.ts
import { DurableObject } from 'cloudflare:workers';
import { Hono } from 'hono';
import { C8Error } from './_core/Recorder/C8Error';
import { LifeReloadServer } from './_stage/utils/life-reload-server';
import DocsFragment from './directors/docs-fragment';
import DocsPages from './directors/docs-pages';
import ErrorHandlerDirector from './directors/error-handler';
import LandingPageDirector from './directors/landing-page';

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
