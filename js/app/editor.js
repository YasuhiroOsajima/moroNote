var dbserver = "xxxxxx";
var headerurl = "//"+dbserver+":9999";

$(function() {
  $('#edit').keyup(function() {
    var html = marked($(this).val());
    $('#preview').html(html);
  });
});

var getOriginNotedata = function() {
  $.ajax({
    type: "GET",
    url: headerurl+"/notedata",
    data: {"noteid": noteid},
    async: false,
    cache: false,
    success : function(json, status) {
      notedata_org = json["0"]["data"];
      $('#edit').val(notedata_org);
      var html = marked(notedata_org);
      $('#preview').html(html);
    }
  });
};


var noteid = window.location.hash.slice(1);

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

var notedata_org ='';
getOriginNotedata()

$('input').each(function(index, obj) {
  $(obj).css("cursor", "pointer");
});

$('input#save').click(function() {
  var notedata = $('#edit').val();
  var senddata = {"noteid": noteid, "notedata": notedata};
  $.ajax({
    type: 'PUT',
    url: headerurl+'/notedata',
    data: senddata,
    async: true,
    cache: false,
    dataType : "json",
  }).done(function(jqXHR) {
    console.log(jqXHR);
  }).fail(function(jqXHR) {
    console.log(jqXHR);
  });
  notedata_org = notedata;
  console.log(notedata_org);
});

var notSaveClose = function() {
  var notedata = $('#edit').val();
  if (notedata_org !== notedata) {
    swal({
      title: "ノートが更新されています",
      text: "保存せずにノートを閉じますか？",
      type: "warning",
      showCancelButton: true,
      closeOnConfirm: true 
    },
    function(inputValue){
      if (inputValue == true) {
        window.close();
      }
    });
  } else {
    window.close();
  }
};

$('input#close').click(function() {
  notSaveClose();
});

(function(){
  console.log(document);
})();

