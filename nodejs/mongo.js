var mongoose = require('mongoose');
var ConfigFile = require('config');

mongoose.connect("mongodb://"+ConfigFile.config.mongo_user+":"+ConfigFile.config.mongo_password+"@localhost/moronote");


//folder
var folderSchema = new mongoose.Schema({
  folderid: String,
  name: String,
  sortname: String,
  parentfolderid: String
});
var Folder = mongoose.model('folder', folderSchema);

exports.getFolderList = function(req, res) {
  Folder.find({}, function(err, items) {
    if(err) {console.log(err);}
    res.header({"Content-Type": "application/json",
                "charset": "utf-8"});
    res.json(items);
  });
};

exports.findFolder = function(req, res) {
  var folderid = req.query.name;
  var folder_id = new mongoose.Types.ObjectId(folderid);

  Folder.find({_id: folder_id}, function(err, items) {
    if(err) {console.log(err);}
    res.header({"Content-Type": "application/json",
                "charset": "utf-8"});
    res.json(items);
  });
};

exports.createFolder = function(req, res) {
  var foldername = req.body.name;
  var pfolderid = req.body.parentfolderid;
  var folder_id = new mongoose.Types.ObjectId();

  var pid = '';
  if (pfolderid) {
    pid = pfolderid;
  } else {
    pid = '';
  }

  var new_folder = new Folder({
    _id: folder_id,
    folderid: folder_id.toString(),
    name: foldername,
    sortname: foldername,
    parentfolderid: pid 
  });

  new_folder.save(function(err) {
    if (err) {console.log(err);}
  });
};

exports.updateFolder = function(req, res) {
  var fid = req.body.folderid;
  var foldername = req.body.name;
  var pfolderid = req.body.parentfolderid;
  var folder_id = new mongoose.Types.ObjectId(fid);
  var updatedata = {};

  if (foldername && !pfolderid) {
    updatedata["name"] = foldername;
    updatedata["sortname"] = foldername;
  } else if(pfolderid && !foldername) {
    updatedata["parentfolderid"] = pfolderid;
  } else {
    updatedata["name"] = foldername;
    updatedata["sortname"] = foldername;
    updatedata["parentfolderid"] = pfolderid;
  }

  Folder.update(
    {_id: folder_id},
    { $set: updatedata},
    { upsert: true, multi: false }, function(err) {
    if(err) {console.log(err);}
  });
};

exports.deleteFolder = function(req, res) {
  var fid = req.body.folderid;
  var folder_id = new mongoose.Types.ObjectId(fid);
  Folder.remove({_id: folder_id}, function(err) {
    if(err) {console.log(err);}
  });
};


//note_header
var noteHeaderSchema = new mongoose.Schema({
  noteid: String,
  title: String,
  updated_at: String,
  folderid: String
});
var NoteHeader = mongoose.model('noteheader', noteHeaderSchema);

exports.getNoteList = function(req, res) {
  var sortkey = ''
  if (typeof req.query.key === "undefined") {
    sortkey = ''
  } else {sortkey = req.query.key;}

  var sorttype = ''
  if (typeof req.query.type === "undefined") {
    sorttype = ''
  } else {sorttype = req.query.type;}

  var findOption = {};
  if (sortkey=='title') {
    if (sorttype=='newtop') {
      findOption = {sort: {title: -1}};
    } else {
      findOption = {sort:{title: 1}};
    }
  } else {
    if (sorttype=='newtop') {
      findOption = {sort: {updated_at: -1}};
    } else {
      findOption = {sort:{updated_at: 1}};
    }
  }

  NoteHeader.find({}, null, findOption, function(err, items) {
    if(err) {console.log(err);}
    res.header({"Content-Type": "application/json",
                "charset": "utf-8"});
    res.json(items);
  });
};

exports.getNoteList_byNoteid = function(req, res) {
  var nid = req.query.noteid;
  var note_id = new mongoose.Types.ObjectId(nid);
  NoteHeader.find({_id: note_id}, function(err, items) {
    if(err) {console.log(err);}
    res.header({"Content-Type": "application/json",
                "charset": "utf-8"});
    res.json(items);
  });
};

exports.getNoteList_byNoteidlist = function(req, res) {
  //var noteids = [ '572f00a8b344b2ab09294a07', '572f010ab344b2ab09294a08' ];
  noteids = req.query.noteids;
  NoteHeader.find({noteid: { $in: noteids }}, function (err, results) {
    console.log(results);
    res.header({"Content-Type": "application/json",
                "charset": "utf-8"});
    res.json(results);
  });
};

