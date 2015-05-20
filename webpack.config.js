var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: {
		ctip: './app/js/main_new.js',
		etip: './app/js/main_edit.js',
		vtip: './app/js/main_view.js'
	},
	output: {
		path: path.resolve(__dirname, './assets'),
		filename: 'dv.[name].min.js',
		sourceMapFilename: '[file].map'
	},
	externals: {
		ckeditor: "CKEDITOR"
	},
	devtool: "source-map",
	plugins: [
		new webpack.optimize.UglifyJsPlugin()
	]
};