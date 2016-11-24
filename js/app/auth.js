var headerurl = document.baseURI.slice(6).split('/login')[0];
//var headerurl = document.origin.slice(6);

function checkAndLogin() {
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
};


$(function($) {
  $('#namearea').keypress(function(e) {
    if (e.which == 13) {
      checkAndLogin();
    }
  });
});


$(function($) {
  $('#passwordarea').keypress(function(e) {
    if (e.which == 13) {
      checkAndLogin();
    }
  });
});


$('#login').click(function() {
  checkAndLogin();
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