exports.getNoteList_byFolderid = function(req, res) {
  var fid = req.query.folderid;
  NoteHeader.find({folderid: fid}, function(err, items) {
    if(err) {console.log(err);}
    res.header({"Content-Type": "application/json",
                "charset": "utf-8"});
    res.json(items);
  });
};

exports.createNoteHeader = function(note_id, notename, folder) {
  var now = new Date();
  var yyyymmddhhmmss = now.getFullYear()+'/'+
                       ('0'+(now.getMonth()+1) ).slice(-2)+'/'+
                       ('0'+now.getDate()).slice(-2)+' '+
                       ('0'+now.getHours()).slice(-2)+':'+
                       ('0'+now.getMinutes()).slice(-2)+':'+
                       ('0'+now.getSeconds()).slice(-2);

  var new_noteheader = new NoteHeader({
    _id: note_id,
    noteid: note_id,
    title: notename,
    updated_at: yyyymmddhhmmss,
    folderid: folder
  });

  new_noteheader.save(function(err) {
    if (err) { console.log(err); }
  });
};

exports.updateNoteHeader = function(req, res) {
  var noteid = req.body.noteid;
  var note_id = new mongoose.Types.ObjectId(noteid);

  var notename = ''
  if (typeof req.body.title === "undefined") {
    notename = ''
  } else {notename = req.body.title;}

  var folder = ''
  if (typeof req.body.folderid === "undefined") {
    folder = ''
  } else {folder = req.body.folderid;}

  var updatedata = {};

  if (notename && !folder) {
    updatedata["title"] = notename;
  } else if(folder && !notename) {
    updatedata["folderid"] = folder;
  } else if(notename && folder) {
    updatedata["title"] = notename;
    updatedata["folderid"] = folder;
  }

  var now = new Date();
  var yyyymmddhhmmss = now.getFullYear()+'/'+
                       ('0'+(now.getMonth()+1) ).slice(-2)+'/'+
                       ('0'+now.getDate()).slice(-2)+' '+
                       ('0'+now.getHours()).slice(-2)+':'+
                       ('0'+now.getMinutes()).slice(-2)+':'+
                       ('0'+now.getSeconds()).slice(-2);
  updatedata["updated_at"] = yyyymmddhhmmss;

  NoteHeader.update(
    {_id: note_id},
    { $set: updatedata},
    { upsert: true, multi: false }, function(err) {
    if(err) {console.log(err);}
  });
};

exports.deleteNoteHeader = function(noteid) {
  var note_id = new mongoose.Types.ObjectId(noteid);
  NoteHeader.remove({_id: note_id}, function(err) {
    if(err) {console.log(err);}
  });
};


//note_data
var noteDataSchema = new mongoose.Schema({
  data: String
});
var NoteData = mongoose.model('notedata', noteDataSchema);


exports.getNoteData = function(req, res) {
  var noteid = req.query.noteid;
  var note_id = new mongoose.Types.ObjectId(noteid);
  NoteData.find({_id: note_id}, function(err, items) {
    if (err) { console.log(err); }
    res.header({"Content-Type": "application/json",
                "charset": "utf-8"});
    res.json(items);
  });
};

exports.getNoteData_byData = function(req, res) {
  var notedata = req.query.notedata;
  var noteids = [];

  NoteData.find({data: new RegExp(".*"+notedata+".*")}, function(err, items) {
    if (err) { console.log(err); }
    for (i=0; i<items.length; i++) {
      noteids.push(items[i].id);
    }
    res.json(noteids);
  });
};


exports.createNoteData = function(noteid, notename, folder) {
  var new_notedata = new NoteData({
    _id: noteid,
    data: ''
  });

  new_notedata.save(function(err) {
    if (err) { console.log(err); }
  });
};

exports.updateNoteData = function(req, res) {
  var noteid = req.body.noteid;
  var note_id = new mongoose.Types.ObjectId(noteid);
  var notedata = req.body.notedata;

  NoteData.update(
    {_id: note_id},
    { $set: {data: notedata}},
    { upsert: false, multi: false }, function(err) {
    if(err) {console.log(err);}
  });
};

exports.deleteNoteData = function(noteid) {
  var note_id = new mongoose.Types.ObjectId(noteid);
  NoteData.remove({_id: note_id}, function(err) {
    if(err) {console.log(err);}
  });
};

