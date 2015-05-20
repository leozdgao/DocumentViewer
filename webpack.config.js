var path = require('path');
var webpack = require('webpack');

function getEntry() {
	
}

module.exports = {
	context: __dirname + '/app/',
	entry: {
		ctip: './js/main_new.js',
		etip: './js/main_edit.js',
		vtip: './js/main_view.js',
		itip: './js/main_index.js'
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