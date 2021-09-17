const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const rules = require('./webpack.rules');

rules.push({
	test: /\.css$/,
	use: [
		{ loader: 'css-loader' },
	],
});

rules.push({
	test: /\.s[ac]ss$/i,
	use: [
		{ loader: 'style-loader' },
		{ loader: 'css-loader' },
		{
			loader: 'sass-loader',
			options: {
				// sourceMap: false,
				prependData: `@import "${path.resolve(__dirname, 'src/n8n-theme.scss')}";`
			}
		},
	],
});

module.exports = {
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.css', '.vue'],
		alias: {
			"@": path.resolve(__dirname, 'src/')
		}
  },
	plugins: [
		new VueLoaderPlugin(),
	],

	stats: 'errors-only',

};



// rules.push({
// 	test: /\.scss$/,
// 	oneOf: [
// 		{
// 			include: path.resolve(__dirname, '../../design-system'),
// 			resourceQuery: /module/,
// 			use: [
// 				'vue-style-loader', // TODO: check options for this loader
// 				{
// 					loader: 'css-loader',
// 					options: {
// 						modules: true,
// 					},
// 				},
// 				{
// 					loader: 'sass-loader',
// 					options: {
// 						prependData: `@import "${path.resolve(__dirname, 'src/n8n-theme.scss')}";`
// 					}
// 				}
// 			],
// 		},
// 		{
// 			include: path.resolve(__dirname, '../../design-system'),
// 			use: ['vue-style-loader', 'css-loader', {
// 				loader: 'sass-loader',
// 				options: {
// 					prependData: `@import "${path.resolve(__dirname, 'src/n8n-theme.scss')}";`
// 				}
// 			}],
// 		},
// 	],
// });
