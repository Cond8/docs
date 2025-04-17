// worker-configuration.d.ts
declare namespace Cloudflare {
	interface Env {
		MY_DURABLE_OBJECT: DurableObjectNamespace<import('./src/index').MyDurableObject>;
		ASSETS: Fetcher;
		OPENAI_API_KEY: string;
		OPENAI_MODEL: string;
	}
}
interface Env extends Cloudflare.Env {}
