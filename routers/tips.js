var express = require('express');
var path = require('path');
var router = express.Router();
var formidable = require('formidable');
var config = require('../config.json');
var att_static_path = config.attpath;
var tips_per_page = config.tips_per_page;

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
        else {
            var att = tip[0].attachments.filter(function(item) { return item._id == att_id; })[0];
            if(att) {
                res.download(att.path, att.fileName, function(e) {
                    // console.log(e);
                });
            }
            else res.status(400).end();
        }
    })
    .catch(function(e) {
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
                priority: fields.topmost ? 1 : 0,
                tags: keywords.split(/\s*,\s*/).filter(function(n) { return n; }),
                attachments: [].map.call(Object.keys(files), function(name) {

                    var file = files[name];
                    return {
                        fileName: file.name,
                        contentType: file.type,
                        path: file.path
                    };
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

router.use('/tip/:id', function(req, res, next) {
    var id = req.params.id;
    Tip.get(id)
        .then(function(tip) {
            if(tip) {
                tip.attachments = tip.attachments.map(function(att) {
                    att.basename = path.basename(att.path);
                    return att;
                });
                res.render('tips/tipview', {
                    tip: tip,
                    type: "tips"
                });
            }
            else next({
                status: 404,
                message: "Can't find the tip.",
                type: "tips"
            });
            
        })
        .catch(function(e) {
            next({
                status: 500,
                message: e.message,
                type: "tips"
            });
        });
});

router.use('/tip/:id/edit', function (req, res, next) {
    var id = req.params.id;
    Tip.get(id)
        .then(function (tip) {
            if(tip) {
                res.render('tips/newtip', {
                    type: 'tips',
                    tip: tip
                });    
            }
            else next({
                status: 404,
                message: "Can't find the tip.",
                type: "tips"
            });
        })
        .catch(function (e) {
            next({
                status: 500,
                message: e.message,
                type: "tips"
            });
        });
});

router.use('/search', function (req, res) {

});

// remove the tag
router.use('/rtag/:tagId', function (req, res, next) {
    var id = req.params.tagId;

    Tip.remove(id)
        .then(function (result) {

            res.redirect('/tips');
        })
        .catch(function (e) {

            next({
                status: 500,
                message: 'Internal error.',
                type: 'tips'
            });
        });
});

// get all tip
router.use('/:page?', function(req, res, next) {
    var page = req.params.page || 1;
    var vm = {
        type: 'tips',
        tips: [],
        current_page: +page,
        first_page: 1 == page
    };

    Tip.count()
        .then(function(c) {
            vm.count = Math.ceil(c / tips_per_page);
            if(c > 0) {
                if(page > vm.count) {
                    next({
                        status: 404,
                        message: "Not found",
                        type: 'tips'
                    });
                }
                else {
                    vm.last_page = (page == vm.count);

                    Tip.getTags()
                        .then(function(tags) {
                            vm.tags = tags[0][0].value.tags;
                            return Tip.page(page, tips_per_page);
                        })
                        .then(function(data) {
                            vm.tips = data || [];
                            if(vm.tips.length <= 0) vm.isEmpty = true;

                            res.render('tips/tips', vm);
                        })
                        .catch(function(e) {
                            next({
                                status: 500,
                                message: e.message,
                                type: 'tips'
                            });
                        });
                }
            }
            else {
                res.render('tips/tips', vm);
            }
        })
        .catch(function(e) {
            next({
                status: 500,
                message: 'Internal error.',
                type: 'tips'
            });
        });
});

module.exports = router;
