// dom elements
var form = document.getElementById('tipform');
var btnSubmit = form.querySelector('button');
var attlist = document.querySelector('.attlist');
var new_tip_errmsg = document.getElementById('new_tip_errmsg');
var backdrop = document.querySelector('.backdrop');

// require modules
var dropBox = require('./dropbox');
var editor = require('./editor')('content');
var ValidateError = require('./validate_error');

dropBox.onAppendFile = function (fileList) {
    [].forEach.call(fileList, function(file, i) {
        var att = document.createElement('div');
        att.className = 'att';
        var content = document.createElement('span');
        content.className = 'content';
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
