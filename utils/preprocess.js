var _join = require('path').join;

module.exports = function(req, res, next) {

    req.targetPath = decodeURI(req.path).replace(/\/$/, '');
    req.isNotRoot = !!req.targetPath;

    var breadcrumbs = req.targetPath.split("/").slice(1) || [];
    var last = "/"
    req.breadcrumbs = breadcrumbs.map(function(item, index) {

        var result = { text: item };
        if(index !== breadcrumbs.length - 1) {
            last = _join(last, item);
            result.link = last;
        }
        return result;
    });

    next();
}