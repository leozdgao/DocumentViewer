var path = require('path');

module.exports = {
	entry: {
		ctip: './app/js/main.js'
	},
	output: {
		path: path.resolve(__dirname, './assets'),
		filename: 'dv.[name].js'
	},
	externals: {
		ckeditor: "CKEDITOR"
	}
};