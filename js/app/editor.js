//var headerurl = document.baseURI.slice(6).split('/login')[0];
var headerurl = document.origin.slice(6);

var noteid = window.location.hash.slice(1);


$(function() {
  $('#edit').keyup(function() {
    var html = marked($(this).val());
    $('#preview').html(html);
  });
});


$(window).ready(function(){
  $("textarea").on("keyup change", function(){
    $(window).on("beforeunload", function() {
      return "ノートが更新されています。保存せずにノートを閉じますか？";
    });
  });
});


function getOriginNotedata() {
  $.ajax({
    type: "GET",
    url: headerurl+"/notedata",
    data: {"noteid": noteid},
    async: false,
    cache: false,
    success : function(json, status) {
      var notedata_org = json["0"]["data"];
      $("#edit").val(notedata_org);
      var html = marked(notedata_org);
      $('#preview').html(html);
    }
  });
};


function getNotename() {
  $.ajax({
    type: "GET",
    url: headerurl+"/noteheader",
    data: {"noteid": noteid},
    async: false,
    cache: false,
    success : function(json, status) {
      var notename = json["0"]["title"];
      $('#notename').html(notename);
    }
  });
};


function uploadNotedata() {
  var notedata = $("#edit").val();
  var senddata = {"noteid": noteid, "notedata": notedata};
  $.ajax({
    type: "PUT",
    url: headerurl+"/notedata",
    data: senddata,
    async: true,
    cache: false,
    dataType : "json"
  }).done(function(jqXHR) {
    console.log(jqXHR);
  }).fail(function(jqXHR) {
    console.log(jqXHR);
  });
  $(window).off("beforeunload");
};


$("input#save").click(function() {
  uploadNotedata();
});


$("input#close").click(function() {
  window.close();
});


getOriginNotedata();
getNotename();


$(window).bind('keydown', function(event) {
  if (event.ctrlKey || event.metaKey) {
    switch (String.fromCharCode(event.which).toLowerCase()) {
    case 's':
      event.preventDefault();
      uploadNotedata();
      break;
    }
  }
});


