import { StrictObjectKVService } from '../../_core';

export class HtmlSlotsService extends StrictObjectKVService {
	set stringTemplate(html: string) {
		this.set('template', html);
	}
}
