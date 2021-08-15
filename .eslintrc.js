module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
	},

	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['./packages/*/tsconfig.json'],
		sourceType: 'module',
		extraFileExtensions: ['.vue'],
	},
	ignorePatterns: [
		'.eslintrc.js',
		'**/node_modules/**',
		'**/dist/**',
		'**/test/**',
		'**/*.js',
	],

	extends: [
		/**
		 * Config for Airbnb style guide for TS, /base to remove React rules
		 * https://github.com/iamturns/eslint-config-airbnb-typescript
		 */
		'airbnb-typescript/base',

		/**
		 * Config to disable ESLint rules covered by Prettier
		 * https://github.com/prettier/eslint-config-prettier
		 */
		'prettier',
	],

	plugins: [
		/**
		 * Plugin with lint rules for import/export syntax
		 * https://github.com/import-js/eslint-plugin-import
		 */
		'eslint-plugin-import',

		/**
		 * @typescript-eslint/eslint-plugin is required by eslint-config-airbnb-typescript
		 * See step 2: https://github.com/iamturns/eslint-config-airbnb-typescript#2-install-eslint-plugins
		 */
		'@typescript-eslint',

		/**
		 * Plugin to report formatting violations as lint violations
		 * https://github.com/prettier/eslint-plugin-prettier
		 */
		'prettier',
	],

	rules: {
		// ******************************************************************
		//             modern rules required by prettier plugin
		// ******************************************************************

		// https://github.com/prettier/eslint-plugin-prettier#recommended-configuration

		// TODO: Restore to `'error'` after dealing with lintings in all packages.
		'prettier/prettier': 'off',

		'arrow-body-style': 'off',
		'prefer-arrow-callback': 'off',

		// ******************************************************************
		//                    base modern rules (enabled)
		// ******************************************************************

		// These modern rules are added by eslint-config-airbnb-typescript and
		// @typescript-eslint/eslint-plugin and are all enabled by default,
		// since they are part of the config.

		// https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base/rules

		// ******************************************************************
		//                 additional modern rules (enabled)
		// ******************************************************************

		// These rules are added on top of the base modern rules.

		// ----------------------------------
		//              ESLint
		// ----------------------------------

		/**
		 * https://eslint.org/docs/rules/id-denylist
		 */
		'id-denylist': [
			'error',
			'e',
			'err',
			'cb',
			'callback',
			'any',
			'Number',
			'number',
			'String',
			'string',
			'Boolean',
			'boolean',
			'Undefined',
			'undefined',
		],

		// ----------------------------------
		//        @typescript-eslint
		// ----------------------------------

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/array-type.md
		 */
		'@typescript-eslint/array-type': ['error', { default: 'array-simple' }],

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/await-thenable.md
		 */
		'@typescript-eslint/await-thenable': 'error',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-types.md
		 */
		'@typescript-eslint/ban-types': [
			'error',
			{
				types: {
					Object: {
						message: 'Use object instead',
						fixWith: 'object',
					},
					String: {
						message: 'Use string instead',
						fixWith: 'string',
					},
					Boolean: {
						message: 'Use boolean instead',
						fixWith: 'boolean',
					},
					Number: {
						message: 'Use number instead',
						fixWith: 'number',
					},
					Symbol: {
						message: 'Use symbol instead',
						fixWith: 'symbol',
					},
					Function: {
						message: [
							'The `Function` type accepts any function-like value.',
							'It provides no type safety when calling the function, which can be a common source of bugs.',
							'It also accepts things like class declarations, which will throw at runtime as they will not be called with `new`.',
							'If you are expecting the function to accept certain arguments, you should explicitly define the function shape.',
						].join('\n'),
					},
				},
				extendDefaults: false,
			},
		],

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-assertions.md
		 */
		'@typescript-eslint/consistent-type-assertions': 'error',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-member-accessibility.md
		 */
		'@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-delimiter-style.md
		 */
		'@typescript-eslint/member-delimiter-style': [
			'error',
			{
				multiline: {
					delimiter: 'semi',
					requireLast: true,
				},
				singleline: {
					delimiter: 'semi',
					requireLast: false,
				},
			},
		],

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
		 */
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'default',
				format: ['camelCase'],
			},
			{
				selector: 'variable',
				format: ['camelCase', 'snake_case', 'UPPER_CASE'],
				leadingUnderscore: 'allowSingleOrDouble',
				trailingUnderscore: 'allowSingleOrDouble',
			},
			/**
			 * ASKBEN: Remove `I` prefix for interfaces?
			 * - Reasons: TS team advises against I prefix
			 * 	https://github.com/microsoft/TypeScript-Handbook/issues/121
			 * - Type aliases are preferable over interfaces:
			 * 	https://fettblog.eu/tidy-typescript-prefer-type-aliases/
			 * - General recommendations to remove this
			 * https://passionfordev.com/you-dont-need-to-prefix-interfaces-in-typescript-with-i/
			 * https://til.hashrocket.com/posts/cfnlyzxcrc-do-not-prefix-typescript-interface-names
			 *
			 * BUT: Still prevalent in codebase.
			 */
			{
				selector: 'interface',
				format: ['PascalCase'],
				prefix: ['I'],
			},
			{
				selector: 'property',
				format: ['camelCase', 'snake_case'],
				leadingUnderscore: 'allowSingleOrDouble',
				trailingUnderscore: 'allowSingleOrDouble',
			},
			{
				selector: 'typeLike',
				format: ['PascalCase'],
			},
			{
				selector: ['method', 'function'],
				format: ['camelCase'],
				leadingUnderscore: 'allowSingleOrDouble',
			},
		],

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-duplicate-imports.md
		 */
		'@typescript-eslint/no-duplicate-imports': 'error',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
		 */
		'@typescript-eslint/no-empty-function': 'error',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md
		 */
		'@typescript-eslint/no-explicit-any': 'error',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-inferrable-types.md
		 */
		'@typescript-eslint/no-inferrable-types': 'error',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-invalid-void-type.md
		 */
		'@typescript-eslint/no-invalid-void-type': 'error',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-misused-promises.md
		 */
		'@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-namespace.md
		 */
		'@typescript-eslint/no-namespace': 'error',

		/**
		 * https://eslint.org/docs/1.0.0/rules/no-throw-literal
		 */
		'@typescript-eslint/no-throw-literal': 'error',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-qualifier.md
		 */
		'@typescript-eslint/no-unnecessary-qualifier': 'error',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-type-assertion.md
		 */
		'@typescript-eslint/no-unnecessary-type-assertion': 'error',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-expressions.md
		 */
		'@typescript-eslint/no-unused-expressions': 'error',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
		 */
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_' }],

		/**
		 * ASKBEN: Given the codebase style, this rule triggers multiple warnings that will
		 * clutter up the lint report every time. Disable permanently?
		 *
		 * Temporarily disabled until we decide.
		 *
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-nullish-coalescing.md
		 */
		'@typescript-eslint/prefer-nullish-coalescing': 'off',

		/**
		 * ASKBEN: Given the codebase style, this rule triggers multiple warnings that will
		 * clutter up the lint report every time. Disable permanently?
		 *
		 * Temporarily disabled until we decide.
		 *
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-optional-chain.md
		 */
		'@typescript-eslint/prefer-optional-chain': 'off',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/promise-function-async.md
		 */
		'@typescript-eslint/promise-function-async': 'error',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/triple-slash-reference.md
		 */
		'@typescript-eslint/triple-slash-reference': 'error',

		// ----------------------------------
		//       eslint-plugin-import
		// ----------------------------------

		/**
		 * https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-default-export.md
		 */
		'import/no-default-export': 'error',

		/**
		 * https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/order.md
		 */
		'import/order': 'error',

		// ******************************************************************
		//                 modern rule overrides (enabled)
		// ******************************************************************

		// These rules override default values in the base modern rules.

		// ----------------------------------
		//              ESLint
		// ----------------------------------

		/**
		 * https://eslint.org/docs/rules/no-unused-vars
		 */
		'no-unused-vars': 'off',

		/**
		 * ASKBEN: Given the codebase style, this rule triggers multiple warnings that will
		 * clutter up the lint report every time. Disable permanently?
		 *
		 * Temporarily disabled until we decide.
		 *
		 * RISKY REGEX CHANGE
		 *
		 * https://eslint.org/docs/rules/no-useless-escape
		 */
		'no-useless-escape': 'off',

		/**
		 * https://eslint.org/docs/rules/prefer-spread
		 *
		 * ASKBEN: Given the codebase style, this rule triggers multiple warnings that will
		 * clutter up the lint report every time. Disable permanently?
		 *
		 * Temporarily disabled until we decide.
		 */
		'prefer-spread': 'off', // originally 'warn', not 'err'

		/**
		 * ASKBEN: The following five overrides need to be included here because the
		 * Airbnb base specifies an option while we do not, but lint types are the same.
		 *
		 * Do we adopt the options from the Airbnb base and remove these overrides?
		 */

		/**
		 * ESLint equivalent of `switch-default` from TSLint.
		 * https://eslint.org/docs/rules/default-case
		 *
		 * Airbnb: 'default-case': ['error', { commentPattern: '^no default$' }],
		 *
		 * We do not specify a comment pattern.
		 */
		'default-case': 'error',

		/**
		 * ESLint equivalent of `triple-equals` from TSLint.
		 * https://eslint.org/docs/rules/eqeqeq
		 *
		 * Airbnb: eqeqeq: ['error', 'always', { null: 'ignore' }]
		 *
		 * We are not using the additional option
		 */
		eqeqeq: 'error',

		/**
		 * ESLint equivalent of `no-conditional-assignment` from TSLint.
		 * https://eslint.org/docs/rules/no-cond-assign
		 *
		 * Airbnb: 'no-cond-assign': ['error', 'always']
		 *
		 * We are using the default `except-parens` instead of always
		 */
		'no-cond-assign': 'error',

		/**
		 * ESLint equivalent of our setting in `object-literal-shorthand` from TSLint.
		 * https://eslint.org/docs/rules/object-shorthand
		 *
		 * Airbnb: 'object-shorthand': ['error', 'always', {
      	ignoreConstructors: false,
      	avoidQuotes: true,
    	}],
		 * We are not using the additional options
		 */
		'object-shorthand': 'error',

		/**
		 * ESLint equivalent of `prefer-const` from TSLint.
		 * https://eslint.org/docs/rules/prefer-const
		 *
		 * Airbnb: 'prefer-const': ['error', {
      	destructuring: 'any',
      	ignoreReadBeforeAssign: true,
    	}],
     * We are not using the additional options
		 */
		'prefer-const': 'error',

		// ******************************************************************
		//                   base modern rules (disabled)
		// ******************************************************************

		// These modern rules are added by eslint-config-airbnb-typescript and
		// @typescript-eslint/eslint-plugin but are disabled for compatibility
		// with the existing codebase style due to excessive violations.

		// ----------------------------------
		//              ESLint
		// ----------------------------------

		/**
		 * https://eslint.org/docs/rules/func-names
		 */
		'func-names': 'off',

		/**
		 * https://eslint.org/docs/rules/no-labels
		 */
		'no-labels': 'off',

		/**
		 * https://eslint.org/docs/rules/new-cap
		 */
		'new-cap': 'off',

		/**
		 * https://eslint.org/docs/rules/no-invalid-this
		 */
		'no-invalid-this': 'off',

		/**
		 * https://eslint.org/docs/rules/class-methods-use-this
		 */
		'class-methods-use-this': 'off',

		/**
		 * https://eslint.org/docs/rules/no-restricted-syntax
		 *
		 * Especially because of this restricted syntax: `iterators/generators require
		 * regenerator-runtime, which is too heavyweight for this guide to allow them.
		 * Separately, loops should be avoided in favor of array iterations`
		 */
		'no-restricted-syntax': 'off',

		/**
		 * https://eslint.org/docs/rules/max-classes-per-file
		 */
		'max-classes-per-file': 'off',

		/**
		 * https://eslint.org/docs/rules/no-param-reassign
		 */
		'no-param-reassign': 'off',

		/**
		 * https://eslint.org/docs/rules/no-continue
		 */
		'no-continue': 'off',

		/**
		 * https://eslint.org/docs/rules/no-console
		 */
		'no-console': 'off',

		/**
		 * https://eslint.org/docs/rules/no-plusplus
		 */
		'no-plusplus': 'off',

		/**
		 * https://eslint.org/docs/rules/no-underscore-dangle
		 */
		'no-underscore-dangle': 'off',

		/**
		 * https://eslint.org/docs/rules/no-empty
		 */
		'no-empty': 'off',

		/**
		 * https://eslint.org/docs/rules/one-var
		 */
		'one-var': 'off',

		/**
		 * https://eslint.org/docs/rules/no-prototype-builtins
		 */
		'no-prototype-builtins': 'off',

		/**
		 * https://eslint.org/docs/rules/consistent-return
		 */
		'consistent-return': 'off',

		/**
		 * https://eslint.org/docs/rules/no-else-return
		 */
		'no-else-return': 'off',

		/**
		 * https://eslint.org/docs/rules/no-await-in-loop
		 */
		'no-await-in-loop': 'off',

		/**
		 * https://eslint.org/docs/rules/no-underscore-dangle
		 */
		'no-underscore-dangle': 'off',

		/**
		 * Partial ESLint equivalent of `no-string-throw` from TSLint.
		 * https://eslint.org/docs/rules/no-throw-literal
		 */
		'no-throw-literal': 'off',

		// ----------------------------------
		//        @typescript-eslint
		// ----------------------------------

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/lines-between-class-members.md
		 */
		'@typescript-eslint/lines-between-class-members': 'off',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
		 */
		'@typescript-eslint/no-shadow': 'off',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
		 */
		'@typescript-eslint/no-use-before-define': 'off',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-loop-func.md
		 */
		'@typescript-eslint/no-loop-func': 'off',

		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
		 */
		'@typescript-eslint/naming-convention': 'off',

		// ----------------------------------
		//             import
		// ----------------------------------

		/**
		 * https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
		 */
		'import/no-extraneous-dependencies': 'off',

		/**
		 * https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-cycle.md
		 */
		'import/no-cycle': 'off',

		/**
		 * https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
		 */
		'import/prefer-default-export': 'off',
	},
};

