module.exports = [
  // Add support for native node modules
  {
    test: /\.ts$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true
      }
    }
  },
	{
		test: /\.vue$/,
		exclude: /(node_modules|\.webpack)/,
		use: {
			loader: 'vue-loader',
			options: {
				transpileOnly: true
			}
		}
	},
];
