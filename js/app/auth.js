var dbserver = "xxxxxx";
var headerurl = "//"+dbserver+":9999";

$('#login').click(function() {
  var username = $('#namearea').val();
  var password = $('#passwordarea').val();

  $.ajax({
    type: "GET",
    url: headerurl+"/login",
    data: {"username": username, "password": password},
    async: false,
    cache: false,
    success : function(json, status) {
      console.log(status);
      window.location.href = '/notelist?'+username;
    },
    error : function(json, status) {
      swal({
        title:"",
        text: "ユーザ名かパスワードが正しくありません"
      },
      function() {
        console.log(status);
      });
    }
  });
});

$('#manage').click(function() {
  var username = $('#namearea').val();
  var password = $('#passwordarea').val();

  $.ajax({
    type: "GET",
    url: headerurl+"/login",
    data: {"username": username, "password": password},
    async: false,
    cache: false,
    success : function(json, status) {
      console.log(status);
      window.location.href = '/manage';
    },
    error : function(json, status) {
      swal({
        title:"",
        text: "ユーザ名かパスワードが正しくありません"
      },
      function() {
        console.log(status);
      });
    }
  });
});

$('#registorb').click(function() {
  var username = $('#namearea').val();
  var password = $('#passwordarea').val();

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
        window.location.href = '/login';
      });
    },
    error :  function(json, status) {
      swal({
        title:"",
        text: "パスワードの長さが不足しています"
      },
      function() {
        console.log(status);
      });
    }
  });
});

$('#back').click(function() {
  window.location.href = '/login';
});

