//get config
var config = require('./config.json');
var _join = require('path').join;
var imagesPath = config.imagespath || '',
    port = config.port || 3000;

//load module
var express = require('express'),
    Then = require("thenjs");

var app = express(),
    app_port = process.env.VCAP_APP_PORT || port;

// config handlebars
var exphbs = require("express-handlebars");
hbs = exphbs.create({
    defaultLayout: "main",
    helpers: require('./utils/hbshelpers')
});

// view engine setup
app.engine('handlebars', hbs.engine);
// app.set('views', _join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// serve static
app.use(express.static(_join(__dirname, 'public')));

app.use('/slides', require('./utils/preprocess'), require('./routers/slides'));

//add images path if exist
if(!/^\s*$/.test(imagesPath)) app.use(express.static(imagesPath));

//only router for this app, its param is the path of file
app.use('/docs', require('./utils/preprocess'), require('./routers/docs'));

app.use(function(req, res) {

    res.redirect("/docs");
})

// listening
var server = app.listen(app_port, function(req, res){
  console.log('Listening on port %d', server.address().port);
});
