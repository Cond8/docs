import { JSX } from 'preact';
import { render } from 'preact-render-to-string';
import { StrictObjectKVService } from '../../_core';

export class HtmlSlotsService extends StrictObjectKVService {
	set stringTemplate(html: string) {
		this.set('template', html);
	}

	setSlot(slot: string, value: JSX.Element) {
		this.set(`slot ${slot}`, value);
	}

	finalize(): string {
		const template = this.get('template') as string;

		return template.replace(/{{(.*?)}}/g, (_, slotNameRaw) => {
			const slotName = slotNameRaw.trim();
			const value = this.get(`slot ${slotName}`) as JSX.Element | ((props?: any) => JSX.Element) | undefined;

			if (!value) return '';

			let vnode: JSX.Element;

			if (typeof value === 'function') {
				vnode = value(); // could allow passing props later
			} else {
				vnode = value;
			}

			try {
				return render(vnode); // this converts JSX into an HTML string
			} catch (err) {
				console.error(`Error rendering slot "${slotName}":`, err);
				return `<div>Error rendering slot: ${slotName}</div>`;
			}
		});
	}
}
