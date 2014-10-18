var docs = require("./../docs/docs");
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/*', function(req, res, next) {
	var path = req.params[0];

	if(docs.isFile(path)) {
		docs.toHtml(path, function(err, html) {
			if(err) next();
			else {
				res.render('index', { title: 'Document Viewer', path: path, content: html })
			}
		});
	} else {
		docs.getStructure(path, function(err, structure) {
			if(err) next();
			else {
				res.render('index', { title: 'Document Viewer', path: path, structure: structure });
			}
		});
	}
});

module.exports = router;
