// src/directors/error-directors/body-parser.ts
import { C8ROPlain, CoreRedprint, createDirector, LifecyclePayload, RecorderEntry } from '../../_core';
import { ErrorActors, ErrorConduit } from '../../_stage/conduits/ErrorConduit';

export const ErrorBodyParser = createDirector<ErrorConduit>(
	'ErrorBodyParser',
	'makes sure that the body is parsed the correct way',
	'manually written',
)(
	ErrorActors.Modeler(c8 => {
		// Main entry log for debugging
		// console.log('[ErrorBodyParser] Modeler invoked');
		const { payload: actorPayload, directorPayload, recording } = c8.body;
		const error = c8.body as Error;

		const payload = mergeLifecyclePayloads(directorPayload, actorPayload);
		const llmText = generateLLMErrorText({ error, recording, payload });

		c8.var('llm text', llmText);
		c8.var('payload', payload);
		if (recording) {
			c8.var('recording', recording);
		}
		c8.var('error', error);
		c8.var('error message', error.message);

		// Optionally, log only on error
		if (error && error.message) {
			console.error('[ErrorBodyParser] Error:', error.message);
		}
		return c8;
	}),
);

export type MergedLifecyclePayload<C8 extends CoreRedprint> = Omit<LifecyclePayload, 'c8'> & { c8: C8ROPlain<C8> };

export function mergeLifecyclePayloads<C8 extends CoreRedprint>(...payloads: LifecyclePayload<C8>[]): MergedLifecyclePayload<C8> {
	const merged: Partial<MergedLifecyclePayload<C8>> = {
		hooks: [],
		metadata: [],
	};

	const readonlyC8List: object[] = [];

	for (const payload of payloads) {
		if (!payload) {
			continue;
		}

		// Collect readonly C8
		if (payload.c8?.utils?.readonly?.plain) {
			readonlyC8List.push(payload.c8.utils.readonly.plain);
		}

		// Shallow merge all fields (later ones override earlier ones)
		if (payload.event !== undefined) {
			merged.event = payload.event;
		}
		if (payload.isTest !== undefined) {
			merged.isTest = payload.isTest;
		}

		if (payload.directorName !== undefined) {
			merged.directorName = payload.directorName;
		}
		if (payload.actorName !== undefined) {
			merged.actorName = payload.actorName;
		}

		if (payload.inputMapper !== undefined) {
			merged.inputMapper = payload.inputMapper;
		}
		if (payload.outputMapper !== undefined) {
			merged.outputMapper = payload.outputMapper;
		}

		if (payload.input !== undefined) {
			merged.input = payload.input;
		}
		if (payload.error !== undefined) {
			merged.error = payload.error;
		}
		if (payload.output !== undefined) {
			merged.output = payload.output;
		}

		if (payload.actorFn !== undefined) {
			merged.actorFn = payload.actorFn;
		}
		if (payload.assertFn !== undefined) {
			merged.assertFn = payload.assertFn;
		}

		if (payload.hooks) {
			merged.hooks!.push(...payload.hooks);
		}
		if (payload.metadata) {
			merged.metadata!.push(...payload.metadata);
		}
	}

	merged.c8 = mergeReadonlyC8(...readonlyC8List);
	return merged as MergedLifecyclePayload<C8>;
}

function mergeReadonlyC8(...readonlyList: object[]): object {
	const result = Object.assign({}, ...readonlyList); // later overrides earlier
	return result;
}

function safeStringify(obj: any, space?: number) {
	const seen = new WeakSet();
	return JSON.stringify(obj, function (key, value) {
		if (typeof value === 'function') {
			return `[Function: ${value.name || 'anonymous'}]`;
		}
		if (typeof value === 'object' && value !== null) {
			if (seen.has(value)) return '[Circular]';
			seen.add(value);
		}
		return value;
	}, space);
}

function generateLLMErrorText({
	error,
	recording,
	payload,
}: {
	error: Error;
	recording: RecorderEntry[];
	payload: MergedLifecyclePayload<any>;
}): string {
	let out = '';

	// @E (Error)
	out += '@E ';
	out += `name=${error.name}; `;
	out += `msg=${JSON.stringify(error.message)}; `;
	if (error.stack) {
		const trimmed = error.stack
			.split('\n')
			.map(s => s.trim())
			.join(' | ');
		out += `stack=${trimmed}; `;
	}
	out += '\n';

	// @R (Recording)
	if (Array.isArray(recording) && recording.length > 0) {
		out += '@R ';
		for (const rec of recording) {
			// Only log if rec is malformed (for debugging)
			if (!rec.filter || !rec.ms) {
				console.warn('[generateLLMErrorText] Malformed recording entry:', rec);
			}
			out += `[${rec.filter}|${rec.ms}ms`;
			if (Array.isArray(rec.metadata) && rec.metadata.length > 0) {
				out += '|meta=';
				out += rec.metadata.map(m => JSON.stringify(m)).join(',');
			}
			out += '] ';
		}
		out += '\n';
	}

	// @P (Payload)
	out += '@P ';
	try {
		const flat = safeStringify(payload);
		out += flat + '\n';
	} catch (err) {
		console.error('[generateLLMErrorText] Failed to serialize payload:', err);
		out += '[Payload not serializable]\n';
	}

	return out;
}
