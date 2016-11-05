/*
* index.js
*
* INSERT_NAME_HERE Backend Server Main File
*/

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socketHandler = require('./socket');
var bodyParser = require('body-parser');
var db = require('./db');
var fs = require("fs");
var auth = require('./auth');
var config = require('./config');

db.initializeDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('trust proxy', 1);
var cookieSession = require('cookie-session');
var path = require('path').dirname(require.main.filename);
var publicPath = path + "/public/";
app.use(cookieSession({
  name: 'session',
  keys: config.keys
}));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://159.203.126.117:6969');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

socketHandler.socketIOinit(io);

app.get('/', function (req, res) {
  if(req.session.user != null)
  {
    //logged in, send users only page
  }
  else
  {
    //show landing page with login/register
  }
});

app.get('/css/:file', function (req, res) { sendFolder("css",req,res); });
app.get('/images/:file', function (req, res) { sendFolder("images",req,res); });
app.get('/js/:file', function (req, res) { sendFolder("js",req,res); });
app.get('/files/:file', function (req, res) { sendFolder("files",req,res); });

function sendFolder(folder,req,res)
{
  var fileId = req.params.file;
  var file = publicPath + folder + "/" + fileId;
  if(fs.existsSync(file))
  {
    res.sendFile(file);
  }
  else {
    res.send("404 not found.");
  }
}

app.post('/register', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    auth.registerUser(username,password,function(){
      res.send("success");
    },function(error){
      var response = {
        error: error
      }
      res.send(JSON.stringify(response));
    });
});

app.post('/auth', function(req, res) {
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;
  auth.loginUser(username,password,req,function(msg){
    res.end(msg);
  });
});

app.get('/signout', function(req, res) {
  req.session.user = null;
  res.redirect('/');
});

var expserv = http.listen(6969, function () {
  console.log('Hackathon Server!');
});
