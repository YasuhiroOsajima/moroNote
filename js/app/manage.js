//var headerurl = document.baseURI.slice(6).split('/login')[0];
var headerurl = document.origin.slice(6);

$('#registorb').click(function() {
  var username = $('#addnamearea').val();
  var password = $('#passwordarea').val();

  console.log(username);
  console.log(password);
  $.ajax({
    type: "POST",
    url: headerurl+"/useradd",
    data: {"username": username, "password": password},
    async: false,
    cache: false,
    success : function(json, status) {
      swal({
        title:"",
        text: "ユーザが登録されました。 :"+username
      },
      function() {
        console.log(status);
        listUser();
        $('#addnamearea').val('');
        $('#passwordarea').val('');
      });
    },
    error :  function(json, status) {
      swal({
        title:"",
        text: "パスワードの長さが不足しています"
      },
      function() {
        listUser();
        $('#addnamearea').val('');
        $('#passwordarea').val('');
        console.log(status);
      });
    }
  });
});

$('#deleteb').click(function() {
  var username = $('#deletenamearea').val();

  console.log(username);
  $.ajax({
    type: "DELETE",
    url: headerurl+"/userdelete",
    data: {"username": username },
    async: false,
    cache: false,
    success : function(json, status) {
      swal({
        title:"",
        text: "ユーザが削除されました。 :"+username
      },
      function() {
        console.log(status);
        $('#deletenamearea').val('');
        listUser();
      });
    },
    error :  function(json, status) {
      swal({
        title:"",
        text: "削除に失敗しました"
      },
      function() {
        console.log(status);
        $('#deletenamearea').val('');
        listUser();
      });
    }
  });
});



function listUser() {
  $("#userlistarea").empty();

  $.ajax({
    type: "GET",
    url: headerurl+"/userlist",
    async: true,
    cache: false,
    success : function(json, status) {
      for (i=0; i<json.length; i++) {
        console.log(json[i].username);
        $("#userlistarea").append("<li class='noteusers'>"+json[i].username+"</li>");
      }
    }
  });
}

$('#back').click(function() {
  window.location.href = '/login';
});


(function(){
  listUser();
})();


