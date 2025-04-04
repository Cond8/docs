import { C8ROPlain, CoreRedprint, createDirector } from '../../_core';
import { LifecyclePayload } from '../../_core/Lifecycle/Vacuum';
import { ErrorActors, ErrorConduit } from '../../_stage/conduits/ErrorConduit';

export const ErrorBodyParser = createDirector<ErrorConduit>(
	'ErrorBodyParser',
	'makes sure that the body is parsed the correct way',
	'manually written',
)(
	ErrorActors.Modeler(c8 => {
		const { payload, directorPayload, recording } = c8.body;
		const error = c8.body as Error;

		c8.var('payload array', [directorPayload, payload]);

		c8.var('recording', recording);
		c8.var('error', error);

		return c8;
	}),
	ErrorActors.Modeler(c8 => {
		const payloads = c8.var<LifecyclePayload[]>('payload array');
		const payload = mergeLifecyclePayloads(...payloads);

		c8.var('payload', payload);

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
