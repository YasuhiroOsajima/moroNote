var headerurl = document.origin.slice(6);

$('input#logout').click(function() {
  $.ajax({
    type: "GET",
    url: headerurl+"/logout",
    async: false,
    cache: false,
    success : function(json, status) {
      console.log(status);
    }
  });
});

var parameter = location.search;
var accountname = parameter.substring(1, parameter.length);
$('div#account').html(accountname);


  //Folder
var allFolderList = [];
var getFoldersFromDB = function() {
  allFolderList = [];
  $.ajax({
    url: headerurl+"/allfolders",
    type: "GET",
    async: false,
    cache: false,
    success : function(json, status) {
      for (i=0; i<json.length; i++) {
        allFolderList.push(json[i]);
      }
    }
  });
};

var printFolders = function() {
  (function(){
    var folderList = new com.apress.collection.FolderList([
      { folderid: 0, name: 'ALL', sortname: '-1', parentfolderid: ''},
    ]);
  
    for (i=0; i<allFolderList.length; i++) {
      folderList.add(allFolderList[i]);
    }
  
    var folderView = new com.apress.view.FolderTreeView({collection: folderList});
    $('#side_tree').html(folderView.render().el);
  })();
};
  
var clearFolderColor = function() {
  $('.closed').each(function(index, obj) {
    $(obj).css("background", "#d0fafa");
  });
};

var printFolderTree = function() {
  $('#side_tree ul').treeview({
    collapsed:true,
    unique:false,
    animated:'fast'
  });
};

var setFoldersOption = function() {
  $('.closed').each(function(index, obj) {
    $(obj).css({"cursor": "pointer",
                "width": "90%",
                "margin": "1px 0px",
                "background": "#d0fafa",
                "border-radius": "3px",
                "border-top": "#fff 1px solid",
                "border-left": "#fff 1px solid",
                "border-bottom": "#999 1px solid",
                "border-right": "#999 1px solid"});
    $("#follow > li").css({"width": "90%"});

    var hasul = $(obj).find('ul');
    if (!hasul.is('ul')) {
      // most under folder
      $(obj).click(function() {
        $('#searcher').val("");
        var clickfolderid = $(obj)['0']["id"];
        resetNoteView(clickfolderid);
      });

      $(obj).droppable({
        drop: function(event, ui) {
          var noteid = ui.helper.context['id'];
          var droptagid = $(obj)['0']["id"];
          changeNoteFolder(noteid, droptagid);
        }
      });
    }
  });
};

var resetFolderRightMenue = function() {
  $('#foldertree li').each(function(index, obj) {
    $(obj).chromeContext({
      items: [
        { title: '子フォルダ作成',
          onclick: function(event) { createChildFolder(obj); } },
        { title: 'フォルダを削除',
          onclick: function(event) { deleteFolder(obj); } },
        { title: 'フォルダ名変更',
          onclick: function(event) { changeFolderName(obj); } },
      ]
    });
  });
};

var createChildFolder = function(folderobj) {
  var folderid = folderobj.id;
  swal({
    title: "フォルダ作成",
    text: "フォルダ名を入力してください",
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    animation: "slide-from-top",
    inputPlaceholder: "Write something"
  },
  function(inputValue){
    if (inputValue === false) return false;
    if (inputValue === "") {
      swal.showInputError("無効なフォルダ名です");
      return false
    }
    var foldername = inputValue;
    var checkfoldernameexists = false;
    getFoldersFromDB();
    for (i=0; i<allFolderList.length; i++) {
      if (allFolderList[i]["name"] == foldername) {
        checkfoldernameexists = true;
      }
    }
    if (checkfoldernameexists) {
      swal("同じ名前のフォルダがすでに存在します: " + inputValue);
    } else {
      var pfolderid = '';
      if (folderid=='0' || folderid=='1') {
        pfolderid = '';
      } else {
        pfolderid = folderid;
      }
      $.ajax({
        type: "POST",
        url: headerurl+"/folder",
        data: {"name": foldername, "parentfolderid": pfolderid},
        async: false,
        cache: false,
        success : function(json, status) {
          console.log(status);
        }
      });
      swal("フォルダが作成されました: " + inputValue);
      resetFolderView();
    }
  });
}

var deleteFolder = function(folderobj) {
  var folderid = folderobj.id;
  if (folderid==0 || folderid==1) {
    swal("このフォルダは削除できません");
  } else {
    var hasul = $(folderobj).find('ul');
    if (!hasul.is('ul')) {
      //most bottom folder
      $.ajax({
        type: "GET",
        url: headerurl+"/noteheaders",
        data: {"folderid": folderid},
        async: false,
        cache: false,
        success : function(json, status) {
          console.log(status);
          if (json.length == 0) {
            //folder has not note
            $.ajax({
              type: "DELETE",
              url: headerurl+"/folder",
              data: {"folderid": folderid},
              async: false,
              cache: false,
              success : function(json, status) {
                console.log(status);
                resetFolderView();
                swal("フォルダが削除されました ");
              }
            });
          } else {
            swal("フォルダ内のノートを削除してください");
          }
        }
      });
    } else {
      swal("フォルダ内に他のフォルダが存在します");
    }
  }
}

