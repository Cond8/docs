// src/_core/Director/create-director.ts
import { ActorScript, ActorScriptWithTest } from '../Actor/create-role.js';
import { stageActor, StagedActor } from '../Actor/stage-actor.js';
import { CoreBlueprint } from '../CoreDomain/Blueprints/CoreBlueprint.js';
import { CoreRedprint } from '../CoreDomain/Redprints/CoreRedprint.js';
import { filterMetaHooksDirector } from '../Metadata/filter-meta-hooks.js';
import { MetaHook } from '../Metadata/hooks.js';
import { Recorder, RecorderEntry } from '../Recorder/create-recorder.js';
import { CouldPromise } from '../utils/fn-promise-like.js';
import { fnStringify } from '../utils/fn-stringify.js';

export type C8RO<C8 extends CoreRedprint> = C8['utils']['readonly'];

export interface Input<C8 extends CoreRedprint> {
	conduit: C8;
	recorder?: Recorder;
}

export type OutputMapper<C8 extends CoreRedprint, Out = unknown> = (
	readonlyConduit: C8RO<C8>,
	recording?: RecorderEntry[],
) => CouldPromise<Out>;

export type InputMapper<NewIn extends object, C8 extends CoreRedprint> = (input: NewIn) => CouldPromise<Input<C8>>;

export interface BaseDirector<C8 extends CoreRedprint> {
	directorName: string;
	readonly metadata: Readonly<unknown[]>;
	readonly metaHooks: Readonly<MetaHook[]>;
	readonly actors: Readonly<StagedActor<C8>[]>;
	readonly asScript: ActorScriptWithTest<C8>;
	readonly AsActor: StagedActor<C8>;
}

export interface Director<C8 extends CoreRedprint, In extends object = object, Out = unknown> extends BaseDirector<C8> {
	isFinalized: false;
	// Callable for adding actors
	(...actors: StagedActor<C8>[]): Director<C8, In, Out>;
	appendActors(...actors: StagedActor<C8>[]): Director<C8, In, Out>;
	prependActors(...actors: StagedActor<C8>[]): Director<C8, In, Out>;
	init<NewIn extends object>(inputMapper: InputMapper<NewIn, C8>): InitializedDirector<C8, NewIn, Out>;
}

export interface InitializedDirector<C8 extends CoreRedprint, In extends object = object, Out = unknown> extends BaseDirector<C8> {
	isFinalized: false;
	(...actors: StagedActor<C8>[]): InitializedDirector<C8, In, Out>;
	appendActors(...actors: StagedActor<C8>[]): InitializedDirector<C8, In, Out>;
	prependActors(...actors: StagedActor<C8>[]): InitializedDirector<C8, In, Out>;
	fin<NewOut>(outputMapper: OutputMapper<C8, NewOut>): Executable<In, NewOut, C8>;
}

export interface Executable<In extends object, Out, C8 extends CoreRedprint = CoreRedprint> extends BaseDirector<C8> {
	isFinalized: true;
	(input?: In): Promise<Out>;
	test(): Promise<Out>;
	appendActors(...actors: StagedActor<C8>[]): Executable<In, Out, C8>;
	prependActors(...actors: StagedActor<C8>[]): Executable<In, Out, C8>;
}

