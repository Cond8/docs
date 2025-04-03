// worker-configuration.d.ts
declare namespace Cloudflare {
	interface Env {
		MY_DURABLE_OBJECT: DurableObjectNamespace<import("./src/index").MyDurableObject>;
		ASSETS: Fetcher;
	}
}
interface Env extends Cloudflare.Env {}
