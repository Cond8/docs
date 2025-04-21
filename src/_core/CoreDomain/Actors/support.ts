// src/_core/CoreDomain/Actors/support.ts
import { StagedActor } from '../../CoreInfra/create-actor';
import { createDirector } from '../../CoreInfra/create-director';
import { LifecyclePayload } from '../../Lifecycle/Vacuum';
import { Recorder } from '../../Recorder/create-recorder';
import { ReadonlyState } from '../Redprints/ConduitUtils';
import { CoreRedprint } from '../Redprints/CoreRedprint';

export const createSupportActors = <C8 extends CoreRedprint>() => {
	const If = (cond: (c8: ReadonlyState) => boolean) => ({
		Then: (...thenActors: StagedActor<C8>[]) => {
			const ThenActor = createDirector<C8>('Conditional Then')(...thenActors).AsActor;

			const Then = (c8: C8, recorder: Recorder | undefined, directorPayload: LifecyclePayload<C8>) => {
				if (cond(c8.utils.readonly)) {
					return ThenActor(c8, recorder, directorPayload);
				}
				return c8;
			};

			const Else =
				(...elseActors: StagedActor<C8>[]) =>
				(c8: C8, recorder: Recorder | undefined, directorPayload: LifecyclePayload<C8>) => {
					if (!cond(c8.utils.readonly)) {
						return createDirector<C8>('Conditional Else')(...elseActors).AsActor(c8, recorder, directorPayload);
					} else {
						return ThenActor(c8, recorder, directorPayload);
					}
				};
			return Object.assign(Then, { Else });
		},
	});

	return { If };
};
