const path = require('path')

module.exports = [
  {
    test: /\.ts$/,
    // exclude: /(node_modules|\.webpack)/, // do not exclude node_modules
		use: { loader: 'ts-loader' }
  },
	{
		test: /\.vue$/,
		// exclude: /(node_modules|\.webpack)/, // do not exclude node_modules
		use: {
			loader: 'vue-loader',
		}
	},

	// {
	// 	test: /\.vue$/,
	// 	include: /node_modules\/n8n-design-system/,
	// 	use: {
	// 		loader: 'ts-loader',
	// 	}
	// },
	// {
	// 	test: /\.vue$/,
	// 	include: /node_modules\/n8n-design-system/,
	// 	use: {
	// 		loader: 'vue-loader',
	// 	}
	// },

	// https://storybook.js.org/docs/react/configure/webpack#extending-storybooks-webpack-config
	// {
	// 	test: /\.scss$/,
	// 	include: /node_modules\/n8n-design-system/,
	// 	use: ['style-loader', 'css-loader', 'sass-loader'],
	// },
	// {
	// 	test: /\.vue$/,
	// 	include: /node_modules\/n8n-design-system/,
	// 	use: ['ts-loader', 'vue-loader'],
	// }

	// {
	// 	include: /node_modules\/n8n-design-system/,
	// 	test: /\.scss$/,

	// 			use: [
	// 				'ts-loader',
	// 				'vue-style-loader',
	// 				{
	// 					loader: 'css-loader',
	// 					options: {
	// 						modules: true,
	// 					},
	// 				},
	// 				'sass-loader',
	// 			],

	// 	}

];

// https://github.com/laravel-mix/laravel-mix/issues/2613#issuecomment-749355738
// https://stackoverflow.com/a/67129623

// exclude: /(\.webpack)/,
		// use: [ { loader: 'vue-loader, options: { transpileOnly: true }' } ]
