//get config
var config = require('./config.json');
var _join = require('path').join;
var docPath = config.docpath || _join(__dirname, 'example'),
    imagesPath = config.imagespath || '',
    port = config.port || 3000;

//load module
var express = require('express'),
    Then = require("thenjs");
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

app.use('/slides/*', function(req, res) {

    var docs = require('./docs')(_join(__dirname,config.slidespath));
    var excludeFolder = ["css", "js", "lib", "plugin"];
    var slidepath = req.params[0].replace(/\/$/, '');

    var breadcrumbs = slidepath.split("/") || [];
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
        path: slidepath,
        isNotRoot: !!slidepath,
        type: "slides"
    }

    docs.getStructure(slidepath, excludeFolder, function(err, structure, readme) {
        if(err) {
            res.render('error', { err: err });
        }
        else {
            vm.content = readme;
            vm.structure = structure;
            res.render('slides', vm);
        }
    });
    // require("fs").readdir(slidepath, function(err, files) {

    //     
    //     files = files.filter(function(item) {
    //         return !excludeFolder.some(function(exclude) {
    //             return exclude == item;
    //         });
    //     });

    //     console.log(files);
    //     res.end();
    // });
});

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