var changeFolderName = function(folderobj) {
  var folderid = folderobj.id;
  swal({
    title: "フォルダ名変更",
    text: "フォルダ名を入力してください",
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    animation: "slide-from-top",
    inputPlaceholder: "Write something"
  },
  function(inputValue){
    if (inputValue === false) return false;
    if (inputValue === "") {
      swal.showInputError("無効なフォルダ名です");
      return false
    }
    var foldername = inputValue;
    $.ajax({
      type: "PUT",
      url: headerurl+"/folder",
      data: {"folderid": folderid, "name": foldername},
      async: false,
      cache: false,
      success : function(json, status) {
        console.log(status);
      }
    });
    swal("フォルダ名が変更されました: " + inputValue);
    resetFolderView();
  });
}

var resetFolderView = function() {
  getFoldersFromDB();
  printFolders();
  printFolderTree();
  setFoldersOption();
  resetFolderRightMenue();
};

resetFolderView();



  //Note
var allNoteList = [];
var getNotesFromDB = function() {
  allNoteList = [];
  $.ajax({
    url: headerurl+"/allnoteheaders",
    type: "GET",
    async: false,
    cache: false,
    success : function(json, status) {
      for (i=0; i<json.length; i++) {
        allNoteList.push(json[i]);
      }
    }
  });
};

var printFolderNotes = function(folderid) {
  var noteList = new com.apress.collection.NoteList();

  for (i=0; i<allNoteList.length; i++) {
    if (allNoteList[i]["folderid"]==folderid || folderid==0) {
      noteList.add(allNoteList[i]);
    }
  }

  var notesView = new com.apress.view.NotesView({collection: noteList});
  $('#main_notes').html(notesView.render().el);

  $('#'+folderid).css("background", "#c0ffff");
};

var clearNoteColor = function() {
  $('#notelist li').each(function(index, obj) {
    $(obj).css("background", "");
  });
};

var setNotesOption = function() {
  $('#notelist li').each(function(index, obj) {
    var noteid = $(obj)['0']["id"];

    $(obj).css("cursor", "pointer");

    $(obj).draggable({
      revert: true,
      opacity: 0.7,
      containment: 'window',
      helper: 'clone'
    });

    $(obj).click(function() {
      clearNoteColor();
      $(obj).css("background", "#c0ffff");
      printPreview(noteid);
    });

    $(obj).dblclick(function() {
      var childWindow = window.open('about:blank');
      var linkurl = headerurl+'/editor#'+noteid;
      console.log(linkurl);
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
    });
  });
};

var resetNoteRightMenue = function() {
  $('#notelist li').each(function(index, obj) {
    $(obj).chromeContext({
      items: [
        { title: 'ノートを削除',
          onclick: function(event) { deleteNote(obj); } },
        { title: 'ノート名変更',
          onclick: function(event) { changeNoteName(obj); } },
      ]
    });
  });
};

var changeNoteName = function(noteobj) {
  var noteid = noteobj.id;
  swal({
    title: "ノート名変更",
    text: "ノート名を入力してください",
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    animation: "slide-from-top",
    inputPlaceholder: "Write something"
  },
  function(inputValue){
    if (inputValue === false) return false;
    if (inputValue === "") {
      swal.showInputError("無効なノート名です");
      return false
    }
    var notename = inputValue;
    var folderid = '';
    $('.closed').each(function(index, obj) {
      if ("rgb(192, 255, 255" == $(obj).css("background").split(')')[0]) {
        folderid = $(obj)[0]["id"];
      }
    });
    $.ajax({
      type: "PUT",
      url: headerurl+"/noteheader",
      data: {"noteid": noteid, "title": notename},
      async: false,
      cache: false,
      success : function(json, status) {
        console.log(status);
      }
    });
    swal("ノート名が変更されました: " + inputValue);
    resetNoteView(folderid);
  });
}

var deleteNote = function(noteobj) {
  var noteid = noteobj.id;
  var folderid = '';
  $.ajax({
    type: "GET",
    url: headerurl+"/noteheader",
    data: {"noteid": noteid},
    async: false,
    cache: false,
    success : function(json, status) {
      console.log(status);
      folderid = json[0]['folderid'];
    }
  });

  $.ajax({
    type: "DELETE",
    url: headerurl+"/note",
    data: {"noteid": noteid},
    async: false,
    cache: false,
    success : function(json, status) {
      console.log(status);
    }
  });
  resetNoteView(folderid);
  swal("ノートが削除されました");
};


