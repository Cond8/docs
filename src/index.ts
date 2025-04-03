// src/index.ts
import { DurableObject } from 'cloudflare:workers';
import { Hono } from 'hono';
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

// 🏠 Landing Page route
app.get('/', async c => {
	const html = await LandingPageDirector(c);
	return c.html(html);
});

// ❌ 404 fallback
app.notFound(c => c.text('Not Found', 404));

// 🚀 Export
export default app;
