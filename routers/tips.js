var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var config = require('../config.json');

var Tip = require('../data/tipcontroller');

// add additional attachments
router.post('/:id/attachment', function(req, res) {
    var form = new formidable.IncomingForm();
    config.attpath && (form.uploadDir = config.attpath);
    
    form.parse(req, function(err, fields, files) {
        // response
        res.end();
    });
});

// new tip
router.post('/new', function(req, res) {
    var form = new formidable.IncomingForm();
    config.attpath && (form.uploadDir = config.attpath);
    
    form.parse(req, function(err, fields, files) {
        // response
        res.end();
    });
});

router.use('/:id', function(req, res) {
    var id = req.param('id');
    Tip.get(id).then(function(tip) {

        }).catch(function(e) {
            res.render('error', {
                status: 404,
                message: "Can't find the tip.",
                type: "tips"
            });
        });
});

// get all tip
router.use('/', function(req, res) {
    var vm = {
        title: 'Document Viewer',
        type: 'tips',
        tips: []
    };

    Tip.query({}).then(function(data) {
        vm.tips = data || [];
        if(vm.tips.length <= 0) vm.isEmpty = true;

        res.render('tips', vm);
    }).catch(function(e) {
        res.render('error', {
            status: 500,
            message: 'Internal error.'
        });
    });
});

module.exports = router;
