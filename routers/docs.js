var config = require('../config.json');
var _join = require('path').join;

module.exports = function(req, res) {
    var docs = require('../utils/static')(config.docpath || _join(__dirname, '..', 'example'));

    var vm = {
        title: 'Document Viewer',
        breadcrumbs: req.breadcrumbs,
        path: req.targetPath,
        isNotRoot: req.isNotRoot,
        type: "docs"
    };

    if(docs.isFile(vm.path)) {
        docs.toHtml(vm.path, function(err, html) {
            if(err) {
                res.render('error', { err: err });
            }
            else {
                vm.content = html;
                res.render('index', vm);
            }
        });
    } 
    else {
        docs.getStructure(vm.path, null, function(err, structure, readme) {
            if(err) {
                res.render('error', { err: err });
            }
            else {
                vm.content = readme;
                vm.structure = structure;
                res.render('index', vm);
            }
        });
    }
}