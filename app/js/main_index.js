var $ = require("./common");

$.load(function () {
	var txtSearch = document.getElementById('txtSearch');
	var btnSearch = document.getElementById('btnSearch');
	
	btnSearch.addEventListener('click', function () {
		gotoSearch();
	});
	
	txtSearch.addEventListener('keydown', function (e) {
		if(e.keyCode == 13) gotoSearch();
	});
	
	function gotoSearch() {
		var key = txtSearch.value;
		if(!/^\s*$/.test(key)) {
			location.href = '/tips/search/?q=' + key;	
		}
	}
});