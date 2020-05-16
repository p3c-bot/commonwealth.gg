var video = document.createElement("video");
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");
var loadingMessage = document.getElementById("loadingMessage");
var outputContainer = document.getElementById("output");
var outputMessage = document.getElementById("outputMessage");
var outputData = document.getElementById("outputData");

function drawLine(begin, end, color) {
  canvas.beginPath();
  canvas.moveTo(begin.x, begin.y);
  canvas.lineTo(end.x, end.y);
  canvas.lineWidth = 4;
  canvas.strokeStyle = color;
  canvas.stroke();
}

$('#activateReader').on('click', function (){
  $("#gatherQr").hide()
  $("#qrReader").show()
  $("#canvas").addClass("qrCanvas")
  killVideo()
  activateReader()
})

$('#closeVideo').on('click', function (){
  killVideo()
  $("#qrReader").hide()
  $("#gatherQr").show()
})

var vidStream
function activateReader(){
// Use facingMode: environment to attemt to get the front camera on phones
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
    vidStream = stream;
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    requestAnimationFrame(tick);
});
}

function tick() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvasElement.hidden = false;
    outputContainer.hidden = false;

    canvasElement.height = video.videoHeight / 2;
    canvasElement.width = video.videoWidth / 2;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
    var code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });
    if (code) {
      drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
      drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
      drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
      drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");

      // if we have code
      if(checkIfCrop(code.data)){
        $("#transferAddress").val(code.data)
        killVideo()
        return
      }
    }
  }
  requestAnimationFrame(tick);
}

function killVideo(){
  canvasElement.hidden = true;
  video.pause();
  video.src = ""
  if (vidStream)
    vidStream.getTracks().forEach(track => track.stop());
}