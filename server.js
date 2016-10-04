// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var expressValidator = require('express-validator');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
app.use(express.static(__dirname + '/assets'));

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// conntroller ======================================================================
var comment = require('./app/controller/comment.js');

// routes ======================================================================
require('./app/routes/auth.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/routes/comment.js')(app, comment); // load our routes for comment

// launch ======================================================================
var server = app.listen(port);
console.log('The magic happens on port ' + port);

//socket.io
var socketIo = require('socket.io')
var io = socketIo(server)
console.log('===socket run====')
io.on('connection', socket => {
    console.log('===connection====')
    socket.on('message', body => {
        console.log('===in====')
        console.log(body)
        socket.broadcast.emit('message', {
         body
        })
    })
})
