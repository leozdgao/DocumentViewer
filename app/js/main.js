var $ = require('./common.js');
var tipForm = require('./tipform');

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