var changeNoteFolder = function(noteid, newfolderid) {
  $.ajax({
    type: "PUT",
    url: headerurl+"/noteheader",
    data: {"noteid": noteid, "folderid": newfolderid},
    async: false,
    cache: false,
    success : function(json, status) {
      console.log(status);
    }
  });
  resetNoteView(newfolderid);
};


var sortedNoteView = function(folderid) {
  clearFolderColor();
  printFolderNotes(folderid);
  setNotesOption();
  resetNoteRightMenue();
}

var resetNoteView = function(folderid) {
  clearFolderColor();
  getNotesFromDB();
  printFolderNotes(folderid);
  setNotesOption();
  resetNoteRightMenue();
}

var PrintAllNotes = function() {
  resetNoteView(0);
};

  // initial note view
PrintAllNotes();


  //Note Preview
var printPreview = function(noteid) {
  $.ajax({
    type: "GET",
    url: headerurl+"/notedata",
    data: {"noteid": noteid},
    async: false,
    cache: false,
    success : function(json, status) {
      var html = marked(json["0"]["data"]);
      $('#preview').html(html);
    }
  });
};


$('#createnote').click(function() {
  var folderid = '';
  swal({
    title: "ノート作成",
    text: "ノート名を入力してください",
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    animation: "slide-from-top",
    inputPlaceholder: "Write something"
  },
  function(inputValue){
    if (inputValue === false) return false;
    if (inputValue === "") {
      swal.showInputError("無効なノート名です");
      return false
    }
    var notename = inputValue;
    var folderid = '';
    $('.closed').each(function(index, obj) {
      if ("rgb(192, 255, 255" == $(obj).css("background").split(')')[0]) {
        folderid = $(obj)[0]["id"];
      }
    });
    $.ajax({
      type: "POST",
      url: headerurl+"/note",
      data: {"title": notename, "folderid": folderid},
      async: false,
      cache: false,
      success : function(json, status) {
        console.log(status);
      }
    });
    swal("ノートが作成されました", "ノート名: " + inputValue);
    resetNoteView(folderid);
  });
});

var sortQuery = function(sortkey, type) {
  var folderid = '';
  $('.closed').each(function(index, obj) {
    if ("rgb(192, 255, 255" == $(obj).css("background").split(')')[0]) {
      folderid = $(obj)[0]["id"];
    }
  });

  $.ajax({
    type: "GET",
    url: headerurl+"/allnoteheaders",
    data: {"key": sortkey, "type": type},
    async: false,
    cache: false,
    success : function(json, status) {
      allNoteList = [];
      for (i=0; i<json.length; i++) {
        allNoteList.push(json[i]);
      }
      sortedNoteView(folderid);
    }
  });
};

$(function($) {
  $('#sort_menue').change(function(value) {
    var sortkey = $(this).val();
    var sorttype = $('#sorter').val();
    sortQuery(sortkey, sorttype);
  });
});

$(function($) {
  $('#sorter').change(function() {
    var sorttype = $(this).val();
    var sortkey = $('#sort_menue').val();
    sortQuery(sortkey, sorttype);
  });
});

var searchNotes = function(searchkey) {
  $.ajax({
    type: "GET",
    url: headerurl+"/notedataheaders",
    data: {"notedata": searchkey},
    async: false,
    cache: false,
    success : function(noteids, status) {
      console.log(noteids);
      $.ajax({
        type: "GET",
        url: headerurl+"/noteheaderlist",
        data: {"noteids": noteids},
        async: false,
        cache: false,
        success : function(json, status) {
          allNoteList = [];
          for (i=0; i<json.length; i++) {
            allNoteList.push(json[i]);
          }
          console.log(allNoteList);
          sortedNoteView(0);
        }
      });
    }
  });
};

$(function($) {
  $('#searcher').keypress(function(e) {
    if (e.which == 13) {
      var searchkey = $(this).val();
      searchNotes(searchkey);
    }
  });
});

$(function($) {
  $('#search').click(function() {
    var searchkey = $('#searcher').val();
    searchNotes(searchkey);
  });
});

  //Section Resize
(function(){
  $('#sidemenu').resizable({
    minWidth: 220,
    maxWidth: 300,
    minHeight: 615,
    maxHeight: 615,
    autoHide: true
  });

  $('#main').resizable({
    minWidth: 350,
    maxWidth: 500,
    minHeight: 615,
    maxHeight: 615,
    autoHide: true
  });
})();

$('input[type="button"], input[type="submit"], select').each(function(index, obj) {
  $(obj).css("cursor", "pointer");
});


(function(){
  console.log(document.origin);
})();

