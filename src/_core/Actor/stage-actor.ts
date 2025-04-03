// src/_core/Actor/stage-actor.ts
import { CoreRedprint } from '../CoreDomain/Redprints/CoreRedprint.js';
import { filterMetaHooksActor } from '../Metadata/filter-meta-hooks.js';
import { Recorder } from '../Recorder/create-recorder.js';
import { CouldPromise } from '../utils/fn-promise-like.js';
import { fnStringify } from '../utils/fn-stringify.js';
import { ActorScript, ActorScriptWithTest } from './create-role.js';

export type StagedActor<C8 extends Partial<CoreRedprint>> = {
	(c8: C8, recorder?: Recorder): CouldPromise<C8>;
	test?: (recorder: Recorder, c8Mock?: C8) => CouldPromise<C8>;
};

export type ActorTest<C8 extends CoreRedprint> = (recorder: Recorder, c8Mock?: C8) => CouldPromise<C8>;

export const stageActor = <C8 extends CoreRedprint>(
	actorName: string,
	actorScript: ActorScript<C8> | ActorScriptWithTest<C8>,
	...metadata: unknown[]
): StagedActor<C8> => {
	const { inputMock, assertFn } = filterMetaHooksActor<C8>(...metadata);

	const runActorScript = async (inputC8: C8, recorder: Recorder | undefined, isTest: boolean): Promise<C8> => {
		await inputC8.utils.handleEvent('onActorEnter', {
			event: 'onActorEnter',
			isTest,
			actorName,
			c8: inputC8,
			recorder,
			metadata,
			actorFn: fnStringify(actorScript),
		});

		const outputC8 = inputC8;
		try {
			await actorScript(inputC8, recorder);
		} catch (error) {
			const normalizedError = error instanceof Error ? error : new Error(JSON.stringify(error));

			await outputC8.utils.handleEvent('onActorError', {
				event: 'onActorError',
				isTest,
				actorName,
				c8: outputC8,
				recorder,
				error: normalizedError,
				metadata,
				actorFn: fnStringify(actorScript),
			});

			if (isTest) {
				throw normalizedError;
			} else {
				inputC8.utils.close();
				throw normalizedError;
			}
		}

		await outputC8.utils.handleEvent('onActorExit', {
			event: 'onActorExit',
			isTest,
			actorName,
			c8: outputC8,
			recorder,
			metadata,
			actorFn: fnStringify(actorScript),
		});

		return outputC8;
	};

	const runAssertions = async (c8: C8, recorder: Recorder | undefined, isTest: boolean): Promise<void> => {
		if (!assertFn) return;

		await c8.utils.handleEvent('onActorAssertStart', {
			actorName,
			assertFn: fnStringify(assertFn),
			c8,
			event: 'onActorAssertStart',
			isTest,
			metadata,
			recorder,
		});

		try {
			assertFn(c8);

			await c8.utils.handleEvent('onActorAssertSuccess', {
				actorName,
				assertFn: fnStringify(assertFn),
				c8,
				event: 'onActorAssertSuccess',
				isTest,
				metadata,
				recorder,
			});
		} catch (error) {
			const normalizedError = error instanceof Error ? error : new Error(JSON.stringify(error));

			await c8.utils.handleEvent('onActorAssertFail', {
				actorName,
				assertFn: fnStringify(assertFn),
				c8,
				error: normalizedError,
				event: 'onActorAssertFail',
				isTest,
				metadata,
				recorder,
			});

			if (isTest) {
				throw normalizedError;
			}
		}
	};

	const actorFn = async (inputC8: C8, recorder?: Recorder) => {
		const outputC8 = await runActorScript(inputC8, recorder, false);
		await runAssertions(outputC8, recorder, false);
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
		const inputC8 = ensure(givenC8 ?? inputMock);
		const outputC8 = await runActorScript(inputC8, recorder, true);
		await runAssertions(outputC8, recorder, true);
		return outputC8;
	};

	return Object.assign(actorFn, { test: testUnit });
};
