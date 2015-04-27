document.addEventListener('DOMContentLoaded', function(e) {

    var form = document.getElementById('tipform');
    var btnSubmit = form.querySelector('button');
    var uploader = document.getElementById('uploader');
    var box = document.querySelector('.dropbox .inner-box');
    var cross = document.querySelector('.file-select .cross');
    var attlist = document.querySelector('.attlist');
    var backdrop = document.querySelector('.backdrop');
    var new_tip_errmsg = document.getElementById('new_tip_errmsg');

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
    var files = [];
    box.addEventListener('drop', function(e) {
        e.preventDefault();
        counter = 0;
        box.classList.remove('active');

        var dt = e.dataTransfer;
        if(dt.files && dt.files.length > 0) {
            [].push.apply(files, dt.files);
            appendAttachment(dt.files);
        }
    });

    // handle uploader click
    cross.addEventListener('click', function() {
        // simulate click
        uploader.click();
    });

    uploader.addEventListener('change', function(e) {
        [].push.apply(files, uploader.files);
        appendAttachment(uploader.files);
    });

    btnSubmit.addEventListener('click', function(e) {

        e.preventDefault();

        // form validate
        var tbTitle = document.getElementById('title');
        var tbContent = document.getElementById('content');
        if(!checkRequire([tbTitle, tbContent])) {

            new_tip_errmsg.textContent = "Required fields should be populated.";
            return;
        } 

        new_tip_errmsg.textContent = "";

        // show backdrop
        backdrop.style.display = 'block';

        var formData = new FormData(form);
        [].forEach.call(files, function(file, i) {
            formData.append("file" + i, file);
        });

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/tips/new');
        xhr.onload = function() {
            setTimeout(function() {
                window.location.pathname = "/tips";
            }, 2000);
        };
        xhr.onerror = function() {
            try {
                var error = JSON.parse(xhr.response);
                new_tip_errmsg.textContent = error.message;
            }
            catch(e) { new_tip_errmsg.textContent = "Unkown error."; }
        };
        xhr.timeout = 5000; // 5s timeout
        xhr.send(formData);
    });

    form.addEventListener('keyup', function(e) {
        var target = e.srcElement || e.target;
        if(target.value) target.parentElement.classList.remove('has-error');
    });

    function checkRequire(controls) {
        var valid = true;
        [].forEach.call(controls, function(control) {
            if(/^\s*$/.test(control.value)) {
                control.parentElement.classList.add('has-error');
                valid = false;
            }
        });
        return valid;
    }

    function appendAttachment(fileList) {
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
                files.splice(files.indexOf(file), 1);
            };
            att.appendChild(close);
            attlist.appendChild(att);
        });
    }
});
