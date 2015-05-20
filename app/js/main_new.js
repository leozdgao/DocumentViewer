var tipForm = require('./tipform');
var $ = require('./common.js');

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
});
