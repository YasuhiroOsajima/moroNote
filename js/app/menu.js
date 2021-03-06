var headerurl = document.baseURI.slice(6).split('/notelist')[0];
//var headerurl = document.origin.slice(6);
var parameter = location.search;
var accountname = parameter.substring(1, parameter.length);
$('div#account').html(accountname);

unselectedNoteColor_10 = "235, 255, 255";
unselectedNoteColor_16 = "#ebffff";
selectedNoteColor_10 = "192, 255, 255";
selectedNoteColor_16 = "#c0ffff";

unselectedFolderColor_10 = "208, 250, 250";
unselectedFolderColor_16 = "#d0fafa";
selectedFolderColor_10 = "192, 255, 255";
selectedFolderColor_16 = "#c0ffff";


//Bottun
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


$('#createnote').click(function() {
  var folderid = '';
  swal({
    title: "ノート作成",
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

    var folderinfo = getSelectedFolderInfo();
    if (folderinfo == false) {
      swal("ノートの作成に失敗しました");
      return false;
    }

    var folderid = folderinfo.folderid;
    var foldername = folderinfo.foldername;

    if (createNote(notename, folderid, foldername)==false) {
      swal("ノートの作成に失敗しました");
      return false;
    }

    swal("ノートが作成されました", "ノート名: " + notename);
    printFolderNotes(folderid);
  });
});


$(function($) {
  $("#sort_menue").change(function(value) {
    var sortkey = $(this).val();
    var sorttype = $('#sorter').val();
    sortQuery(sortkey, sorttype);
  });
});


$(function($) {
  $("#sorter").change(function() {
    var sorttype = $(this).val();
    var sortkey = $('#sort_menue').val();
    sortQuery(sortkey, sorttype);
  });
});


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


//section css
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



//common function
function sortQuery(sortkey, type) {
  folderinfo = getSelectedFolderInfo();
  if (folderinfo == false) {return false;}
  var folderid = folderinfo.folderid;

  var allNoteList = getNotesFromDB({"sort_key": sortkey, "sort_type": type});
  if (!allNoteList) {return false;}
  printFolderNotes(folderid, allNoteList);
};


function searchNotes(searchkey) {
  $.ajax({
    type: "GET",
    url: headerurl+"/notedataheaders",
    async: false,
    cache: false,
    data: {"notedata": searchkey},
  }).fail(function(noteids) {
       return false;
  }).done(function(noteids) {
       $.ajax({
         type: "GET",
         url: headerurl+"/noteheaderlist",
         data: {"noteids": noteids},
         async: false,
         cache: false,
       }).fail(function(json) {
            return false;
       }).done(function(json) {
            var NoteList = [];
            for (i=0; i<json.length; i++) {
              NoteList.push(json[i]);
            }
            sortedNoteView(NoteList);
       });
  });
};


function createNote(notename, folderid, foldername) {
  $.ajax({
    type: "POST",
    url: headerurl+"/note",
    data: {"title": notename, "folderid": folderid, "foldername": foldername},
    async: false,
    cache: false,
  }).done(function(json) {
       return true;
  }).fail(function(json) {
       return false;
  });
};


function getSelectedFolderInfo() {
  var folderid = '';
  var foldername = '';
  $(".closed").each(function(index, obj) {
    if ("rgb("+selectedFolderColor_10 == $(obj).css("background").split(')')[0]) {
      folderid = $(obj)[0]["id"];
      foldername = $(obj)[0]["innerText"];
    }
  });
  return {"folderid": folderid, "foldername": foldername};
};


(function(){
  console.log(document.origin);
})();


printFolders();
printAllNotes();


