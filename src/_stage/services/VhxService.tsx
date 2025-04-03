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

	getSlot(key: string): JSX.Element {
		return this.get(`slot:${key}`, new Error(`VHX: Slot "${key}" has not been filled`)) as JSX.Element;
	}

	hasSlot(key: string): boolean {
		return this.has(`slot:${key}`);
	}

	removeSlot(key: string): void {
		this.remove(`slot:${key}`);
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

			if (typeof node.type === 'string' && node.type.toLowerCase() === 'slot') {
				const name = node.props?.name;
				if (typeof name !== 'string') {
					throw new Error('VHX: <slot> must have a "name" attribute.');
				}
				if (!this.hasSlot(name)) {
					throw new Error(`VHX: Slot "${name}" has not been filled.`);
				}
				return this.getSlot(name);
			}

			const newChildren = walk(node.props?.children);
			return h(node.type, { ...node.props, children: newChildren });
		};

		return walk(this.getTemplate());
	}
}
