
// Show loading notice



// Start the player


$(document).ready(function(){
  var decoder = {'keyDownDecoder' : {'87':'w', '65':'a', '83':'s', '68':'d', '69':'e', '81':'q'}, 'keyUpDecoder': {'65':'r', '68':'r'}}
  var wsUrl = 'ws://edison.local:8084/';
  var canvas = document.getElementById('canvas-video');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#333';
  ctx.fillText('Loading...', canvas.width/2-30, canvas.height/3);
  var client = new WebSocket(wsUrl);
  var player = new jsmpeg(client, { canvas:canvas });
  function wait(keyCode, decodeObject){
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

  $('body').on("keydown", function keyDown(e){

    var keyCode = e.keyCode;
    console.log(keyCode)
    if(decoder['keyDownDecoder'].hasOwnProperty(keyCode)){
      setTimeout(function(){wait(keyCode, 'keyDownDecoder');}, 10)
    }

  });

  // $('body').on('keyup', function keyUp(e){
  //   var keyCode = e.keyCode;
  //   if(decoder['keyUpDecoder'].hasOwnProperty(keyCode)) setTimeout(function(){wait(keyCode, 'keyUpDecoder');}, 10)
  // })

});
