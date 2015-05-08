var ckeditor = require('ckeditor');

module.exports = function (id) {
	ckeditor.replace(id);
	return ckeditor.instances[id];
}