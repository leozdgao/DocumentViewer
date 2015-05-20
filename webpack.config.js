var path = require('path');
var webpack = require('webpack');
var glob = require('glob');

function getEntry() {
	var entry = {};
	glob.sync(__dirname + '/app/js/main_*.js').forEach(function (name) {
		var n = name.match(/main_(.+?).js/)[1];
		entry[n] = './js/main_' + n + '.js'; 
	});
	return entry;
}

module.exports = {
	context: __dirname + '/app/',
	entry: getEntry(),
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