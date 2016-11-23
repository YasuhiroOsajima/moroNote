var com = com || {};
com.apress = com.apress || {};
com.apress.view = com.apress.view || {};


com.apress.view.FolderView = Backbone.View.extend({
  tagName: 'li',
  className: 'closed',
  template: _.template( $("#folder-view").html() ),

  folderid: this.model.toJSON().folderid;

  createChildFolder: function() {
    swal({
      title: "フォルダ作成",
      text: "フォルダ名を入力してください",
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: "Folder name"
    },
    function(foldername){
      if (foldername === false || foldername === "") {
        swal.showInputError("無効なフォルダ名です");
        return false;
      }
  
      var allFolderList = getFoldersFromDB();
      if (allFolderList === false){ return false; }
      for (i=0; i<allFolderList.length; i++) {
        if (allFolderList[i]["name"] == foldername) {
          swal("同じ名前のフォルダがすでに存在します: " + foldername);
          return false;
        }
      }

      var pfolderid = if (this.folderid=='0' || this.folderid=='1') ? '' : this.folderid;
      $.ajax({
        type: "POST",
        url: headerurl+"/folder",
        data: {"name": foldername, "parentfolderid": pfolderid},
        async: false,
        cache: false,
      }).done(function(json) {
         swal("フォルダが作成されました: " + foldername);
         printFolders();
      }).fail(function() {
         return false;
      });
    });
  }
  
  deleteFolder: function() {
    if (this.folderid==0 || this.folderid==1) {
      swal("このフォルダは削除できません");
      return false;
    }

    var hasul = $("#"+this.folderid).find('ul');
    if (!hasul.is('ul')) {
      swal("フォルダ内に他のフォルダが存在します");
      return false;
    }

    var notesList = getFolderNotes(this.folderid);
    if (notesList.length != 0) {
      swal("フォルダ内のノートを削除してください");
      return false;
    }

    deleteFolderFromDB(this.folderid);
  }
  
  changeFolderName: function() {
    swal({
      title: "フォルダ名変更",
      text: "フォルダ名を入力してください",
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: "Folder name"
    },
    function(foldername){
      if (foldername === false || foldername === "") {
        swal.showInputError("無効なフォルダ名です");
        return false
      }

      $.ajax({
        type: "PUT",
        url: headerurl+"/folder",
        data: {"folderid": folderid, "name": foldername},
        async: false,
        cache: false,
      }).done(function(json) {
           changeNoteFoldername(foldername)
           swal("フォルダ名が変更されました: " + foldername);
           printFolders();
      }).fail(function() {
           return false;
      });
    });
  }

  changeNoteFoldername: function(foldername) {
    var notesList = getFolderNotes(this.folderid);
    if (notesList.length == 0) {
      return true;
    }

    for (i=0; i<notesList.length; i++) {
      var noteid= allNoteList[i]["noteid"];

      $.ajax({
        type: "PUT",
        url: headerurl+"/noteheader",
        data: {"noteid": noteid, "foldername": foldername},
        async: false,
        cache: false,
      });
    }
  }

  render: function() {
    this.el.id = this.model.toJSON().folderid;
    var template = this.template( this.model.toJSON() );
    this.$el.html(template);

    this.$el.chromeContext({
      items: [
        { title: '子フォルダ作成',
          onclick: function(event) { this.createChildFolder(); } },
        { title: 'フォルダを削除',
          onclick: function(event) { this.deleteFolder(); } },
        { title: 'フォルダ名変更',
          onclick: function(event) { this.changeFolderName(); } },
      ]
    });

    this.$el.css({
      "cursor": "pointer",
      "width": "90%",
      "margin": "1px 0px",
      "background": "#d0fafa",
      "border-radius": "3px",
      "border-top": "#fff 1px solid",
      "border-left": "#fff 1px solid",
      "border-bottom": "#999 1px solid",
      "border-right": "#999 1px solid"
    });

    return this;
  }
});


function getFoldersFromDB() {
  var allFolderList = [];
  $.ajax({
    url: headerurl+"/allfolders",
    type: "GET",
    async: false,
    cache: false,
  }).done(function(json) {
       for (i=0; i<json.length; i++) {
         allFolderList.push(json[i]);
       }
       return allFolderList;
  }).fail(function() {
       swal("DBへの接続に失敗しました");
       return false;
  });
};


