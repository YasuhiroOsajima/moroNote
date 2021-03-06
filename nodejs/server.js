  // require packages
var express = require('express');
var logger = require('morgan');
var path = require('path');
var fs = require('fs');
var https = require('https');
var ConfigFile = require('config');

  // for REST API
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('express-error-handler');
var mongoose = require('mongoose');

  // for login page
var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);
var routes = require('./auth/routes');

  // for page viewing
var webapi = require('./webapi');


  //create app server
var app = express();
app.use(logger());
app.use(express.static(path.resolve(__dirname + '/../')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(errorHandler());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

//app.use(cookieParser());
app.use(session({
  secret: ConfigFile.config.session_secret,
  store: new MongoStore({
           url: "mongodb://"+ConfigFile.config.mongo_user+":"+ConfigFile.config.mongo_password+"@localhost/morouser",
           clear_interval: 60 * 60
  }),
}));

  //auth method. check session cookie.
var loginCheck = function(req, res, next) {
  console.log(req.url);

  if(req.session.user){
    if(req.url == '/'){
      res.redirect('/login');
    }else{
      next();
    }
  }else{
    //first access.
    res.redirect('/login');
  }
};

app.get('/', loginCheck);
app.get('/login', routes.login);

app.get('/notelist', loginCheck, routes.index);
app.get('/manage', loginCheck, routes.manage);
app.post('/useradd', loginCheck, routes.add);
app.delete('/userdelete', loginCheck, routes.userdel);
app.get('/userlist', loginCheck, routes.list);
app.get('/logout', loginCheck, function(req, res){
  req.session.destroy();
  console.log('deleted sesstion');
  res.redirect('/');
});

  //get html file
app.get("/editor", loginCheck, webapi.editorget)

  //mongodb api
app.get('/allfolders', loginCheck, webapi.allfolders_get)
app.get('/folder', loginCheck, webapi.folder_get)
app.get('/allnoteheaders', loginCheck, webapi.allnoteheaders_get)
app.get('/noteheaders', loginCheck, webapi.noteheaders_get)
app.get('/notedataheaders', loginCheck, webapi.notedataheaders_get)
app.get('/noteheaderlist', loginCheck, webapi.noteheaderlist_get)
app.get('/noteheader', loginCheck, webapi.noteheader_get)
app.get('/notedata', loginCheck, webapi.notedata_get)
app.post('/folder', loginCheck, webapi.folder_post)
app.post('/note', loginCheck, webapi.note_post)
app.put('/folder', loginCheck, webapi.folder_put)
app.put('/noteheader', loginCheck, webapi.noteheader_put)
app.put('/notedata', loginCheck, webapi.notedata_put)
app.delete('/folder', loginCheck, webapi.folder_delete)
app.delete('/note', loginCheck, webapi.note_delete)


var privateKey  = fs.readFileSync(ConfigFile.config.privatekey_path);
var certificate = fs.readFileSync(ConfigFile.config.cerfile_path);
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(ConfigFile.config.listen_port);


