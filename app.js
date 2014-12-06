var args = process.argv.splice(2),
    docPath = "example",
    port = 3000;

//handle console arguments
if(args.length > 0) docPath = args[0];
if(args.length > 2) {
    args.splice(1);
    args.forEach(function(arg, i) {
        if(arg == "-p" && typeof args[i+1] != "undefined") {
            port = args[i+1];
        }
    });
}

//load module
var express = require('express'),
    _join = require('path').join,
    docs = require("./docs")(docPath);

var app = express(),
    app_port = process.env.VCAP_APP_PORT || port;

// view engine setup
app.set('views', _join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(_join(__dirname, 'public')));

//only router for this app, its param is the path of file
app.use('/*', function(req, res) {
    var path = req.params[0].replace(/\/$/, '');
    var vm = {
        title: 'Document Viewer',
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
