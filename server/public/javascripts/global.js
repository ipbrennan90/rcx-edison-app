
// Show loading notice



// Start the player


$(document).ready(function(){
  var center = 90
  var angle = 90
  var throttle = 1530
  var keyCodeArray = [87, 65, 83, 68, 69, 81]
  var wsUrl = 'ws://edison.local:8084/';
  var canvas = document.getElementById('canvas-video');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#333';
  ctx.fillText('Loading...', canvas.width/2-30, canvas.height/3);
  var client = new WebSocket(wsUrl);
  var player = new jsmpeg(client, { canvas:canvas });
  var login = false

  var changeLogin = function(){
    login = true
  }

  $('body').children(':not(.user-options)').toggleClass('blur');
  $('.user-sign-up').hide();
  $('.user-sign-in').hide();
  $('canvas').hide();
  $('.alert').hide()
  $('.login-alert').hide()
  $('.sign-up').on('click', function () {
    $('.user-options').fadeOut("easeOutCubic", function(){
      $('.user-sign-up').toggleClass('blur');
      $('.user-sign-up').fadeIn("easeInCubic");
    });
  });
  $('.sign-in').on('click', function () {
    $('.user-options').fadeOut("easeOutCubic", function(){
      $('.user-sign-in').toggleClass('blur');
      $('.user-sign-in').fadeIn("easeInCubic");
    });
  });
  $('.add-user').on('click', function (e) {
    var name = $('input#username').val()
    var email = $('input#email').val()
    var password = $('input#password').val()
    var password_confirmation = $('input#password-confirmation').val()

    $.ajax({
      type: "POST",
      url: "/newuser",
      data: {"newuser": {"username": name, "email": email, "password":password, "password-confirmation":password_confirmation}},
      success: function(data){

          $('.user-sign-up').fadeOut("easeOutCubic", function () {
            $('body').children(':not(.user-options)').toggleClass('blur');
            $('canvas').fadeIn("easeInCubic")
            enableKeys()
          });
      },
      error: function(request, status, errorThrown){
        if(errorThrown){
          alert("ERROR!")
        }
      }
    })
    e.preventDefault()


  })

  $('.login-user').on('click', function(e){
    var username = $('input#username_login').val()
    console.log(username)
    var password = $('input#password_login').val()
    $.ajax({
      type: "POST",
      url: "/signin",
      data: {"loginuser":{"username":username, "password":password}},
      statusCode: {
        512:function(){
          $('.login-alert').append("<p><strong>Wrong </strong>password, please try again or sign up.")
          $('.login-alert').fadeIn("easeInCubic")
        },
        513:function(){
          $('.user-sign-in').fadeOut("easeOutCubic", function(){
            $('.user-sign-up').removeClass('blur');
            $('.user-sign-up').fadeIn("easeInCubic");
            $('.alert').append("<p><strong>No </strong>user found, please sign up.</p>")
            $('.alert').fadeIn("easeInCubic")
            $('input#username').val($('input#username').val() + $('input#username_login').val())
          });

        }
      },
      success: function(data){
        $('.user-sign-in').fadeOut("easeOutCubic", function () {
          $('body').children(':not(.user-options)').removeClass('blur');
          $('canvas').fadeIn("easeInCubic")
          enableKeys()
        });
      }
    });
    e.preventDefault()
  })

  $('.return-to-login').on('click', function(){
    $('.user-sign-up').fadeOut("easeOutCubic", function(){
      $('.user-sign-in').removeClass('blur')
      $('.user-sign-in').fadeIn("easeInCubic");
    });
  });
  function waitThenPost(commandValue){
    console.log(commandValue)
    console.log('post fired')
    $.ajax({
      type: "POST",
      url: "/",
      data: {"message": commandValue + "\n"},
      success: function(data){
        console.log(data.toString())
      }
    });

  };


  var enableKeys = function(){
    $('body').on("keydown", function keyDown(e){

      var keyCode = e.keyCode;

      if($.inArray(keyCode, keyCodeArray) != -1){

        if(keyCode === 65){
          if(angle > 45){
            angle -= 3;
          }
          setTimeout(function(){waitThenPost(angle);}, 10);
          console.log("I'm going left!")
        }
        if(keyCode === 68){
          if(angle < 135){
            angle += 3;
          }
          setTimeout(function(){waitThenPost(angle);}, 10);
        }
        if(keyCode === 69){
          setTimeout(function(){waitThenPost(center);}, 10);
          angle = center
        }
        if(keyCode === 81){
          throttle = 1530;
          setTimeout(function(){waitThenPost(throttle);}, 10);
        }
        if(keyCode === 87){
          if(throttle < 2000){
            throttle += 5;
          }
          setTimeout(function(){waitThenPost(throttle);}, 10);
        }
        if(keyCode === 83){
          if(throttle > 1530){
            throttle -= 5;
          }
          setTimeout(function(){waitThenPost(throttle);}, 10);
        }


      }

    });
  }



  // $('body').on('keyup', function keyUp(e){
  //   var keyCode = e.keyCode;
  //   if(decoder['keyUpDecoder'].hasOwnProperty(keyCode)) setTimeout(function(){waitThenPost(keyCode, 'keyUpDecoder');}, 10)
  // })

});