// ******************************************************************
//                           removed rules
// ******************************************************************

// ---------------------------------------------------
//            rules delegated to Prettier
// ---------------------------------------------------

// array-element-newline
// https://eslint.org/docs/rules/array-element-newline

// indent
// https://eslint.org/docs/rules/indent

// @typescript-eslint/indent
// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/indent.md

// @typescript-eslint/semi
// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/semi.md

/**
 * ESLint equivalent of `trailing-comma` from TSLint.
 * https://eslint.org/docs/rules/comma-dangle
 */
//  'comma-dangle': [
// 	'error',
// 	{
// 		objects: 'always-multiline',
// 		arrays: 'always-multiline',
// 		functions: 'always-multiline',
// 		imports: 'always-multiline',
// 		exports: 'always-multiline',
// 	},
// ],

// ---------------------------------------------------
//       rules removed for miscellaneous reasons
// ---------------------------------------------------

/**
 * Reasons listed in Notion document
 * https://www.notion.so/n8n/Linting-Formatting-caf1690c53aa438ba979539347ac40f7
 */

// id-match
// https://eslint.org/docs/rules/id-match

// radix
// https://eslint.org/docs/rules/radix

// @typescript-eslint/explicit-module-boundary-types
// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.md

// @typescript-eslint/no-require-imports
// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-require-imports.md

