import { DurableObject } from 'cloudflare:workers';

export class HtmlCacheDurableObject extends DurableObject {
	constructor(
		private state: DurableObjectState,
		env: unknown,
	) {
		super(state, env);
	}

	// More semantic key prefixing for future extensibility
	private makeStorageKey(name: string) {
		return `html:${name}`;
	}

	async fetch(request: Request): Promise<Response> {
		const { pathname, searchParams } = new URL(request.url);
		const name = searchParams.get('name');

		if (!name) {
			return new Response('[HtmlCache] Missing "name" query param', { status: 400 });
		}

		const key = this.makeStorageKey(name);

		if (pathname === '/cache/get') {
			const cachedHtml = await this.state.storage.get<string>(key);
			if (cachedHtml) {
				return new Response(cachedHtml, {
					status: 200,
					headers: { 'Content-Type': 'text/html; charset=utf-8' },
				});
			}
			return new Response('[HtmlCache] Not found', { status: 404 });
		}

		if (pathname === '/cache/put') {
			const html = await request.text();
			await this.state.storage.put(key, html);
			return new Response('[HtmlCache] Stored', { status: 200 });
		}

		return new Response(`[HtmlCache] Unknown endpoint: ${pathname}`, { status: 404 });
	}
}
