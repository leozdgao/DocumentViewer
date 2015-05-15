var $ = require('./common.js');

$.load(function () {
	var btn_remove = document.getElementById('btn_remove');
	btn_remove.addEventListener('click', function (e) {
		if(!confirm('Remove this tag?')) e.preventDefault();
	});
	
	var btn_att = document.getElementById('btn_att');
	var file_uploader = document.getElementById('file_uploader');
	btn_att.addEventListener('click', function (e) {
		e.preventDefault();
		
		file_uploader.click();
	});
	file_uploader.addEventListener('change', function (e) {
		
		var form = new FormData();
		[].forEach.call(file_uploader.files, function (file, i) {
			form.append('file' + i, file);
		});
		/tip\/(.*)/.exec(location.pathname);
		if(RegExp.$1) {
			var url = '/tips/' + RegExp.$1 + '/attachment';
			$.ajax('POST', url, function () {
				location.reload();
			}, function () {
				
			}).send(form);	
		}
	});
	
	var x_buttons = document.querySelectorAll('.tip-att .att_remove');
	[].forEach.call(x_buttons, function (btn) {
		
		btn.addEventListener('click', function (e) {
			e.stopPropagation();
			
			if(!confirm("Remove this attachment?")) {
				e.preventDefault();
			}
		});
	});
});
