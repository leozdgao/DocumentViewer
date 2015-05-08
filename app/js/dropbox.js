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
