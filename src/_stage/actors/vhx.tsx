// src/_stage/actors/vhx.tsx
import { h, JSX, VNode } from 'preact';
import { render } from 'preact-render-to-string';
import { C8RO, CoreRedprint, createRole } from '../../_core';
import { VHXService } from '../services/VhxService';

export type VHXRedprint<T = object> = CoreRedprint<T> & {
	vhx: VHXService;
};

type JSXElementOrFn<T = JSX.Element> = T | ((c8: C8RO<VHXRedprint>) => T);
type StringOrFn = string | ((c8: C8RO<VHXRedprint>) => string);

export const createVHXActors = <C8 extends VHXRedprint>() => {
	const StaticTitle = (title: string) => (c8: C8) => {
		c8.vhx.setTitle(title);
		return c8;
	};

	const Title = Object.assign(StaticTitle, {
		Get: (getKey: string, transform?: (value: string) => string) => (c8: C8) => {
			let title = c8.var(getKey);
			if (typeof title !== 'string') {
				throw new Error(`VHX: Title must be a string: ${getKey}`);
			}
			if (transform !== undefined) {
				title = transform(title);
			}
			c8.vhx.setTitle(title as string);
			return c8;
		},
	});

	const Header = (elementOrFn: JSXElementOrFn) =>
		createRole<C8>(
			'VHXActors.Header',
			'Save the VHXElement into storage',
		)(c8 => {
			const header = typeof elementOrFn === 'function' ? elementOrFn(c8.utils.readonly) : elementOrFn;
			c8.vhx.setHeader(header);
			return c8;
		});

	const Template = (elementOrFn: JSXElementOrFn) =>
		createRole<C8>(
			'VHXActors.Template',
			'Save the VHXElement into storage',
		)(c8 => {
			const template = typeof elementOrFn === 'function' ? elementOrFn(c8.utils.readonly) : elementOrFn;
			c8.vhx.setTemplate(template);
			return c8;
		});

	const Slot = (name: string, elementOrFn: JSXElementOrFn) =>
		createRole<C8>(
			'VHXActors.Slot',
			'Save the VHXElement into storage',
		)(c8 => {
			const element = typeof elementOrFn === 'function' ? elementOrFn(c8.utils.readonly) : elementOrFn;
			c8.vhx.setSlot(name, element);
			return c8;
		});

	const WrapHtml = createRole<C8>(
		'VHXActors.WrapHtml',
		'Compile the VHXElement into storage',
	)(c8 => {
		const title = c8.vhx.getTitle();
		const header = c8.vhx.getHeader();
		const originalTemplate = c8.vhx.getTemplate();

		// Replace <slot name="..."/> with actual content from c8.vhx
		const replacedTemplate = replaceSlots(originalTemplate, name => {
			if (!c8.vhx.hasSlot(name)) {
				throw new Error(`VHX: Slot "${name}" has not been filled.`);
			}
			return c8.vhx.getSlot(name);
		});

		const result = render(
			<html lang="en">
				<head>
					<title>{title}</title>
					{header}
				</head>
				<body>{replacedTemplate}</body>
			</html>,
		);

		c8.var('html', `<!DOCTYPE html>${result}`);
		return c8;
	});

	return {
		Title,
		Header,
		Template,
		Slot,
		WrapHtml,
	};
};

/**
 * Recursively traverses a VNode (or an array of VNodes) to collect all slot names.
 */

function replaceSlots(vnode: VNode | VNode[], getSlot: (name: string) => JSX.Element): VNode | VNode[] {
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
			return getSlot(name); // Replace <slot> with actual content
		}

		const newChildren = walk(node.props?.children);
		return h(node.type, { ...node.props, children: newChildren });
	};

	return walk(vnode);
}
