module.exports = {
	extends: [
		/**
		 * Our global ESLint config
		 */
		'../../.eslintrc.js',

		/**
		 * Changed from `plugin:vue/essential` to `plugin:vue/recommended`
		 *
		 * https://github.com/vuejs/vue-cli/tree/dev/packages/@vue/cli-plugin-eslint
		 * https://eslint.vuejs.org/user-guide/#usage
		 * https://eslint.vuejs.org/rules/
		 */
		'plugin:vue/recommended',
	],

	parserOptions: {
		parser: '@typescript-eslint/parser',
		extraFileExtensions: ['.vue'],
		project: __dirname + '/tsconfig.json',
		sourceType: 'module',
	},

	// ignorePatterns: [
		// '.eslintrc.js',
		// '**/.eslintrc.js',
	// ],

	rules: {
		// ******************************************************************
		//             modern rules disabled due to Vue needs
		// ******************************************************************

		/**
		 * Overrides our global config, because all Vue components are exported as defaults.
		 *
		 * https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-default-export.md
		 */
		'import/no-default-export': 'off',

		/**
		 * Overrides our global config, because of ESLint cannot resolve `@` in path.
		 *
		 * https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-default-export.md
		 */
		'import/no-unresolved': 'off',

		// ******************************************************************
		//          modern rules disabled due to codebase style
		// ******************************************************************

		/**
		 * ASKBEN: Given the codebase style, these rule triggers multiple warnings that will
		 * clutter up the lint report every time. Disable permanently?
		 *
		 * IMPORTANT: 200 errors and 1900 warnings still left after disabling all these.
		 *
		 * All these are temporarily disabled until we decide.
		 */
		'vue/no-v-html': 'off',
		'vue/html-indent': 'off',
		'vue/no-unused-vars': 'off',
		'vue/require-prop-types': 'off',
		'vue/no-mutating-props': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'prefer-destructuring': 'off',
		'id-denylist': 'off',
		'no-undef': 'off',
		'no-lonely-if': 'off',
		'vue/no-lone-template': 'off',
		'prefer-const': 'off',
		'@typescript-eslint/await-thenable': 'off',
		'no-lone-template': 'off',
		'@typescript-eslint/no-unnecessary-type-assertion': 'off',
		'array-callback-return': 'off',
		'no-nested-ternary': 'off',
		'no-restricted-globals': 'off',

		// ASKBEN: This conflicts with our global ESLint config. Remove?
		// 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',

		// ASKBEN: This conflicts with Airbnb base. Remove?
		// 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

		// ASKBEN: This conflicts with `useTabs` from Prettier. Remove?
		// All components are using spaces instead of tabs.
		// 'no-tabs': 0,
	},
};

// ---------------------------------------------------
//   config removed because covered by global config
// ---------------------------------------------------

/**
 * Contains two rulesets:
 * - @vue/eslint-config-typescript
 * - @vue/eslint-config-typescript/recommended
 *
 * https://github.com/vuejs/eslint-config-typescript
 */
// '@vue/typescript',
