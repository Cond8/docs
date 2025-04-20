import { DurableObject } from 'cloudflare:workers';

export class HtmlCacheDurableObject extends DurableObject {
	constructor(
		private state: DurableObjectState,
		env: Env,
	) {
		super(state, env);
	}

	private getCacheKey(url: string) {
		return `html:${url}`;
	}
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		const key = url.searchParams.get('key');

		if (!key) {
			return new Response('Missing key', { status: 400 });
		}

		const cacheKey = this.getCacheKey(key);

		switch (url.pathname) {
			case '/get': {
				const cached = await this.state.storage.get<string>(cacheKey);
				if (cached) {
					return new Response(cached, {
						status: 200,
						headers: { 'Content-Type': 'text/html; charset=utf-8' },
					});
				}
				return new Response('Not found', { status: 404 });
			}

			case '/put': {
				const body = await request.text();
				await this.state.storage.put(cacheKey, body);
				return new Response('Stored', { status: 200 });
			}

			default:
				return new Response('Not found', { status: 404 });
		}
	}
}