function getFolderNotes(folderid) {
  var FolderList = [];
  $.ajax({
    type: "GET",
    url: headerurl+"/noteheaders",
    data: {"folderid": folderid},
    async: false,
    cache: false,
  }).done(function(json) {
       for (i=0; i<json.length; i++) {
         FolderList.push(json[i]);
       }
       return FolderList;
  }).fail(function(json) {
       swal("DBへの接続に失敗しました");
       return false;
  });
};


function deleteFolderFromDB(folderid) {
  $.ajax({
    type: "DELETE",
    url: headerurl+"/folder",
    data: {"folderid": this.folderid},
    async: false,
    cache: false,
  }).done(function(json) {
       swal("フォルダが削除されました ");
       return true;
  }).fail(function(json) {
       swal("DBへの接続に失敗しました");
       return false;
  });
};


com.apress.view.FolderTreeView = Backbone.View.extend({
  tagName: "ul",
  id: "foldertree",
  className: "treeview-famfamfam",
  topfolders: [],
  untopfolders: [],

  printFolderTree: function() {
    $("#side_tree ul").treeview({
      collapsed: true,
      unique: false,
      animated: "fast"
    });
  };

  render: function() {
    this.collection.each(function(folder) {
      if (folder.toJSON().parentfolderid == '') {
        this.topfolders.push(folder);
      } else {
        this.untopfolders.push(folder);
      }
    }, this);

    this.collection.each(function(folder) {
      var folderView = new com.apress.view.FolderView({ model: folder });

      if (this.topfolders.indexOf(folder) >= 0)  {
        this.$el.append(folderView.render().el);
      }
    }, this);

    do {
      this.collection.each(function(folder) {
        if (this.untopfolders.indexOf(folder) < 0) {
          continue;
        }

        var parentfolder = this.$el.find('#'+parentfolderid);
        if (!parentfolder.is('#'+parentfolderid)) {
          continue;
        }

        var hasul = parentfolder.find("ul");
        if (!hasul.is("ul")) {
          parentfolder.append('<ul id="follow"></ul>');
        }

        var folderView = new com.apress.view.FolderView({ model: folder });
        hasul.append(folderView.render().el);

        for(i=0; i<this.untopfolders.length; i++){
          if(this.untopfolders[i] == folder){
              this.untopfolders.splice(i, 1);
          }
        }
      }, this);
    } while (this.untopfolders.length > 0);


    $("#follow > li").css({"width": "90%"});

    $(".closed").each(function(index, obj) {
      var hasul = $(obj).find("ul");
      if (hasul.is("ul")) { continue; }

      // most under folder
      $(obj).click(function() {
        $("#searcher").val("");
        var clickedfolderid = $(obj)['0']["id"];
        printFolderNotes(clickedfolderid);
      });

      $(obj).droppable({
        drop: function(event, ui) {
          var noteid = ui.helper.context['id'];
          var droptagid = $(obj)['0']["id"];
          var dropname = $(obj)['0']["innerText"];
          changeNoteFolder(noteid, droptagid, dropname);
          printFolderNotes(newfolderid);
        }
      });
    });

    this.printFolderTree();
    return this;
  }
});


function printFolders() {
  var folderList = new com.apress.collection.FolderList([
    { folderid: 0, name: 'ALL', sortname: '-1', parentfolderid: ''},
  ]);

  var allFolderList = getFoldersFromDB;
  for (i=0; i<allFolderList.length; i++) {
    folderList.add(allFolderList[i]);
  }

  var folderView = new com.apress.view.FolderTreeView({collection: folderList});
  $('#side_tree').html(folderView.render().el);
};


function changeNoteFolder(noteid, newfolderid, newfoldername) {
  $.ajax({
    type: "PUT",
    url: headerurl+"/noteheader",
    data: {"noteid": noteid, "folderid": newfolderid, "foldername": newfoldername},
    async: false,
    cache: false,
  }).done(function(json) {
       return true;
  }).fail(function() {
       return false;
  });
};


