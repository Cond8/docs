import { Plugin } from 'unified';
import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

// Define a custom interface for our slot nodes.
export interface SlotNode extends Node {
	type: 'slot';
	name: string;
	props: Record<string, string>;
	children: Node[];
}

/**
 * A Remark plugin to transform custom slot syntax into SlotNodes.
 *
 * Supported syntax:
 *   @ComponentName[props]{children content}
 *
 * Example:
 *   @Callout[type="info"]{This is **important**.}
 *
 * Note:
 *   - The children content is captured non-greedily and supports multi-line content.
 *   - Escaping or nested curly braces are not supported in this version.
 */
const remarkSlots: Plugin = function () {
	return (tree: Node) => {
		visit(tree, 'text', (node: any, index: number | null, parent: Parent | null) => {
			// Updated regex:
			//   @              => literal '@'
			//   ([A-Za-z0-9]+)  => capture component name (e.g., "Callout")
			//   (?:\[([^\]]+)\])? => optionally capture props string inside square brackets (group 2)
			//   \{([\s\S]*?)\}   => non-greedy capture of children content (group 3), supporting multi-line
			const slotRegex = /@([a-zA-Z_][\w-]*)(?:\[([^\]]*)])?\{([^}]*)}/g;
			const value: string = node.value;
			let match;
			let lastIndex = 0;
			const newNodes: Node[] = [];

			// Loop through all matches within this text node.
			while ((match = slotRegex.exec(value)) !== null) {
				const matchStart = match.index;
				const matchEnd = slotRegex.lastIndex;

				// Add any text before the match as a regular text node.
				if (matchStart > lastIndex) {
					newNodes.push({
						type: 'text',
						data: value.slice(lastIndex, matchStart),
					});
				}

				const componentName = match[1];
				const propsStr = match[2]; // Optional props string
				const childrenContent = match[3];

				// Parse properties from the props string.
				const props: Record<string, string> = {};
				if (propsStr) {
					// Regex captures key="value" pairs.
					const propRegex = /(\w+)="([^"]+)"/g;
					let propMatch;
					while ((propMatch = propRegex.exec(propsStr)) !== null) {
						props[propMatch[1]] = propMatch[2];
					}
				}

				// Build the custom SlotNode.
				const slotNode: SlotNode = {
					type: 'slot',
					name: componentName,
					props,
					children: [
						// Wrap the children content in a text node.
						// (Later, you may re-parse this string into a full MDAST if needed.)
						{ type: 'text', data: childrenContent },
					],
				};
				newNodes.push(slotNode);
				lastIndex = matchEnd;
			}

			// Append any trailing text after the last match.
			if (lastIndex < value.length) {
				newNodes.push({
					type: 'text',
					data: value.slice(lastIndex),
				});
			}

			// Replace the original text node with the new set of nodes.
			if (parent && typeof index === 'number') {
				parent.children.splice(index, 1, ...newNodes);
			}
		});
	};
};

export default remarkSlots;
