import { CoreRedprint } from "../_core";
import { VHXService } from '../services/VhxService';

export interface VHXRedprintImpl extends CoreRedprint {
	vhx: VHXService;
}

export abstract class VHXRedprint extends CoreRedprint implements VHXRedprintImpl {
	abstract vhx: VHXService;
}
