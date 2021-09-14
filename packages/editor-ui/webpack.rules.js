module.exports = [
  {
    test: /\.ts$/,
    exclude: /(node_modules|\.webpack)/,
		use: { loader: 'ts-loader' }
  },
	{
		test: /\.vue$/,
		exclude: /(node_modules|\.webpack)/,
		use: {
			loader: 'vue-loader',
		}
	},

	{
		test: /\.vue$/,
		include: /node_modules\/n8n-design-system/,
		use: {
			loader: 'ts-loader',
		}
	},
	{
		test: /\.vue$/,
		include: /node_modules\/n8n-design-system/,
		use: {
			loader: 'vue-loader',
		}
	},
];

// https://github.com/laravel-mix/laravel-mix/issues/2613#issuecomment-749355738
// https://stackoverflow.com/a/67129623

// exclude: /(\.webpack)/,
		// use: [ { loader: 'vue-loader, options: { transpileOnly: true }' } ]
