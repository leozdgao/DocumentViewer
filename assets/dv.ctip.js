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

	var ckeditor = __webpack_require__(1);
	var tipForm = __webpack_require__(2);
	var $ = __webpack_require__(3);

	$.load(function(e) {
	    // init ckeditor
	    var form = tipForm('POST', '/tips/new');
	    form.setValidate('title', /^\s*$/);
	    form.setValidate('editor', function (editor) {
	        // create a div for test data in editor is empty or whitespace
	        var div = document.createElement('div');
	        div.innerHTML = editor.getData();

	        return !/^\s*$/.test(div.textContent);
	    });
	    form.onSuccess = function() {
	        setTimeout(function() {
	            window.location.pathname = "/tips";
	        }, 1000);
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

	module.exports = CKEDITOR;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// dom elements
	var form = document.getElementById('tipform');
	var btnSubmit = form.querySelector('button');
	var attlist = document.querySelector('.attlist');
	var new_tip_errmsg = document.getElementById('new_tip_errmsg');
	var backdrop = document.querySelector('.backdrop');

	// require modules
	var dropBox = __webpack_require__(4);
	var editor = __webpack_require__(5)('content');
	var ValidateError = __webpack_require__(6);

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

	    var validate = {}, s_control = { 'editor': editor };

	    var tipForm = {
	        onSubmit: null,
	        beforeSubmit: function() { return true; },
	        onSuccess: null,
	        onError: null,
	        setValidate: function(field, validateFn) {
	            // is regex
	            if(validateFn.constructor.name === 'RegExp') {
	                var reg = validateFn;
	                validateFn = function (control) { return !reg.test(control.value); }
	            }

	            validate[field] = validateFn;
	        },
	        setErrorMessage: function(msg) {
	            new_tip_errmsg.textContent = msg;
	        }
	    };

	    btnSubmit.addEventListener('click', function(e) {

	        e.preventDefault();

	        // validate field
	        for(var key in validate) if(validate.hasOwnProperty(key)) {
	            var control = document.getElementsByName(key)[0] || document.getElementById(key) || s_control[key];
	            if(control && !validate[key].call(null, control)) {
	                throw new ValidateError(key, 'Validate error: [' + key + ']');
	            }
	        }

	        backdrop.style.display = 'block';

	        // prepare formdata
	        var formData = new FormData(form);
	        formData.append('content', editor.getData());
	        [].forEach.call(dropBox.files, function(file, i) {
	            formData.append("file" + i, file);
	        });

	        // submit
	        var xhr = new XMLHttpRequest();
	        xhr.open('POST', '/tips/new');
	        xhr.onload = function() {

	            tipForm.onSuccess.call();
	            
	        };
	        xhr.onerror = function() {

	            backdrop.style.display = 'none';

	            try {
	                var error = JSON.parse(xhr.response);
	                new_tip_errmsg.textContent = error.message;
	            }
	            catch(e) { new_tip_errmsg.textContent = "Unkown error."; }
	        };
	        xhr.timeout = 5000; // 5s timeout
	        xhr.send(formData);
	    });

	    return tipForm;
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    load: function(fn) {
	        document.addEventListener('DOMContentLoaded', fn);
	    },
	    ajax: function() {
	        
	    }
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// export
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var ckeditor = __webpack_require__(1);

	module.exports = function (id) {
		ckeditor.replace(id);
		return ckeditor.instances[id];
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var ValidateError = function (field, message) {
		this.field = field;
		this.message = message;
	}

	ValidateError.prototype = Error.prototype;

	module.exports = ValidateError;

/***/ }
/******/ ]);