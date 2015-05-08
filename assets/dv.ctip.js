/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1);
	var tipForm = __webpack_require__(2);

	$.load(function(e) {

	    var form = tipForm('POST', '/tips/new');
	    form.validate = {

	    };
	    form.beforeSubmit = function() {
	        
	    };
	    
	    // var backdrop = document.querySelector('.backdrop');
	    

	    // btnSubmit.addEventListener('click', function(e) {

	    //     e.preventDefault();

	    //     // form validate
	    //     var tbTitle = document.getElementById('title');
	    //     var tbContent = document.getElementById('content');
	    //     if(!checkRequire([tbTitle, tbContent])) {

	    //         new_tip_errmsg.textContent = "Required fields should be populated.";
	    //         return;
	    //     } 

	    //     new_tip_errmsg.textContent = "";

	    //     // show backdrop
	    //     backdrop.style.display = 'block';

	    //     var formData = new FormData(form);
	    //     [].forEach.call(files, function(file, i) {
	    //         formData.append("file" + i, file);
	    //     });

	    //     var xhr = new XMLHttpRequest();
	    //     xhr.open('POST', '/tips/new');
	    //     xhr.onload = function() {
	    //         setTimeout(function() {
	    //             window.location.pathname = "/tips";
	    //         }, 2000);
	    //     };
	    //     xhr.onerror = function() {

	    //         backdrop.style.display = 'none';

	    //         try {
	    //             var error = JSON.parse(xhr.response);
	    //             new_tip_errmsg.textContent = error.message;
	    //         }
	    //         catch(e) { new_tip_errmsg.textContent = "Unkown error."; }
	    //     };
	    //     xhr.timeout = 5000; // 5s timeout
	    //     xhr.send(formData);
	    // });

	    // form.addEventListener('keyup', function(e) {
	    //     var target = e.srcElement || e.target;
	    //     if(target.value) target.parentElement.classList.remove('has-error');
	    // });

	    // function checkRequire(controls) {
	    //     var valid = true;
	    //     [].forEach.call(controls, function(control) {
	    //         if(/^\s*$/.test(control.value)) {
	    //             control.parentElement.classList.add('has-error');
	    //             valid = false;
	    //         }
	    //     });
	    //     return valid;
	    // }
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    load: function(fn) {
	        document.addEventListener('DOMContentLoaded', fn);
	    },
	    ajax: function() {
	        
	    }
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var form = document.getElementById('tipform');
	var btnSubmit = form.querySelector('button');
	var attlist = document.querySelector('.attlist');
	var new_tip_errmsg = document.getElementById('new_tip_errmsg');

	var dropBox = __webpack_require__(3);
	dropBox.onAppendFile = function (fileList) {
	    [].forEach.call(fileList, function(file, i) {
	        var att = document.createElement('div');
	        att.className = 'att';
	        var content = document.createElement('span');
	        content.className = 'content'
	        content.textContent = file.name;
	        att.appendChild(content);
	        var close = document.createElement('span');
	        close.className = 'glyphicon glyphicon-remove';
	        close.onclick = function() {
	            att.remove();
	            dropBox.files.splice(dropBox.files.indexOf(file), 1);
	        };
	        att.appendChild(close);
	        attlist.appendChild(att);
	    });
	};

	module.exports = function(method, url) {

	    var validate = {};
	    var form = {
	        onSubmit: null,
	        beforeSubmit: function() { return true; },
	        onSuccess: null,
	        onError: null,
	        setValidate: function(field, regex) {

	            // is regex
	            if(regex.constructor.name === 'RegExp') {
	                validate[field] = regex;
	            }
	        },
	        setErrorMessage: function(msg) {
	            new_tip_errmsg.textContent = msg;
	        }
	    };

	    btnSubmit.addEventListener('click', function(e) {

	        e.preventDefault();
	        
	        console.log('obj');
	    });

	    return form;
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var dropBox = module.exports =  {
	    files: [],
	    onAppendFile: null
	}

	var uploader = document.getElementById('uploader');
	var box = document.querySelector('.dropbox .inner-box');
	var cross = document.querySelector('.file-select .cross');

	box.addEventListener('dragover', function(e) {
	    e.preventDefault();
	});

	// effect
	var counter = 0;
	box.addEventListener('dragenter', function(e) {
	    counter ++;
	    box.classList.add('active');
	});
	box.addEventListener('dragleave', function(e) {
	    counter --;
	    if(!counter) box.classList.remove('active');
	});

	// handle drop
	box.addEventListener('drop', function(e) {
	    e.preventDefault();
	    counter = 0;
	    box.classList.remove('active');

	    var dt = e.dataTransfer;
	    if(dt.files && dt.files.length > 0) {
	        [].push.apply(dropBox.files, dt.files);
	        dropBox.onAppendFile && dropBox.onAppendFile.call(null, dt.files);
	    }
	});

	// handle uploader click
	cross.addEventListener('click', function() {
	    // simulate click
	    uploader.click();
	});

	uploader.addEventListener('change', function(e) {
	    [].push.apply(dropBox.files, uploader.files);
	    dropBox.onAppendFile && dropBox.onAppendFile.call(null, uploader.files);
	});


/***/ }
/******/ ]);