import { JSX } from 'preact';
import { CoreRedprint } from '../../_core';
import { HtmlSlotsService } from '../services/HtmlSlotsService';

export type HtmlRedprint<T extends object = object> = CoreRedprint<T> & {
	html: HtmlSlotsService;
};

export const createHtmlActors = <C8 extends HtmlRedprint>() => ({
	InitHtml: (htmlKey: string) => (c8: C8) => {
		c8.html.stringTemplate = c8.var.string(htmlKey);
		return c8;
	},
	SetSlot: (slotName: string, slotValue: JSX.Element) => (c8: C8) => {
		c8.html.setSlot(slotName, slotValue);
		return c8;
	},
	get Finalize() {
		return {
			Set: (setKey: string) => (c8: C8) => {
				const html = c8.html.finalize();
				c8.var(setKey, html);
				return c8;
			},
		};
	},
});
