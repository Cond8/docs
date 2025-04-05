// src/directors/error-directors/body-parser.ts
import { C8ROPlain, CoreRedprint, createDirector, RecorderEntry } from '../../_core';
import { LifecyclePayload } from '../../_core/Lifecycle/Vacuum';
import { ErrorActors, ErrorConduit } from '../../_stage/conduits/ErrorConduit';

export const ErrorBodyParser = createDirector<ErrorConduit>(
	'ErrorBodyParser',
	'makes sure that the body is parsed the correct way',
	'manually written',
)(
	ErrorActors.Modeler(c8 => {
		const { payload: actorPayload, directorPayload, recording } = c8.body;
		const error = c8.body as Error;

		const payload = mergeLifecyclePayloads(directorPayload, actorPayload);
		const llmText = generateLLMErrorText({ error, recording, payload });

		c8.var('llm text', llmText);

		c8.var('payload', payload);
		c8.var('recording', recording);
		c8.var('error', error);
		c8.var('error message', error.message);

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
		// Collect readonly C8
		if (payload.c8?.utils?.readonly?.plain) {
			readonlyC8List.push(payload.c8.utils.readonly.plain);
		}

		// Shallow merge all fields (later ones override earlier ones)
		if (payload.event !== undefined) merged.event = payload.event;
		if (payload.isTest !== undefined) merged.isTest = payload.isTest;

		if (payload.directorName !== undefined) merged.directorName = payload.directorName;
		if (payload.actorName !== undefined) merged.actorName = payload.actorName;

		if (payload.inputMapper !== undefined) merged.inputMapper = payload.inputMapper;
		if (payload.outputMapper !== undefined) merged.outputMapper = payload.outputMapper;

		if (payload.input !== undefined) merged.input = payload.input;
		if (payload.error !== undefined) merged.error = payload.error;
		if (payload.output !== undefined) merged.output = payload.output;

		if (payload.actorFn !== undefined) merged.actorFn = payload.actorFn;
		if (payload.assertFn !== undefined) merged.assertFn = payload.assertFn;

		merged.hooks!.push(...(payload.hooks ?? []));
		merged.metadata!.push(...(payload.metadata ?? []));
	}

	merged.c8 = mergeReadonlyC8(...readonlyC8List);

	return merged as MergedLifecyclePayload<C8>;
}

function mergeReadonlyC8(...readonlyList: object[]): object {
	return Object.assign({}, ...readonlyList); // later overrides earlier
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

	// @Error
	out += '@Error\n';
	out += `Name: ${error.name}\n`;
	out += `Message: ${error.message}\n`;
	if (error.stack) {
		out += `Stack:\n${error.stack.trim()}\n`;
	}

	// @Recording
	if (Array.isArray(recording) && recording.length > 0) {
		out += '\n@Recording\n';
		for (const rec of recording) {
			out += `- name: ${rec.filter}\n`;
			out += `  ms: ${rec.ms}\n`;
			if (Array.isArray(rec.metadata)) {
				out += `  metadata:\n`;
				for (const item of rec.metadata) {
					out += `    - ${JSON.stringify(item)}\n`;
				}
			}
		}
	}

	// @Payload
	out += '\n@Payload\n';
	out += JSON.stringify(payload, null, 2);

	return out;
}
