var path = require('path');

module.exports = {
	entry: {
		ctip: './app/js/main_edit.js',
		vtip: './app/js/main_view'
	},
	output: {
		path: path.resolve(__dirname, './assets'),
		filename: 'dv.[name].js'
	},
	externals: {
		ckeditor: "CKEDITOR"
	}
};