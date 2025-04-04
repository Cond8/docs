// src/_stage/conduits/AppConduit.ts
import { Context } from 'hono';
import { CoreRedprint, StrictObjectKVService } from '../../_core';
import { C8Error } from '../../_core/Recorder/C8Error';
import { VHXRedprint } from '../actors/vhx';
import { LifeCycleService } from '../services/LifeCycleService';
import { VHXService } from '../services/VhxService';
import { AppConduit } from './AppConduit';

export class ErrorConduit extends CoreRedprint<C8Error<AppConduit>> implements VHXRedprint<Context> {
	public locals = new StrictObjectKVService('locals');
	public vhx = new VHXService('vhx');

	private lifeCycle = new LifeCycleService('lifeCycle');

	constructor(error: C8Error<AppConduit>) {
		super(error);
	}
}
