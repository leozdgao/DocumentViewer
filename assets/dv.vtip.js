/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(3);
	
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


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    load: function(fn) {
	        document.addEventListener('DOMContentLoaded', fn);
	    },
	    ajax: function(method, url, onload, onerror) {
	        var xhr = new XMLHttpRequest();
	        xhr.open(method, url);
	        xhr.onload = onload;
	        xhr.onerror = onerror;
	        xhr.timeout = 5000; // 5s timeout
	        
	        return {
	            send: function (data) { xhr.send(data); }
	        };
	    }
	};


/***/ }
/******/ ]);
//# sourceMappingURL=dv.vtip.js.map