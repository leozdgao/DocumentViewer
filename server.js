//get config
var config = require('./config.json');
var _join = require('path').join;
var imagesPath = config.imagespath || '';

// load module
var express = require('express'),
    app = express();

// config handlebars
var exphbs = require("express-handlebars");
hbs = exphbs.create({
    layoutsDir: "app/layouts",
    partialsDir: "app/partials",
    extname: ".hbs",
    defaultLayout: "main",
    helpers: require('./utils/hbshelpers')
});

app.locals.isdev = ( config.env.toLowerCase() === 'dev' );

// view engine setup
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'app');

// promisify mongoose
var Promise = require("bluebird");
var mongoose = require("mongoose");
Promise.promisifyAll(mongoose);

// serve static
app.use(express.static(_join(__dirname, 'assets')));
// add images path if exist
if(!/^\s*$/.test(imagesPath)) app.use(express.static(imagesPath));

// routers
app.use('/slides', require('./utils/preprocess'), require('./routers/slides'));
app.use('/docs', require('./utils/preprocess'), require('./routers/docs'));
app.use('/tips', require('./routers/tips'));
// other request
app.use(function(req, res) { res.redirect("/docs"); });

var port = process.env.PORT || config.port || 3000;
var connected = false;

// set db connectiion config, timeout 5s
var dbConfig = {
    server: {
        socketOptions: { connectTimeoutMS: 5000 }
    }
};

mongoose.connect(config.dbConnection, dbConfig);

mongoose.connection.on("connected", function() {

    console.log("Connected to DB...");
    connected = true;
});

mongoose.connection.on("disconnected", function() {

    // after a successful connecting, 
    // mongoose will reconnect automatically if connection disconnected.
    if(!connected) {

        console.log("DBConnection closed. Try to reconnect.");

        setTimeout(function() {

            mongoose.connection.open(config.dbConnection, dbConfig);
        }, 5000);   
    }
});

mongoose.connection.on("error", function(err) {

    console.log("Error occurred: " + err.message);
});

app.listen(port, function() {

    console.log("Server listening on port " + port);
});
