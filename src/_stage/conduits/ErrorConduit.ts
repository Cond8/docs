// src/_stage/conduits/AppConduit.ts
import { CoreRedprint, StrictObjectKVService } from '../../_core';
import { C8Error } from '../../_core/Recorder/C8Error';
import { createModelerActors } from '../actors/modelers';
import { createVHXActors, VHXRedprint } from '../actors/vhx';
import { VHXService } from '../services/VhxService';
import { DocsConduit } from './DocsConduit';

export class ErrorConduit extends CoreRedprint<C8Error<DocsConduit>> implements VHXRedprint<C8Error<DocsConduit>> {
	public locals = new StrictObjectKVService('locals');
	public vhx = new VHXService('vhx');

	constructor(error: C8Error<DocsConduit>) {
		super(error);
	}
}

export const ErrorActors = {
	Modeler: createModelerActors<ErrorConduit>(),
	VHX: createVHXActors<ErrorConduit>(),
};
