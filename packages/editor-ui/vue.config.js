const GoogleFontsPlugin = require('@beyonk/google-fonts-webpack-plugin');

module.exports = {
	chainWebpack: config => config.resolve.symlinks(false),
	// transpileDependencies: [
	//   // 'node_modules/quill'
	//   /\/node_modules\/quill\//
	// ]
	pluginOptions: {
		webpackBundleAnalyzer: {
			openAnalyzer: false,
		},
		electronBuilder: {
			chainWebpackMainProcess: config => {
				config.module
					.rule("compile")
					.test(/background/)
					.exclude.add(/(node_modules|dist_electron)/)
					.end()
					.use("babel")
					.loader("babel-loader")
					.options({
						presets: ["@babel/preset-typescript"]
					});
			}
		}
	},
	configureWebpack: {
		plugins: [
			new GoogleFontsPlugin({
				fonts: [
					{ family: 'Open Sans', variants: ['300', '400', '600', '700'] },
				],
			}),
		],
		devServer: {
			disableHostCheck: true,
		},
	},
	css: {
		loaderOptions: {
			sass: {
				prependData: `
					@import "@/n8n-theme-variables.scss";
				`,
			},
		},
	},
	publicPath: process.env.VUE_APP_PUBLIC_PATH ? process.env.VUE_APP_PUBLIC_PATH : '/',
};
