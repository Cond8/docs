import { MiddlewareHandler } from 'hono';

interface CorsOptions {
	origin?: string | string[];
	methods?: string[];
	allowedHeaders?: string[];
	exposedHeaders?: string[];
	maxAge?: number;
	credentials?: boolean;
}

const defaultOptions: CorsOptions = {
	origin: '*',
	methods: ['GET', 'POST', 'OPTIONS'],
	allowedHeaders: ['Content-Type'],
	exposedHeaders: [],
	maxAge: 86400, // 24 hours
	credentials: false,
};

export const cors = (options: CorsOptions = {}): MiddlewareHandler => {
	const config = { ...defaultOptions, ...options };

	return async (c, next) => {
		// Handle preflight requests
		if (c.req.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Origin': Array.isArray(config.origin) ? config.origin.join(', ') : config.origin,
					'Access-Control-Allow-Methods': config.methods.join(', '),
					'Access-Control-Allow-Headers': config.allowedHeaders.join(', '),
					'Access-Control-Expose-Headers': config.exposedHeaders.join(', '),
					'Access-Control-Max-Age': config.maxAge.toString(),
					...(config.credentials && { 'Access-Control-Allow-Credentials': 'true' }),
				},
			});
		}

		// Add CORS headers to the response
		await next();

		c.res.headers.set('Access-Control-Allow-Origin', Array.isArray(config.origin) ? config.origin.join(', ') : config.origin);
		c.res.headers.set('Access-Control-Allow-Methods', config.methods.join(', '));
		c.res.headers.set('Access-Control-Allow-Headers', config.allowedHeaders.join(', '));
		c.res.headers.set('Access-Control-Expose-Headers', config.exposedHeaders.join(', '));
		c.res.headers.set('Access-Control-Max-Age', config.maxAge.toString());

		if (config.credentials) {
			c.res.headers.set('Access-Control-Allow-Credentials', 'true');
		}
	};
};