// ---------------------------------------------------
//             rules covered by Airbnb base
// ---------------------------------------------------

/**
 * Coverage must *exact*, meaning with the same default log type and options
 *
 * Checked using ruleset comparison app: https://sqren.github.io/eslint-compare
 *
 * And double-checked by searching in repo:
 * https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base/rules
 *
 * Example: https://github.com/airbnb/javascript/blob/f5c14cae2ff58000cead98290b8ec4b54dda2f14/packages/eslint-config-airbnb-base/rules/best-practices.js#L31
 */

// guard-for-in
// https://eslint.org/docs/rules/guard-for-in

// no-caller
// https://eslint.org/docs/rules/no-caller

// no-duplicate-imports
// https://eslint.org/docs/rules/no-duplicate-imports

// no-new-wrappers
// https://eslint.org/docs/rules/no-new-wrappers

// no-redeclare
// https://eslint.org/docs/rules/no-redeclare

// no-unused-labels
// https://eslint.org/docs/rules/no-unused-labels

// curly
// https://eslint.org/docs/rules/curly

// no-array-constructor
// ESLint equivalent of our setting in `ban` from TSLint.
// https://eslint.org/docs/rules/no-array-constructor

// no-var
// ESLint equivalent of `no-var-keyword` from TSLint.
// https://eslint.org/docs/rules/no-var

