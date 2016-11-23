var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var mongo = require('./mongo');

//get html file
exports.editorget= function(req, res){
  res.sendFile(path.resolve(__dirname + '/../html/editor.html'));
};


//GET
exports.allfolders_get = function(req, res){
  mongo.getFolderList(req, res);
};

exports.folder_get = function(req, res){
  mongo.findFolder(req, res);
};

exports.allnoteheaders_get = function (req, res){
  mongo.getNoteList(req, res);
};

exports.noteheaders_get = function (req, res){
  mongo.getNoteList_byFolderid(req, res);
};

exports.notedataheaders_get = function (req, res){
  mongo.getNoteData_byData(req, res);
};

exports.noteheaderlist_get = function (req, res){
  mongo.getNoteList_byNoteidlist(req, res);
};

exports.noteheader_get = function (req, res){
  mongo.getNoteList_byNoteid(req, res);
};

exports.notedata_get = function (req, res){
  mongo.getNoteData(req, res);
};


//POST
exports.folder_post = function (req, res){
  mongo.createFolder(req, res);
  res.send(200);
};

exports.note_post = function (req, res){
  var noteid = new mongoose.Types.ObjectId();
  var notename = req.body.title;
  var folder = req.body.folderid;
  var foldername = req.body.foldername;

  mongo.createNoteData(noteid, notename, folder);
  mongo.createNoteHeader(noteid, notename, folder, foldername);
  res.send(200);
};


//PUT
exports.folder_put = function (req, res){
  mongo.updateFolder(req, res);
  res.send(200);
};

exports.noteheader_put = function (req, res){
  mongo.updateNoteHeader(req, res);
  res.send(200);
};

exports.notedata_put = function (req, res){
  mongo.updateNoteHeader(req, res);
  mongo.updateNoteData(req, res);
  res.send(200);
};


//DELETE
exports.folder_delete = function (req, res){
  mongo.deleteFolder(req, res);
  res.send(200);
};

exports.note_delete = function (req, res){
  var noteid = req.body.noteid;
  mongo.deleteNoteData(noteid);
  mongo.deleteNoteHeader(noteid);
  res.send(200);
};


