
// Show loading notice



// Start the player


$(document).ready(function(){
  var center = 90
  var angle = 90
  var decoder = {'keyDownDecoder' : {'87':'w', '65':center.toString(), '83':'s', '68':center.toString(), '69':'e', '81':'q'}, 'keyUpDecoder': {'65':'r', '68':'r'}}
  var wsUrl = 'ws://edison.local:8084/';
  var canvas = document.getElementById('canvas-video');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#333';
  ctx.fillText('Loading...', canvas.width/2-30, canvas.height/3);
  var client = new WebSocket(wsUrl);
  var player = new jsmpeg(client, { canvas:canvas });
  function wait(keyCode, decodeObject, angleChange){
    console.log(decoder[decodeObject][keyCode.toString()])
    console.log('post fired')
    $.ajax({
      type: "POST",
      url: "/",
      data: {"message": decoder[decodeObject][keyCode.toString()]},
      success: function(data){
        console.log(data.toString())
      }
    });

  }
  var decrement = 0
  var increment = 0

  $('body').on("keydown", function keyDown(e){

    var keyCode = e.keyCode;

    if(decoder['keyDownDecoder'].hasOwnProperty(keyCode)){
      if(keyCode == 65 || keyCode == 68){
        if(keyCode ==65){
          decrement += 5
          decoder['keyDownDecoder'][keyCode.toString()] = (angle-decrement).toString()
          setTimeout(function(){wait(keyCode, 'keyDownDecoder');}, 10)
        }else{
          increment += 5
          decoder['keyDownDecoder'][keyCode.toString()] = (angle+increment).toString()
          setTimeout(function(){wait(keyCode, 'keyDownDecoder');}, 10)
        }

      }else{
        decrement = 0
        increment = 0
        decoder['keyDownDecoder']['65'][1] = center.toString()
        decoder['keyDownDecoder']['68'][1] = center.toString()
        setTimeout(function(){wait(68, 'keyDownDecoder');}, 800)
        setTimeout(function(){wait(keyCode, 'keyDownDecoder');}, 100)
      }

    }

  });

  // $('body').on('keyup', function keyUp(e){
  //   var keyCode = e.keyCode;
  //   if(decoder['keyUpDecoder'].hasOwnProperty(keyCode)) setTimeout(function(){wait(keyCode, 'keyUpDecoder');}, 10)
  // })

});
