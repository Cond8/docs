import { StagedActor } from '../../CoreInfra/create-actor';
import { createDirector } from '../../CoreInfra/create-director';
import { LifecyclePayload } from '../../Lifecycle/Vacuum';
import { Recorder } from '../../Recorder/create-recorder';
import { ReadonlyState } from '../Redprints/ConduitUtils';
import { CoreRedprint } from '../Redprints/CoreRedprint';

export const createSupportActors = <C8 extends CoreRedprint>() => ({
	If:
		(cond: (c8: ReadonlyState) => boolean, ...actors: StagedActor<C8>[]): StagedActor<C8> =>
		(c8: C8, recorder: Recorder | undefined, directorPayload: LifecyclePayload<C8>) => {
			if (cond(c8.utils.readonly)) {
				return createDirector<C8>('Conditional')(...actors).AsActor(c8, recorder, directorPayload);
			}
			return c8;
		},
});
