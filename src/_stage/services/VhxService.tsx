// src/_stage/services/VhxService.tsx
import { h, JSX, VNode } from 'preact';
import { render } from 'preact-render-to-string';
import { StrictObjectKVService } from '../../_core';

export class VHXService extends StrictObjectKVService<string, string | JSX.Element> {
	constructor(key: string, initial: Record<string, string | JSX.Element> = {}) {
		super(key, initial);
	}

	// -- Title ---------------------------------------------------------

	setTitle(title: string): void {
		this.set('title', title);
	}

	getTitle(): string {
		return this.get('title', new Error('VHX: No title has been set')) as string;
	}

	// -- Template ------------------------------------------------------

	setTemplate(template: JSX.Element): void {
		this.set('template', template);
	}

	getTemplate(): JSX.Element {
		return this.get('template', new Error('VHX: No template has been set')) as JSX.Element;
	}

	// -- Header --------------------------------------------------------

	setHeader(header: JSX.Element): void {
		this.set('header', header);
	}

	getHeader(): JSX.Element {
		return this.get('header', new Error('VHX: No header has been set')) as JSX.Element;
	}

	// -- Slot Content --------------------------------------------------

	setSlot(key: string, content: JSX.Element): void {
		this.set(`slot:${key}`, content);
	}

	setSlotHtml(key: string, html: string): void {
		this.set(`slot:html:${key}`, html);
	}

	getSlot(key: string): JSX.Element | null {
		return (this.optional(`slot:${key}`) ?? null) as JSX.Element | null;
	}

	getSlotHtml(key: string): string | null {
		return (this.optional(`slot:html:${key}`) ?? null) as string | null;
	}

	hasSlot(key: string): boolean {
		return this.has(`slot:${key}`);
	}

	hasSlotHtml(key: string): boolean {
		return this.has(`slot:html:${key}`);
	}

	removeSlot(key: string): void {
		this.remove(`slot:${key}`);
		this.remove(`slot:html:${key}`);
	}

	wrapWithHtml() {
		const title = this.getTitle();
		const header = this.getHeader();

		const replacedTemplate = this.replaceSlots();

		return render(
			<html lang="en">
				<head>
					<title>{title}</title>
					{header}
				</head>
				<body>{replacedTemplate}</body>
			</html>,
		);
	}

	private replaceSlots(): VNode | VNode[] {
		const walk = (node: any): any => {
			if (node == null || typeof node !== 'object') return node;

			if (Array.isArray(node)) {
				return node.map(walk);
			}

			// If this node is a <slot> element
			if (typeof node.type === 'string' && node.type.toLowerCase() === 'slot') {
				const name = node.props?.name;
				const dataProps = node.props?.['data-props'] ?? {};

				if (typeof name !== 'string') {
					throw new Error('VHX: <slot> must have a "name" attribute.');
				}

				// Retrieve both potential slot contents
				const jsxSlot = this.optional(`slot:${name}`);
				const htmlSlot = this.optional(`slot:html:${name}`);

				// Case 1: Both JSX and HTML slots are provided.
				if (jsxSlot && htmlSlot) {
					const jsxContent = typeof jsxSlot === 'function' ? jsxSlot(dataProps) : jsxSlot;
					if (!this.isValidVNode(jsxContent)) {
						throw new Error(`VHX: Slot "${name}" must be a VNode or a function that returns one.`);
					}
					const htmlContent = h('div', {
						dangerouslySetInnerHTML: { __html: htmlSlot as string },
					});

					// Combine both in a fragment-like structure.
					// Returning an array is fine in Preact, but you might also explicitly use a Fragment.
					return [jsxContent, htmlContent];
				}

				// Case 2: Only JSX slot provided.
				if (jsxSlot) {
					const jsxContent = typeof jsxSlot === 'function' ? jsxSlot(dataProps) : jsxSlot;
					if (!this.isValidVNode(jsxContent)) {
						throw new Error(`VHX: Slot "${name}" must be a VNode or a function that returns one.`);
					}
					return jsxContent;
				}

				// Case 3: Only HTML slot provided.
				if (htmlSlot) {
					return h('div', {
						dangerouslySetInnerHTML: { __html: htmlSlot as string },
					});
				}

				// Case 4: No matching slot content found.
				return null;
			}

			// Recursively process children
			const newChildren = walk(node.props?.children);
			return h(node.type, { ...node.props, children: newChildren });
		};

		return walk(this.getTemplate());
	}

	private isValidVNode(x: unknown): x is JSX.Element {
		return typeof x === 'object' && x !== null && 'type' in x && 'props' in x;
	}

	override get readonly() {
		const keys = Object.keys(super.readonly);
		return {
			title: typeof this.optional('title') === 'string' ? (this.optional('title') as string) : null,
			templateSet: this.has('template'),
			headerSet: this.has('header'),
			slots: Object.fromEntries(keys.filter(k => k.startsWith('slot:')).map(k => [k.slice(5), true])),
		} as Record<string, any>;
	}
}
