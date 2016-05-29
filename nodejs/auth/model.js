var mongoose = require('mongoose');
var ConfigFile = require('config');

var url = "mongodb://"+ConfigFile.config.mongo_user+":"+ConfigFile.config.mongo_password+"@localhost/morouser";


var db = mongoose.createConnection(url, function(err, res){
  if(err){
    console.log('Error connected: ' + url + ' - ' + err);
  }else{
    console.log('Success connected: ' + url);
  }
});

var UserSchema = new mongoose.Schema({
    username    : String,
    password  : String
},{collection: 'userinfo'});

exports.User = db.model('User', UserSchema);

