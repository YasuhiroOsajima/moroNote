var path = require('path');
var model = require('./model.js');
var User = model.User;

exports.login = function(req, res){
  var username = req.query.username;
  var password = req.query.password;
  var query = { "username": username, "password": password };
  console.log(query);
  User.find(query, function(err, data){
    if(err){
      console.log(err);
    }
    if(data==""){
      console.log(data);
      var loginfilepath = path.resolve(__dirname + '/../../html/login.html')
      res.status(401);
      res.sendFile(loginfilepath);
    }else{
      //user found in DB.
      //set user passing data.
      req.session.user = username;
      res.send(200);
    }
  });
};

exports.add = function (req, res){
  console.log("TEST");
  var reqbody = req.body;
  console.log(reqbody);
  if(reqbody.password.length < 8) {
    res.send(400);
  }

  var newUser = new User(reqbody);
  newUser.save(function(err){
    console.log("TEST2");
    console.log(err);
    if(err){
      console.log(err);
      res.redirect('/login');
    }else{
      res.send(200);
    }
  });
};

exports.userdel = function (req, res){
  console.log("DELETE");
  var username = req.body.username;
  console.log(username);

  User.remove({ "username": username }, function(err) {
    console.log("TEST3");
    console.log(err);
    if(err){
      console.log(err);
      res.redirect('/login');
    }else{
      res.send(200);
    }
  });
};

exports.list = function(req, res){
  var query = {};
  User.find(query, { "username" : 1 }, function(err, data){
    if(err){  console.log(err); }
    res.status(200)
    res.json(data);
  });
};

  // view contents index page.
exports.index = function(req, res){
  var indexfilepath = path.resolve(__dirname + '/../../html/menu.html')
  res.sendFile(indexfilepath);
};

exports.manage = function(req, res){
  var managefilepath = path.resolve(__dirname + '/../../html/manage.html')
  res.sendFile(managefilepath);
};

