var com = com || {};
com.apress = com.apress || {};
com.apress.view = com.apress.view || {};


com.apress.view.NoteView = Backbone.View.extend({
  tagName: "li",
  className: "note",
  template: _.template( $("#note-view").html() ),
  
  folderid: this.model.toJSON().folderid,
  noteid: this.model.toJSON().noteid,
  notename: this.model.toJSON().title,

  events: {
    "click": "setSelectedColor",
    "dblclick": "openEditor",
  },

  setSelectedColor: function(event) {
    clearNoteColor();
    this.$el.css("background", "#c0ffff");
    this.printPreview();
  };

  clearNoteColor: function() {
    $('#notelist li').each(function(index, obj) {
      this.$el.css("background", "");
    });
  };

  openEditor: function(event) {
    var childWindow = window.open('about:blank');
    var linkurl = headerurl+'/editor#'+this.noteid;
    $.ajax({
      type: 'GET',
      url: linkurl
    }).done(function(jqXHR) {
      var url = linkurl;
      childWindow.location.href = url;
      childWindow = null;
    }).fail(function(jqXHR) {
      childWindow.close();
      childWindow = null;
    });
  };

  deleteNote: function() {
    if (deleteNoteFromDB(this.el.id) === false){ return false; }
    printFolderNotes(this.folderid);
  },

  changeNoteName: function() {
    swal({
      title: "ノート名変更",
      text: "ノート名を入力してください",
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: "Note name"
    },
    function(notename){
      if (notename === false || notename === "") {
        swal.showInputError("無効なノート名です");
        return false;
      }
      if (changeNoteTitle(this.noteid, notename) === false){ return false; }
      this.notename = notename;
      printFolderNotes(this.folderid);
    });
  },

  printPreview: function() {
    $.ajax({
      type: "GET",
      url: headerurl+"/notedata",
      data: {"noteid": this.noteid},
      async: false,
      cache: false,
    }).done(function(json) {
         var html = marked(json["0"]["data"]);
         $('#preview').html(html);
    }).fail(function() {
         return false;
    });
  };

  render: function() {
    this.el.id = this.model.toJSON().noteid;
    var template = this.template( this.model.toJSON() );
    this.$el.html(template);

    this.$el.chromeContext({
      items: [
        { title: 'ノートを削除',
          onclick: function(event) { this.deleteNote(); } },
        { title: 'ノート名変更',
          onclick: function(event) { this.changeNoteName(); } },
      ]
    });

    this.$el.css("cursor", "pointer");

    this.$el.draggable({
      revert: true,
      opacity: 0.7,
      containment: 'window',
      helper: 'clone'
    });

    return this;
  }
});


function deleteNoteFromDB(noteid) {
  $.ajax({
    type: "DELETE",
    url: headerurl+"/note",
    data: {"noteid": noteid},
    async: false,
    cache: false,
  }).done(function(json) {
       swal("ノートが削除されました");
       return true;
  }).fail(function() {
       return false;
  });
};


function changeNoteTitle(noteid, notename) {
  $.ajax({
    type: "PUT",
    url: headerurl+"/noteheader",
    data: {"noteid": noteid, "title": notename},
    async: false,
    cache: false,
  }).done(function(json) {
       swal("ノート名が変更されました: " + notename);
  }).fail(function() {
       return false;
  });
};


com.apress.view.NotesView = Backbone.View.extend({
  tagName: 'ul',
  id: 'notelist',
  render: function() {
    this.collection.each(function(note) {
      var noteView = new com.apress.view.NoteView({ model: note });
      this.$el.append(noteView.render().el);
    }, this);
    return this;
  }
});


function printFolderNotes(folderid, NoteList) {
  $('.closed').each(function(index, obj) {
    $(obj).css("background", selectedFolderColor_16);
  });

  var allNoteList = NoteList || getNotesFromDB();
  var noteList = new com.apress.collection.NoteList();

  for (i=0; i<allNoteList.length; i++) {
    if (allNoteList[i]["folderid"]==folderid || folderid==0) {
      noteList.add(allNoteList[i]);
    }
  }

  var notesView = new com.apress.view.NotesView({collection: noteList});
  $('#main_notes').html(notesView.render().el);
  $('#'+folderid).css("background", selectedFolderColor_16);
};


function sortedNoteView(NoteList) {
  printFolderNotes(0, NoteList);
};


function printAllNotes() {
  printFolderNotes(0);
};

