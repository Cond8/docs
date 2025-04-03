import { Fragment, h, JSX } from 'preact';
import { Components } from '../../components/md-components';
import { SlotNode } from './remark-slots';

type RendererFn = (node: any, children: (JSX.Element | string)[], mdComponents: Components) => JSX.Element | string;

export const renderNodeMap: Record<string, RendererFn> = {
	text: node => node.value,
	slot: (node: SlotNode, children) =>
		h('slot', {
			name: node.name,
			props: {
				...node.props,
				children: h(Fragment, {}, ...children),
			},
		}) as unknown as JSX.Element,
	heading: (node, children, mdComponents) => {
		const depth = node.depth || 1;
		const tag = `h${depth}` as keyof Components;
		const Component = mdComponents[tag] || tag;
		return h(Component as any, {}, ...children);
	},
	paragraph: (node, children, mdComponents) => h((mdComponents.p || 'p') as any, {}, ...children),
	list: (node, children, mdComponents) => {
		const tag = node.ordered ? 'ol' : 'ul';
		const Component = mdComponents[tag] || tag;
		return h(Component as any, {}, ...children);
	},
	listItem: (node, children, mdComponents) => h((mdComponents.li || 'li') as any, {}, ...children),
	blockquote: (node, children, mdComponents) => h((mdComponents.blockquote || 'blockquote') as any, {}, ...children),
	emphasis: (node, children, mdComponents) => h((mdComponents.em || 'em') as any, {}, ...children),
	strong: (node, children, mdComponents) => h((mdComponents.strong || 'strong') as any, {}, ...children),
	inlineCode: (node, _children, mdComponents) => h((mdComponents.code || 'code') as any, {}, node.value),
	code: (node, _children, mdComponents) => {
		const Pre = mdComponents.pre || 'pre';
		const Code = mdComponents.code || 'code';
		return h(Pre as any, {}, h(Code as any, {}, node.value));
	},
	link: (node, children, mdComponents) => h((mdComponents.a || 'a') as any, { href: node.url, title: node.title }, ...children),
	thematicBreak: (_node, _children, mdComponents) => h((mdComponents.hr || 'hr') as any, {}),
	break: (_node, _children, mdComponents) => h((mdComponents.br || 'br') as any, {}),
};
