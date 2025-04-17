import { Context } from 'hono';
import OpenAI from 'openai';

// Helper function to ensure required environment variables exist
const getEnvOrThrow = (key: string): string => {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Environment variable ${key} is required but not set`);
	}
	return value;
};

interface ToolCall {
	function: {
		name: string;
		arguments: {
			[key: string]: any;
		};
	};
}

interface Message {
	role: string;
	content: string;
	images?: Uint8Array[] | string[];
	tool_calls?: ToolCall[];
}

interface ChatResponse {
	model: string;
	created_at: Date;
	message: Message;
	done: boolean;
	done_reason: string;
	total_duration: number;
	load_duration: number;
	prompt_eval_count: number;
	prompt_eval_duration: number;
	eval_count: number;
	eval_duration: number;
}

interface ModelDetails {
	parent_model: string;
	format: string;
	family: string;
	families: string[];
	parameter_size: string;
	quantization_level: string;
}

interface ModelResponse {
	name: string;
	modified_at: Date;
	model: string;
	size: number;
	digest: string;
	details: ModelDetails;
	expires_at?: Date;
	size_vram?: number;
}

interface ListResponse {
	models: ModelResponse[];
}

// Configuration that could be moved to environment variables
const CONFIG = {
	// The actual OpenAI model to use
	openAIModel: 'gpt-4.1-nano',

	// The model name to display to clients
	displayModelName: 'gpt-4.1-nano',

	// Model metadata
	modelSize: 4100000000,
	modelFamily: 'gpt',
	modelParameterSize: '4.1B',
	modelQuantization: 'Q4_0',

	// Default settings
	defaultTemperature: 0.7,
	defaultMaxTokens: 1000,
};

// Initialize OpenAI client
const createOpenAIClient = (apiKey: string) => {
	// For Cloudflare Workers, use this approach
	return new OpenAI({
		apiKey: apiKey,
	});
};

// Create model response dynamically
const getModelsResponse = (): ListResponse => {
	return {
		models: [
			{
				name: CONFIG.displayModelName,
				modified_at: new Date(),
				model: CONFIG.displayModelName,
				size: CONFIG.modelSize,
				digest: 'sha256:0000000000000000000000000000000000000000000000000000000000000000',
				details: {
					parent_model: '',
					format: 'gguf',
					family: CONFIG.modelFamily,
					families: [CONFIG.modelFamily],
					parameter_size: CONFIG.modelParameterSize,
					quantization_level: CONFIG.modelQuantization,
				},
			},
		],
	};
};

export const Gpt4_1NanoProxy = async (c: Context) => {
	const path = c.req.path;
	const env = c.env;

	console.log('Received path:', path);

	// Add CORS headers
	c.header('Access-Control-Allow-Origin', '*');
	c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	c.header('Access-Control-Allow-Headers', 'Content-Type');

	// Handle OPTIONS request for CORS preflight
	if (c.req.method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			},
		});
	}

	// Handle models list endpoints
	if (path.endsWith('/api/openai/proxy/api/tags') || path.endsWith('/api/openai/proxy/api/models')) {
		console.log('Handling models list endpoint');
		return c.json(getModelsResponse());
	}

	// Check if this is a chat completion request
	if (path.includes('/api/chat') || path.includes('/api/generate')) {
		try {
			// Initialize OpenAI client
			const openai = createOpenAIClient(env.OPENAI_API_KEY);

			// Handle chat completion
			const body = await c.req.json();

			// Extract options with defaults
			const temperature = body.options?.temperature || CONFIG.defaultTemperature;
			const maxTokens = body.options?.num_predict || CONFIG.defaultMaxTokens;

			// Map Ollama request to OpenAI
			const stream = await openai.chat.completions.create({
				model: CONFIG.openAIModel,
				messages: body.messages || [{ role: 'user', content: body.prompt || '' }],
				stream: true,
				temperature,
				max_tokens: maxTokens,
			});

			// Create a ReadableStream that transforms OpenAI format to Ollama format
			const readableStream = new ReadableStream({
				async start(controller) {
					try {
						let fullResponse = '';
						const startTime = Date.now();

						for await (const chunk of stream) {
							const content = chunk.choices[0]?.delta?.content || '';
							if (content) {
								fullResponse += content;

								// Determine the appropriate response format based on the endpoint
								if (path.includes('/api/chat')) {
									// Chat endpoint format
									const ollamaChunk: ChatResponse = {
										model: CONFIG.displayModelName,
										created_at: new Date(),
										message: {
											role: 'assistant',
											content: content, // Send incremental content
										},
										done: false,
										done_reason: '',
										total_duration: Date.now() - startTime,
										load_duration: 0,
										prompt_eval_count: 0,
										prompt_eval_duration: 0,
										eval_count: 0,
										eval_duration: 0,
									};

									controller.enqueue(new TextEncoder().encode(JSON.stringify(ollamaChunk) + '\n'));
								} else {
									// Generate endpoint format
									const generateChunk = {
										model: CONFIG.displayModelName,
										created_at: new Date(),
										response: content, // Send incremental content
										done: false,
										context: [],
										total_duration: Date.now() - startTime,
										load_duration: 0,
										prompt_eval_count: 0,
										prompt_eval_duration: 0,
										eval_count: 0,
										eval_duration: 0,
									};

									controller.enqueue(new TextEncoder().encode(JSON.stringify(generateChunk) + '\n'));
								}
							}
						}

						// Send final done message
						if (path.includes('/api/chat')) {
							const doneResponse: ChatResponse = {
								model: CONFIG.displayModelName,
								created_at: new Date(),
								message: {
									role: 'assistant',
									content: fullResponse,
								},
								done: true,
								done_reason: 'stop',
								total_duration: Date.now() - startTime,
								load_duration: 0,
								prompt_eval_count: 0,
								prompt_eval_duration: 0,
								eval_count: 0,
								eval_duration: 0,
							};

							controller.enqueue(new TextEncoder().encode(JSON.stringify(doneResponse) + '\n'));
						} else {
							const doneGenerate = {
								model: CONFIG.displayModelName,
								created_at: new Date(),
								response: '',
								done: true,
								done_reason: 'stop',
								context: [],
								total_duration: Date.now() - startTime,
								load_duration: 0,
								prompt_eval_count: 0,
								prompt_eval_duration: 0,
								eval_count: 0,
								eval_duration: 0,
							};

							controller.enqueue(new TextEncoder().encode(JSON.stringify(doneGenerate) + '\n'));
						}

						controller.close();
					} catch (error) {
						console.error('Error processing stream:', error);
						controller.error(error);
					}
				},
			});

			return new Response(readableStream, {
				headers: {
					'Content-Type': 'application/json',
					'Transfer-Encoding': 'chunked',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			});
		} catch (error) {
			console.error('Error initializing OpenAI client:', error);
			return c.json({ error: 'Error initializing OpenAI client' }, 500);
		}
	}

	// Return 404 for other endpoints
	return c.json({ error: 'Not implemented' }, 404);
};
