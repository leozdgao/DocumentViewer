var config = require('../config.json');
var _join = require('path').join;

module.exports = function(req, res) {
    var docs = require('../utils/static')(_join(__dirname, '..', config.slidespath));
    var excludeFolder = ["css", "js", "lib", "plugin"];

    var vm = {
        title: 'Document Viewer',
        breadcrumbs: req.breadcrumbs,
        path: req.targetPath,
        isNotRoot: req.isNotRoot,
        type: "slides"
    }

    docs.getStructure(vm.path, excludeFolder, function(err, structure, readme) {
        if(err) {
            res.render('error', { err: err });
        }
        else {
            vm.content = readme;
            vm.structure = structure;
            res.render('index', vm);
        }
    });
};