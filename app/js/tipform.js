var form = document.getElementById('tipform');
var btnSubmit = form.querySelector('button');
var attlist = document.querySelector('.attlist');
var new_tip_errmsg = document.getElementById('new_tip_errmsg');

var dropBox = require('./dropbox');
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
