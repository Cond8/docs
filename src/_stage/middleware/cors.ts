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
	origin: ['https://app.cond8.dev', 'http://localhost:5173'],
	methods: ['GET', 'POST', 'OPTIONS'],
	allowedHeaders: ['Content-Type'],
	exposedHeaders: [],
	maxAge: 86400, // 24 hours
	credentials: false,
};

export const cors = (options: CorsOptions = {}): MiddlewareHandler => {
	const config = { ...defaultOptions, ...options };

	return async (c, next) => {
		const requestOrigin = c.req.header('Origin');
		const allowedOrigins = Array.isArray(config.origin) ? config.origin : [config.origin || '*'];
		const origin = allowedOrigins.includes(requestOrigin || '') ? requestOrigin : allowedOrigins[0];

		// Handle preflight requests
		if (c.req.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Origin': origin || '*',
					'Access-Control-Allow-Methods': (config.methods || []).join(', '),
					'Access-Control-Allow-Headers': (config.allowedHeaders || []).join(', '),
					'Access-Control-Expose-Headers': (config.exposedHeaders || []).join(', '),
					'Access-Control-Max-Age': (config.maxAge || 86400).toString(),
					...(config.credentials && { 'Access-Control-Allow-Credentials': 'true' }),
				},
			});
		}

		// Set CORS headers before the response is created
		c.header('Access-Control-Allow-Origin', origin || '*');
		c.header('Access-Control-Allow-Methods', (config.methods || ['GET', 'POST', 'OPTIONS']).join(', '));
		c.header('Access-Control-Allow-Headers', (config.allowedHeaders || ['Content-Type']).join(', '));
		c.header('Access-Control-Expose-Headers', (config.exposedHeaders || []).join(', '));
		c.header('Access-Control-Max-Age', (config.maxAge || 86400).toString());

		if (config.credentials) {
			c.header('Access-Control-Allow-Credentials', 'true');
		}

		// Continue with the request
		await next();
	};
};
