var args = process.argv.splice(2),
    docPath;
if(args.length > 0) docPath = args[0];
else docPath = "example";

var express = require('express'),
    path = require('path'),
    docs = require("./docs")(docPath);

var app = express(),
    app_port = process.env.VCAP_APP_PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/*', function(req, res) {
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
            if(err) {
                res.render('error', { message: err });
            }
            else {
                vm.content = html;
                res.render('index', vm)
            }
        });
    } else {
        docs.getStructure(path, function(err, structure) {
            if(err) {
                res.render('error', { message: err });
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