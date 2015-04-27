var express = require('express');
var path = require('path');
var router = express.Router();
var formidable = require('formidable');
var config = require('../config.json');
var att_static_path = config.attpath;

var Tip = require('../service/tipcontroller');

router.use('/att/:id', function(req, res, next) {

    var tip_id = req.param('tid');
    var att_id = req.param('id');

    Tip.query({
        _id: tip_id,
        attachments: {
            "$elemMatch": {
                _id: att_id
            }
        }
    })
    .then(function(tip) {
        if(tip == null) res.status(400).end();
        else { console.log(tip);
            var att = tip[0].attachments.filter(function(item) { return item._id == att_id; })[0];
            if(att) {
                res.download(att.path, att.fileName, function(e) {
                    console.log(e);
                });
            }
            else res.status(400).end();
        }
    })
    .catch(function(e) {console.log(e);
        res.status(500).end();
    });
});

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
    form.uploadDir = att_static_path;
    
    form.parse(req, function(err, fields, files) {
        // response
        var title = fields.title;
        var keywords = fields.keywords;
        var content = fields.content;

        if(!/^\s*$/.test(title) && !/^\s*$/.test(content)) {

            var new_tip = {
                title: title,
                content: content,
                tags: keywords.split(/\s*,\s*/).filter(function(n) { return n; }),
                attachments: [].map.call(Object.keys(files), function(name) {

                    var file = files[name];
                    return {
                        fileName: file.name,
                        contentType: file.type,
                        path: file.path
                    }
                })
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
    Tip.get(id)
        .then(function(tip) {
            tip.attachments = tip.attachments.map(function(att) {
                att.basename = path.basename(att.path);
                return att;
            });
            res.render('tips/tipview', {
                tip: tip
            })
        })
        .catch(function(e) {
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

    Tip.query({})
        .then(function(data) {
            vm.tips = data || [];
            if(vm.tips.length <= 0) vm.isEmpty = true;

            res.render('tips/tiplist', vm);
        })
        .catch(function(e) {
            res.render('error', {
                status: 500,
                message: 'Internal error.'
            });
        });
});

module.exports = router;
