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
	var editor = __webpack_require__(4)('content');
	
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = CKEDITOR;

/***/ },
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var ckeditor = __webpack_require__(1);
	
	module.exports = function (id) {
		ckeditor.replace(id);
		return ckeditor.instances[id];
	}

/***/ }
/******/ ]);
//# sourceMappingURL=dv.etip.js.map