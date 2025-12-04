import { parse } from 'svelte/compiler';
import { walk } from 'estree-walker';

/**
 * Svelte preprocessor to remove specified attributes from components
 * @param {Object} options - Configuration options
 * @param {string} [options.envVar='STRIP_ATTRIBUTES'] - Environment variable name to check
 * @param {string} [options.expected='1'] - Expected value for the environment variable
 * @param {string[]} [options.attributes=[]] - Array of attribute names to remove
 */
export default function removeAttributesPreprocessor({
	envVar = 'STRIP_ATTRIBUTES',
	expected = '1',
	attributes = []
} = {}) {

	return {
		markup({ content }) {
			// Get environment variable (supports both Node.js and browser environments)
			const envValue = typeof process !== 'undefined' && process.env ? process.env[envVar] : undefined;
			const enabled = envValue == expected;
			if (!enabled) return { code: content };

			const ast = parse(content);

			if (ast.instance) {
				walk(ast.instance, {
					enter(node) {
						if (node.type === 'Property' && node.key && 'name' in node.key && attributes.includes(node.key.name)) {
							this.remove();
						}
					}
				});
			}

			if (ast.html) {
				walk(ast.html, {
					enter(node) {
						// @ts-ignore - Svelte AST types are not fully compatible with estree-walker
						if (node.type === 'Attribute' && attributes.includes(node.name)) {
							this.remove();
						}
						// @ts-ignore - Svelte AST types are not fully compatible with estree-walker
						if (node.type === 'Attribute' && node.expression?.type === 'ObjectExpression') {
							// @ts-ignore - Svelte AST types are not fully compatible with estree-walker
							node.expression.properties = node.expression.properties.filter(
								(p) =>
									!(p.key && ('name' in p.key && attributes.includes(p.key.name) || 'value' in p.key && attributes.includes(p.key.value)))
							);
						}
					}
				});
			}

			let code = content;
			for (const attr of attributes) {
				const escapedAttr = attr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

				code = code
					.replace(new RegExp(`(\\s+)${escapedAttr}\\s*=\\s*(["'])(?:[^"\\\\]|\\\\.)*\\2`, 'g'), '$1')
					.replace(new RegExp(`(\\s+)${escapedAttr}\\s*=\\s*\\{[^}]*\\}`, 'g'), '$1')
					.replace(new RegExp(`(\\{[^}]*?)(['"]?)${escapedAttr}\\2\\s*:\\s*[^,}]+(,?\\s*)([^}]*\\})`, 'g'), (_, p1, __, ___, p4) => {
						return p1 + p4;
					});
			}

			code = code
				.replace(/,\s*,/g, ',')
				.replace(/\{\s*,/g, '{')
				.replace(/,\s*\}/g, '}');

			return { code };
		}
	};
}

// Also provide named export for library flexibility
export { removeAttributesPreprocessor };