export function createDirector<C8 extends CoreRedprint>(directorName: string, ...metadata: unknown[]): Director<C8> {
	let _inputMapper: ((input?: unknown) => CouldPromise<Input<C8>>) | undefined;
	let _outputMapper: ((readonlyConduit: C8RO<C8>, recording?: RecorderEntry[]) => CouldPromise<unknown>) | undefined;

	const stagedActors: StagedActor<C8>[] = [];
	const { hooks, inputMock, assertFn } = filterMetaHooksDirector(...metadata);

	const inputMapper = (input?: unknown): CouldPromise<Input<C8>> => {
		if (_inputMapper === undefined) {
			return Promise.reject(new Error('Director: No input mapper provided'));
		}
		return _inputMapper(input);
	};

	const outputMapper = (readonlyConduit: C8RO<C8>, recording?: RecorderEntry[]): CouldPromise<unknown> => {
		if (_outputMapper === undefined) {
			return Promise.reject(new Error('Director: No output mapper provided'));
		}
		return _outputMapper(readonlyConduit, recording);
	};

	// --------------------
	// ACTOR EXECUTION HELPERS
	// --------------------
	const runDirectorOutput = async <NewOut>(
		inputC8: C8,
		recorder: Recorder | undefined,
		outputMapperFn: typeof outputMapper,
		runner: (c8: C8, recorder: Recorder) => CouldPromise<C8>,
		isTest = false,
	): Promise<NewOut> => {
		const outputC8 = await runner(inputC8, recorder as Recorder);
		const readonly = outputC8.utils.readonly;
		const output = await outputMapperFn(readonly as C8RO<C8>, recorder?.recording);

		// Run output assertions if provided
		if (assertFn) {
			void outputC8.utils.handleEvent('onDirectorAssertStart', {
				event: 'onDirectorAssertStart',
				isTest,
				directorName,
				c8: outputC8,
				recorder,
				output,
				assertionFn: fnStringify(assertFn),
				metadata,
			});
			try {
				assertFn(output);

				void outputC8.utils.handleEvent('onDirectorAssertSuccess', {
					event: 'onDirectorAssertSuccess',
					isTest,
					directorName,
					c8: outputC8,
					recorder,
					output,
					assertionFn: fnStringify(assertFn),
					metadata,
				});
			} catch (error) {
				const normalizedError = error instanceof Error ? error : new Error(JSON.stringify(error));

				void outputC8.utils.handleEvent('onDirectorAssertFail', {
					event: 'onDirectorAssertFail',
					isTest,
					directorName,
					c8: outputC8,
					recorder,
					output,
					error: normalizedError,
					assertionFn: fnStringify(assertFn),
					metadata,
				});

				if (isTest) {
					return Promise.reject(normalizedError);
				}
			}
		}

		return output as NewOut;
	};

	// --------------------
	// TEST RUNNER
	// --------------------
	const testDirectorWithRecorder = async (inputC8: C8, recorder: Recorder): Promise<C8> => {
		let c8 = inputC8;

		void c8.utils.handleEvent('onDirectorEnter', {
			c8,
			event: 'onDirectorEnter',
			isTest: true,
			metadata,
			recorder,
			directorName,
		});

		for (const actor of stagedActors) {
			if ('test' in actor && typeof actor.test === 'function') {
				c8 = await actor.test(recorder, c8);
			} else {
				c8 = await actor(c8, recorder);
			}
			if (c8.utils.isClosed) break;
		}

		void c8.utils.handleEvent('onDirectorExit', {
			c8,
			event: 'onDirectorExit',
			isTest: true,
			metadata,
			recorder,
			directorName,
		});

		return c8;
	};

	// --------------------
	// ACTOR SCRIPT & DIRECTOR RUNTIME
	// --------------------
	const toActorScript: ActorScript<C8> = async (inputC8: C8, recorder?: Recorder) => {
		let c8 = inputC8;

		void c8.utils.handleEvent('onDirectorEnter', {
			event: 'onDirectorEnter',
			directorName,
			c8,
			recorder,
			metadata,
		});

		for (const actor of stagedActors) {
			c8 = await actor(c8, recorder);
			if (c8.utils.isClosed) break;
		}

		void c8.utils.handleEvent('onDirectorExit', {
			event: 'onDirectorExit',
			directorName,
			c8,
			recorder,
			metadata,
		});

		return c8;
	};

	// --------------------
	// ASSEMBLE: Common Director properties
	// --------------------
	function assemble(): Pick<Director<C8>, 'directorName' | 'metadata' | 'metaHooks' | 'actors' | 'asScript' | 'AsActor'> {
		return {
			get directorName() {
				return directorName;
			},
			get metadata() {
				return Object.freeze([...metadata]);
			},
			get metaHooks() {
				return Object.freeze([...hooks]);
			},
			get actors() {
				return Object.freeze([...stagedActors]);
			},
			get asScript() {
				const base = toActorScript as ActorScriptWithTest<C8>;
				return Object.assign(base, { test: testDirectorWithRecorder });
			},
			get AsActor() {
				const base = stageActor<C8>(directorName, toActorScript, ...metadata);
				return Object.assign(base, { test: testDirectorWithRecorder });
			},
		};
	}

	// --------------------
	// MUTABLE DIRECTOR BUILDER
	// --------------------
	function makeDirector<CurIn extends object = object, CurOut = unknown>(): Director<C8, CurIn, CurOut> {
		const appendActors = (...actors: Partial<StagedActor<C8>>[]): Director<C8, CurIn, CurOut> => {
			stagedActors.push(...(actors as StagedActor<C8>[]));
			return makeDirector<CurIn, CurOut>();
		};

		function prependActors(...actors: Partial<StagedActor<C8>>[]): Director<C8, CurIn, CurOut> {
			stagedActors.unshift(...(actors as StagedActor<C8>[]));
			return makeDirector<CurIn, CurOut>();
		}

		function init<NewIn extends object>(inputMapperFn: InputMapper<NewIn, C8>): InitializedDirector<C8, NewIn, CurOut> {
			if (_inputMapper !== undefined) {
				throw new Error('Director: Input mapper already initialized');
			}
			_inputMapper = (input?: unknown) => {
				const rawResult = inputMapperFn(input as NewIn);
				return Promise.resolve(rawResult);
			};
			return makeInitializedDirector<NewIn, CurOut>();
		}

		return Object.assign(appendActors, {
			...assemble(),
			get isFinalized(): false {
				return false;
			},
			appendActors,
			prependActors,
			init,
		});
	}

	function makeInitializedDirector<CurIn extends object, CurOut>(): InitializedDirector<C8, CurIn, CurOut> {
		function appendActors(...actors: Partial<StagedActor<C8>>[]): InitializedDirector<C8, CurIn, CurOut> {
			stagedActors.push(...(actors as StagedActor<C8>[]));
			return makeInitializedDirector<CurIn, CurOut>();
		}

		function prependActors(...actors: Partial<StagedActor<C8>>[]): InitializedDirector<C8, CurIn, CurOut> {
			stagedActors.unshift(...(actors as StagedActor<C8>[]));
			return makeInitializedDirector<CurIn, CurOut>();
		}

		function fin<NewOut>(outputMapperFn: OutputMapper<C8, NewOut>): Executable<CurIn, NewOut, C8> {
			if (_outputMapper !== undefined) {
				throw new Error('Director: Output mapper already initialized');
			}
			_outputMapper = (readonlyConduit: C8RO<C8>, recording?: RecorderEntry[]) => {
				const rawResult = outputMapperFn(readonlyConduit, recording);
				return Promise.resolve(rawResult);
			};
			return makeExecutable<CurIn, NewOut>();
		}

		return Object.assign(appendActors, {
			...assemble(),
			get isFinalized(): false {
				return false;
			},
			appendActors,
			prependActors,
			fin,
		});
	}

	// --------------------
	// FINALIZE: Create a callable Executable from the Director
	// --------------------
	function makeExecutable<CurIn extends object, CurOut>(): Executable<CurIn, CurOut, C8> {
		function applyProxies(c8: C8, recorder?: Recorder) {
			if (!recorder?.proxyHandlers) return;
			for (const [key, handler] of Object.entries(recorder.proxyHandlers)) {
				if (c8[key as keyof C8] !== undefined && c8[key as keyof C8] instanceof CoreBlueprint) {
					c8[key as keyof C8] = new Proxy(c8[key as keyof C8] as object, handler) as C8[keyof C8];
				}
			}
		}

		const callDefinition = async (input?: CurIn): Promise<CurOut> => {
			const { conduit, recorder } = await inputMapper(input);
			applyProxies(conduit, recorder);
			void conduit.utils.handleEvent('onEnter', {
				c8: conduit,
				event: 'onEnter',
				input,
				metadata,
				recorder,
				directorName,
			});
			const output = await runDirectorOutput<CurOut>(conduit, recorder, outputMapper, toActorScript);
			void conduit.utils.handleEvent('onExit', {
				c8: conduit,
				event: 'onExit',
				input,
				metadata,
				output,
				recorder,
				directorName,
			});
			return output;
		};

		const executable: Executable<CurIn, CurOut, C8> = Object.assign(callDefinition, {
			...assemble(),
			test() {
				throw new Error('Director: Integration testing requires a mock input');
			},
			get isFinalized(): true {
				return true;
			},
			appendActors(...actors: Partial<StagedActor<C8>>[]): Executable<CurIn, CurOut, C8> {
				stagedActors.push(...(actors as StagedActor<C8>[]));
				return makeExecutable<CurIn, CurOut>();
			},
			prependActors(...actors: Partial<StagedActor<C8>>[]): Executable<CurIn, CurOut, C8> {
				stagedActors.unshift(...(actors as StagedActor<C8>[]));
				return makeExecutable<CurIn, CurOut>();
			},
		});

		if (inputMock) {
			executable.test = async (): Promise<CurOut> => {
				const { conduit, recorder } = await inputMapper(inputMock);
				if (!recorder) {
					return Promise.reject(new Error('Director: Integration testing requires a Recorder'));
				}
				applyProxies(conduit, recorder);
				void conduit.utils.handleEvent('onEnter', {
					c8: conduit,
					event: 'onEnter',
					input: inputMock,
					isTest: true,
					metadata,
					recorder,
					directorName,
				});
				const output = await runDirectorOutput<CurOut>(conduit, recorder, outputMapper, testDirectorWithRecorder, true);
				void conduit.utils.handleEvent('onExit', {
					c8: conduit,
					event: 'onExit',
					input: inputMock,
					isTest: true,
					metadata,
					output,
					recorder,
					directorName,
				});
				return output;
			};
		}

		return executable;
	}

	return makeDirector();
}
