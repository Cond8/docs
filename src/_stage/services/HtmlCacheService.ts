// src/_stage/services/HtmlCacheService.ts
import { StrictKVBlueprintAsync } from '../../_core';

export class HtmlCacheRemoteClient extends StrictKVBlueprintAsync<string, string> {
	get readonly(): unknown {
		return {};
	}

	constructor(
		key: string,
		private stub: DurableObjectStub,
	) {
		super(key);
	}

	private async call(path: string, key: string, body?: string): Promise<Response> {
		const url = `https://cache.internal${path}?key=${encodeURIComponent(key)}`;
		return this.stub.fetch(url, {
			method: body ? 'POST' : 'GET',
			body,
		});
	}

	async has(key: string): Promise<boolean> {
		const res = await this.call('/get', key);
		return res.ok;
	}

	async optional(key: string): Promise<string | undefined> {
		const res = await this.call('/get', key);
		return res.ok ? await res.text() : undefined;
	}

	async set(key: string, value: string): Promise<void> {
		await this.call('/put', key, value);
	}

	async remove(key: string): Promise<void> {
		// optional: implement `/delete` on DO first
		throw new Error('Not implemented');
	}
}
