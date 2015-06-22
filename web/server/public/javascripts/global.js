
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

  $('body').on("keydown", function keyDown(e){

    var keyCode = e.keyCode;

    if($.inArray(keyCode, keyCodeArray) != -1){

      if(keyCode === 65){
        if(angleL > 45){
          angleL -= 5;
        }
        setTimeout(function(){waitThenPost(angleL);}, 10);
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

  // $('body').on('keyup', function keyUp(e){
  //   var keyCode = e.keyCode;
  //   if(decoder['keyUpDecoder'].hasOwnProperty(keyCode)) setTimeout(function(){waitThenPost(keyCode, 'keyUpDecoder');}, 10)
  // })

});
