# svelte-remove-attributes-preprocessor

Svelte / SvelteKit preprocessor to remove specified attributes (e.g., `data-testid`, `data-cy`) at build time. Supports spread syntax and can be enabled via environment variables.

## Features

- 🗑️ Remove attributes at build time (e.g., `data-testid`)
- 🔄 Supports spread syntax (`{...props}`)
- 🌍 Environment variable-based toggling

## Installation

```bash
pnpm add -D svelte-remove-attributes-preprocessor
```

## Usage

### Basic Usage

Add the preprocessor to your `svelte.config.js`:

```javascript
import { removeAttributesPreprocessor } from 'svelte-remove-attributes-preprocessor';

export default {
	preprocess: [
		removeAttributesPreprocessor({
			attributes: ['data-testid']
		})
	]
};
```

### With Environment Variable

Enable/disable attribute removal via environment variable:

```javascript
import { removeAttributesPreprocessor } from 'svelte-remove-attributes-preprocessor';

export default {
	preprocess: [
		removeAttributesPreprocessor({
			envVar: 'STRIP_ATTRIBUTES', // default: 'STRIP_ATTRIBUTES'
			expected: '1', // default: '1'
			attributes: ['data-testid']
		})
	]
};
```

Then set the environment variable when building:

```bash
STRIP_ATTRIBUTES=1 pnpm build
```

### SvelteKit

For SvelteKit, add it to `vite.config.js` or `svelte.config.js`:

```javascript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { removeAttributesPreprocessor } from 'svelte-remove-attributes-preprocessor';

export default defineConfig({
	plugins: [sveltekit()],
	// ... other config
});

// In svelte.config.js
import adapter from '@sveltejs/adapter-auto';
import { removeAttributesPreprocessor } from 'svelte-remove-attributes-preprocessor';

export default {
	kit: {
		adapter: adapter()
	},
	preprocess: [
		removeAttributesPreprocessor({
			attributes: ['data-testid']
		})
	]
};
```

## Options

| Option       | Type       | Default              | Description                                 |
| ------------ | ---------- | -------------------- | ------------------------------------------- |
| `attributes` | `string[]` | `[]`                 | Array of attribute names to remove          |
| `envVar`     | `string`   | `'STRIP_ATTRIBUTES'` | Environment variable name to check          |
| `expected`   | `string`   | `'1'`                | Expected value for the environment variable |

## Examples

### Remove test attributes in production

```javascript
// svelte.config.js
import { removeAttributesPreprocessor } from 'svelte-remove-attributes-preprocessor';

export default {
	preprocess: [
		removeAttributesPreprocessor({
			attributes: ['data-testid', 'data-cy', 'data-test']
		})
	]
};
```

### Conditional removal via environment

```javascript
// Only remove attributes when STRIP_ATTRIBUTES=1
removeAttributesPreprocessor({
	envVar: 'STRIP_ATTRIBUTES',
	expected: '1',
	attributes: ['data-testid']
})
```