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
    extensions: ['.js', '.ts', '.css'],
		alias: {
			"@": path.resolve(__dirname, 'src/')
		}
  },
	plugins: [
		new VueLoaderPlugin(),
	],

	stats: 'errors-only',

};
