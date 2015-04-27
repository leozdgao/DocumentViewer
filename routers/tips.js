var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var config = require('../config.json');

var Tip = require('../service/tipcontroller');

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
router.get('/new', function(req, res) {
    res.render('tips/newtip', {
        type: 'tips'
    });
});

router.post('/new', function(req, res) {
    var form = new formidable.IncomingForm();
    config.attpath && (form.uploadDir = config.attpath);
    
    form.parse(req, function(err, fields, files) {
        // response
        console.log(fields); console.log(files);
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
        type: 'tips',
        tips: []
    };

    Tip.query({}).then(function(data) {
        vm.tips = data || [];
        if(vm.tips.length <= 0) vm.isEmpty = true;

        res.render('tips/tips', vm);
    }).catch(function(e) {
        res.render('error', {
            status: 500,
            message: 'Internal error.'
        });
    });
});

module.exports = router;
