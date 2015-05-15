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
