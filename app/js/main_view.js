var $ = require('./common.js');

$.load(function () {
	var btn_remove = document.getElementById('btn_remove');
	btn_remove.addEventListener('click', function (e) {
		if(!confirm('Remove this tag?')) e.preventDefault();
	});
});
