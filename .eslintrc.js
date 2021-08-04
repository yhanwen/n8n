module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
	},

	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: [
			'./packages/*/tsconfig.json'
		],
		sourceType: 'module',
	},
	ignorePatterns: ['.eslintrc.js'],

	extends: [
		'airbnb-typescript/base',
		'prettier'
	],
	plugins: [
		'eslint-plugin-import',
		'@typescript-eslint',
	],

	rules: {

		// toggled off for compatibility with codebase

		'class-methods-use-this': 'off',
		'no-restricted-syntax': 'off',
		'max-classes-per-file': 'off',
		'no-param-reassign': 'off',
		'no-continue': 'off',
		'no-console': 'off',
		'no-plusplus': 'off',
		'no-underscore-dangle': 'off',
		'no-empty': 'off',
		'one-var': 'off',
		'no-prototype-builtins': 'off',
		'consistent-return': 'off',
		'no-else-return': 'off',
		'no-await-in-loop': 'off',
		'no-underscore-dangle': 'off',
		'@typescript-eslint/lines-between-class-members': 'off',
		'@typescript-eslint/no-shadow': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/no-loop-func': 'off',
		'import/no-extraneous-dependencies': 'off',
		'import/no-cycle': 'off',
		'import/prefer-default-export': 'off',

		// ----------------------------------
		//            eslint
		// ----------------------------------

		'arrow-body-style': ['error', 'as-needed'],
		'comma-dangle': [
			'error',
			{
				objects: 'always-multiline',
				arrays: 'always-multiline',
				functions: 'always-multiline',
				imports: 'always-multiline',
				exports: 'always-multiline',
			},
		],
		curly: ['error', 'multi-line'],
		'default-case': 'error',
		eqeqeq: 'error',
		'guard-for-in': 'error',
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
		'new-parens': 'error',
		'no-caller': 'error',
		'no-cond-assign': 'error',
		'no-debugger': 'error',
		'no-duplicate-imports': 'off',
		'no-invalid-this': 'error',
		'no-new-wrappers': 'error',
		'no-redeclare': 'error',
		'no-throw-literal': 'off',
		'no-unused-expressions': 'off',
		'no-unused-labels': 'error',
		'no-unused-vars': 'off',
		'no-array-constructor': 'error',
		'no-useless-escape': 'warn',
		'no-var': 'error',
		'object-shorthand': 'error',
		'prefer-arrow-callback': ['off', { "allowNamedFunctions": true }],
		'prefer-const': 'error',
		'prefer-spread': 'warn',
		'use-isnan': 'error',

		// ----------------------------------
		//        @typescript-eslint
		// ----------------------------------

		'@typescript-eslint/array-type': [
			'error', { default: 'array-simple' },
		],
		'@typescript-eslint/await-thenable': 'error',
		'@typescript-eslint/ban-types': [
			'error', {
				// TODO: Check with Jan if he prefers the defaults (https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-types.md)
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
		'@typescript-eslint/consistent-type-assertions': 'error',
		'@typescript-eslint/explicit-member-accessibility': [
			'error', { accessibility: 'no-public' },
		],
		'@typescript-eslint/member-delimiter-style': [
			'error', {
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
		'@typescript-eslint/naming-convention': [
			'error', {
				selector: 'default',
				format: ['camelCase'],
			},
			{
				selector: 'variable',
				format: ['camelCase', 'snake_case', 'UPPER_CASE'],
				leadingUnderscore: 'allowSingleOrDouble',
				trailingUnderscore: 'allowSingleOrDouble',
			},
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
		'@typescript-eslint/no-duplicate-imports': 'error',
		'@typescript-eslint/no-empty-function': 'error',
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-inferrable-types': 'error',
		'@typescript-eslint/no-invalid-void-type': 'error',
		'@typescript-eslint/no-misused-promises': [
			'error', { checksVoidReturn: false },
		],
		'@typescript-eslint/no-namespace': 'error',
		'@typescript-eslint/no-throw-literal': 'error',
		'@typescript-eslint/no-unnecessary-qualifier': 'error',
		'@typescript-eslint/no-unnecessary-type-assertion': 'error',
		'@typescript-eslint/no-unused-expressions': 'error',
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/prefer-nullish-coalescing': 'warn',
		'@typescript-eslint/prefer-optional-chain': 'warn',
		'@typescript-eslint/promise-function-async': 'error',

		'@typescript-eslint/triple-slash-reference': 'error',

		// ----------------------------------
		//       eslint-plugin-import
		// ----------------------------------

		'import/no-default-export': 'error',
		'import/order': 'error',

	},
};

		// disabled - delegated to Prettier

			// 'array-element-newline': [
			// 	'error',
			// 	{
			// 		ArrayExpression: 'consistent',
			// 		ArrayPattern: { multiline: true },
			// 	},
			// ], // disabled - delegate to Prettier
			// '@typescript-eslint/indent': ['error', 'tab'],
			// '@typescript-eslint/semi': ['error', 'always'],
			// indent: 'off',

		// disabled - see reasoning in Notion document
		// https://www.notion.so/n8n/Linting-Formatting-caf1690c53aa438ba979539347ac40f7

			// 'id-match': 'error',
			// radix: 'error',
			// '@typescript-eslint/explicit-module-boundary-types': 'error',
			// '@typescript-eslint/no-require-imports': 'error', // see Notion doc