// use-isnan
// ESLint equivalent of `use-isnan` from TSLint.
// https://eslint.org/docs/rules/use-isnan

// no-debugger
// ESLint equivalent of `no-debugger` from TSLint.
// https://eslint.org/docs/rules/no-debugger

// new-parens
// ESLint equivalent of `new-parens` from TSLint.
// https://eslint.org/docs/rules/new-parens

// no-unused-expressions
// Covered by @typescript-eslint/no-unused-expressions

// ---------------------------------------------------
//        rules overriden due to prettier plugin
// ---------------------------------------------------

// https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
// prefer-arrow-callback
// https://eslint.org/docs/rules/prefer-arrow-callback
// original options: ['off', { allowNamedFunctions: true }],

// arrow-body-style
// https://eslint.org/docs/rules/arrow-body-style

// ASKBEN: Currently, most ESLint dependencies are in /node_modules because
// of /workflow. A few additional Vue/ESLint dependencies are added by /editor-ui.
// Should we add these dependencies to all other package.json files?
// /core + /cli + /nodes-base + /node-dev

// ASKBEN: Do we want a lint command that checks all six packages?
// Or one per package? Example: eslint packages/**/*.ts

// ASKBEN: ESLint reads from the `include` key in every tsconfig.json to decide
// which files to lint. This means we have to transpile what we lint.
// Examples: The templates in /node-dev are not being transpiled, so they trigger
// errors when linting. The TypeORM config in cli/migrations also triggers them.
// Therefore, I had to add `templates/**/*` and `cli/migrations` in `include` in
// their respective tsconfig.json files. Any better way?

// ASKBEN: I added lint exceptions for most non-autofixable lintings, in order
// to avoid breaking functionality. Is this what we want or should I fix as well?
