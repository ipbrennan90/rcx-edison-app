
// Show loading notice



// Start the player


$(document).ready(function(){
  var center = 90
  var angleR = 90
  var angleL = 90
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
      success: function(){
          $('.user-sign-up').fadeOut("easeOutCubic", function () {
            $('body').children(':not(.user-options)').toggleClass('blur');
          });
      }
    })
    e.preventDefault()


  })
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
  if(login == true){
    console.log("hey")
    $('body').on("keydown", function keyDown(e){

      var keyCode = e.keyCode;

      if($.inArray(keyCode, keyCodeArray) != -1){

        if(keyCode === 65){
          if(angleL > 45){
            angleL -= 5;
          }
          setTimeout(function(){waitThenPost(angleL);}, 10);
          console.log("I'm going left!")
        }
        if(keyCode === 68){
          if(angleR < 135){
            angleR += 5;
          }
          setTimeout(function(){waitThenPost(angleR);}, 10);
        }
        if(keyCode === 69){
          setTimeout(function(){waitThenPost(center);}, 10);
          angleR = center
          angleL = center
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
