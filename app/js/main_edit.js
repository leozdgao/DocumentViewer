var $ = require('./common.js');
var editor = require('./editor.js')('content');

$.load(function () {
	var btnSubmit = document.querySelector('#tipform button');
	var title = document.getElementById('title');
	var message = document.getElementById('new_tip_errmsg');
    btnSubmit.addEventListener('click', function (e) {
		
		var fields = [];
		if(/^\s*$/.test(title.value)) fields.push('Title');
		if(/^\s*$/.test(editor.getData())) fields.push('Content');
		
		if(fields.length > 0) {
			e.preventDefault();
			message.textContent = 'Require field should be filled: ' + fields.join(', ');
		}
	});
});
