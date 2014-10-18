var docs = require("./../docs/docs")("example");
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/*', function(req, res, next) {
	var path = req.params[0];
	if(path.charAt(path.length -1) == "/")
		path = path.substring(0, s.length - 1);

	var vm = {
		title: 'Document Viewer',
		path: path,
		isroot: path == '',
		join: require("path").join
	}
	var li = path.lastIndexOf('/');
	if(li > -1) {
		vm.lastpath = path.substring(0, li);
	} else vm.lastpath = "";

	if(docs.isFile(path)) {
		docs.toHtml(path, function(err, html) {
			if(err) next();
			else {
				vm.content = html;
				res.render('index', vm)
			}
		});
	} else {
		docs.getStructure(path, function(err, structure) {
			if(err) next();
			else {
				vm.structure = structure;
				res.render('index', vm);
			}
		});
	}
});

module.exports = router;
