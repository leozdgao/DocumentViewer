//get config
var config = require('./config.json');
var _join = require('path').join;
var docPath = config.docpath || _join(__dirname, 'example'),
    imagesPath = config.imagespath || '',
    port = config.port || 3000;

//load module
var express = require('express'),
    docs = require('./docs')(docPath);

var app = express(),
    app_port = process.env.VCAP_APP_PORT || port;

// view engine setup
app.set('views', _join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(_join(__dirname, 'public')));

//add images path if exist
if(!/^\s*$/.test(imagesPath)) app.use(express.static(imagesPath));

//only router for this app, its param is the path of file
app.use('/*', function(req, res) {
    var path = req.params[0].replace(/\/$/, '');
    var breadcrumbs = path.split("/") || [];
    var last = "/"
    breadcrumbs = breadcrumbs.map(function(item) {

        return {
            text: item,
            link: (last = _join(last, item))
        }
    });
    
    var vm = {
        title: 'Document Viewer',
        breadcrumbs: breadcrumbs,
        path: path,
		lastpath: '',
        isroot: !path,
        join: _join
    }

	if(!vm.isroot) vm.lastpath = _join(path, '..');

    if(docs.isFile(path)) {
        docs.toHtml(path, function(err, html) {
            if(err) {
                res.render('error', { err: err });
            }
            else {
                vm.content = html;
                res.render('index', vm)
            }
        });
    } 
    else {
        docs.getStructure(path, function(err, structure) {
            if(err) {
                res.render('error', { err: err });
            }
            else {
                vm.structure = structure;
                res.render('index', vm);
            }
        });
    }
});

var server = app.listen(app_port, function(req, res){
  console.log('Listening on port %d', server.address().port);
});
