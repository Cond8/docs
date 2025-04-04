// src/_stage/utils/markdown/transform-to-jsx.ts
import { Fragment, h, JSX } from 'preact';
import type { Node } from 'unist';
import { VFile } from 'vfile';
import { Components } from '../../components/md-components';
import { renderNodeMap } from './element-mapper';

/**
 * A Unified plugin to transform an MDAST to a JSX tree.
 *
 * It uses the renderNodeMap to recursively convert each node.
 * It also attaches a compiler so that the result of `process` is the JSX tree.
 *
 * @param mdComponents - The components map to use during rendering.
 * @returns A transformer function with an attached compiler.
 */
export function transformToJSX(mdComponents: Components) {
	// Helper function: Recursively render a node (and its children) to JSX.
	function renderNode(node: any): JSX.Element | string {
		// If the node has children, render them recursively.
		const children: Array<JSX.Element | string> = node.children ? node.children.map(renderNode) : [];

		// Special handling for the root node: wrap its children in a Fragment.
		if (node.type === 'root') {
			return h(Fragment, {}, ...children);
		}

		// Look up the node type in the render map.
		const renderer = renderNodeMap[node.type];
		if (typeof renderer === 'function') {
			return renderer(node, children, mdComponents);
		}

		// Fallback: if the node contains a 'value', return it.
		if (node.value) {
			return node.value;
		}

		// Otherwise, just wrap the children in a Fragment.
		return h(Fragment, {}, ...children);
	}

	// The transformer function for unified.
	const transformer = (tree: Node, file: VFile) => {
		file.result = renderNode(tree);
	};

	// Attach a compiler so that the final result is produced during the stringify phase.
	transformer.Compiler = (tree: Node, file: VFile) => {
		return renderNode(tree);
	};

	return transformer;
}
