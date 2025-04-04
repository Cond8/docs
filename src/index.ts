// src/index.ts
import { DurableObject } from 'cloudflare:workers';
import { Hono } from 'hono';
import { serializeError } from './_stage/error-handling/serialize-error';
import DocsPages from './directors/docs-pages';
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
app.get('/live-reload', c => {
	// Create a new WebSocketPair
	const { 0: client, 1: server } = new WebSocketPair();

	// Accept the server-side WebSocket connection.
	server.accept();

	// Optionally add event listeners on the server socket.
	server.addEventListener('message', event => {
		console.log('Live reload server received message:', event.data);
	});

	// For demonstration: immediately send a reload message.
	// In practice, you’d trigger this when file changes are detected.
	server.send('reload');

	return new Response(null, {
		status: 101,
		webSocket: client,
	});
});

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

// ❌ 404 fallback
app.notFound(c => c.text('Not Found', 404));

app.onError((err, c) => {
	const html = serializeError(err);
	return c.html(html, 500, {
		'Content-Type': 'text/html; charset=utf-8',
	});
});

// 🚀 Export
export default app;
