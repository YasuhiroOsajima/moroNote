var mongoose = require('mongoose');
var url = 'mongodb://xxxx:xxxx@localhost/morouser';

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

