// src/_core/Actor/stage-actor.ts
import { CoreRedprint } from '../CoreDomain/Redprints/CoreRedprint.js';
import { filterMetaHooksActor } from '../Metadata/filter-meta-hooks.js';
import { Recorder } from '../Recorder/create-recorder.js';
import { Vacuum } from '../Recorder/Vacuum';
import { CouldPromise } from '../utils/fn-promise-like.js';
import { fnStringify } from '../utils/fn-stringify.js';
import { ActorScript, ActorScriptWithTest } from './create-role.js';

export type StagedActor<C8 extends Partial<CoreRedprint>> = {
	(c8: C8, recorder?: Recorder): CouldPromise<C8>;
	test?: (recorder: Recorder, c8Mock?: C8) => CouldPromise<C8>;
};

export type ActorTest<C8 extends CoreRedprint> = (recorder: Recorder, c8Mock?: C8) => CouldPromise<C8>;

export const createActor = <C8 extends CoreRedprint>(
	actorName: string,
	actorScript: ActorScript<C8> | ActorScriptWithTest<C8>,
	...metadata: unknown[]
): StagedActor<C8> => {
	const { inputMock, assertFn } = filterMetaHooksActor<C8>(...metadata);
	const vacuum = new Vacuum<C8>({
		input: inputMock,
		assertFn: fnStringify(assertFn),
		actorName,
		metadata,
		actorFn: fnStringify(actorScript),
	});

	const runActorScript = async (inputC8: C8, recorder: Recorder | undefined, isTest: boolean): Promise<C8> => {
		void inputC8.utils.handleEvent('onActorEnter', vacuum.payload);

		try {
			const outputC8 = await actorScript(inputC8, recorder);
			void outputC8.utils.handleEvent('onActorExit', vacuum.add({ c8: outputC8 }));

			return outputC8;
		} catch (error) {
			const normalizedError = error instanceof Error ? error : new Error(JSON.stringify(error));
			recorder?.('ACTOR ERROR', normalizedError);
			void inputC8.utils.handleEvent('onActorError', vacuum.add({ error: normalizedError }));

			throw inputC8.utils.close(vacuum.payload, normalizedError, recorder?.recording);
		}
	};

	const runAssertions = async (c8: C8, recorder: Recorder | undefined, isTest: boolean): Promise<void> => {
		if (!assertFn) return;

		void c8.utils.handleEvent('onActorAssertStart', vacuum.payload);

		try {
			assertFn(c8);
			void c8.utils.handleEvent('onActorAssertSuccess', vacuum.payload);
		} catch (error) {
			const normalizedError = error instanceof Error ? error : new Error(JSON.stringify(error));
			recorder?.('ACTOR ASSERT ERROR', normalizedError);
			void c8.utils.handleEvent('onActorAssertFail', vacuum.add({ error: normalizedError }));

			if (isTest) {
				throw c8.utils.close(vacuum.payload, normalizedError, recorder?.recording);
			}
		}
	};

	const actorFn = async (inputC8: C8, recorder?: Recorder) => {
		vacuum.add({ c8: inputC8, isTest: false, recorder });
		const outputC8 = await runActorScript(inputC8, recorder, false);
		vacuum.add({ c8: outputC8 });
		void runAssertions(outputC8, recorder, false);
		return outputC8;
	};

	const ensure = (value: C8 | undefined): C8 => {
		if (!value) throw new Error('StagedActor: No mock or input provided');
		return value;
	};

	if ('test' in actorScript) {
		return Object.assign(actorFn, {
			test: (recorder: Recorder, givenC8?: C8) => {
				const inputC8 = ensure(givenC8 ?? inputMock);
				return actorScript.test(recorder, inputC8);
			},
		});
	}

	const testUnit: ActorTest<C8> = async (recorder: Recorder, givenC8?: C8) => {
		vacuum.add({ isTest: true, recorder });
		const inputC8 = ensure(givenC8 ?? inputMock);
		vacuum.add({ c8: inputC8 });
		const outputC8 = await runActorScript(inputC8, recorder, true);
		vacuum.add({ c8: outputC8 });
		await runAssertions(outputC8, recorder, true);
		return outputC8;
	};

	return Object.assign(actorFn, { test: testUnit });
};
