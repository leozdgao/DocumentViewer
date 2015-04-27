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
        var title = fields.title;
        var keywords = fields.keywords;
        var content = fields.content;

        if(!/^\s*$/.test(title) && !/^\s*$/.test(content)) {

            var new_tip = {
                title: title,
                content: content,
                tags: keywords.split(/\s*,\s*/)
            };

            Tip.post(new_tip)
                .then(function() {

                    res.status(200).end();
                })
                .catch(function(e) {
                    res.status(500).json(e);
                });
        }
        else {
            res.status(400).end();
        }
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
