var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    routes = require('./routes/index'),
    session = require('express-session'),
    fs = require('fs');

var app = express();
var port = 3000;

var root = '/home/songwooseok/Documents';
var dir = '/root';
var group = '/group';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.bodyParser());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser());
app.use(session({secret : 'ssshhhhh'}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use(dir+'/', routes);

app.listen(port, function(){
    console.log('Server is running on ' + port);
    var watcher = require('./module/fileWatcher');
    watcher(root, dir);
    watcher(root, group);
});

module.exports = app;
