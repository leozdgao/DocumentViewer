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

// config handlebars
var exphbs = require("express-handlebars");
hbs = exphbs.create({
    defaultLayout: "main",
    helpers: {
        filename: function(context, options) {
            
            var index = context.lastIndexOf('\\');
            return context.slice(index + 1);
        }
    }
});

// view engine setup
app.engine('handlebars', hbs.engine);
// app.set('views', _join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.static(_join(__dirname, 'public')));

//add images path if exist
if(!/^\s*$/.test(imagesPath)) app.use(express.static(imagesPath));

//only router for this app, its param is the path of file
app.use('/docs/*', function(req, res) {
    var path = req.params[0].replace(/\/$/, '');
    var breadcrumbs = path.split("/") || [];
    var last = "/"
    breadcrumbs = breadcrumbs.map(function(item, index) {

        if(index == breadcrumbs.length - 1) {
            return {
                text: item    
            }
        }
        else {
            last = _join(last, item);
            return {
                text: item,
                link: last
            }    
        }
    });
    
    var vm = {
        title: 'Document Viewer',
        breadcrumbs: breadcrumbs,
        path: path,
        isNotRoot: !!path,
        type: "docs"
    }

    if(docs.isFile(path)) {
        docs.toHtml(path, function(err, html) {
            if(err) {
                res.render('error', { err: err });
            }
            else {
                vm.content = html;
                res.render('index', vm);
            }
        });
    } 
    else {
        docs.getStructure(path, null, function(err, structure, readme) {
            if(err) {
                res.render('error', { err: err });
            }
            else {
                vm.content = readme;
                vm.structure = structure;
                res.render('index', vm);
            }
        });
    }
});

app.use(function(req, res) {

    res.redirect("/docs/");
})

var server = app.listen(app_port, function(req, res){
  console.log('Listening on port %d', server.address().port);
});
