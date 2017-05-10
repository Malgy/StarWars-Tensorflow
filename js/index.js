// set up video and canvas elements needed
var videoInput = document.getElementById('vid');
var canvasInput = document.getElementById('compare');
var canvasOverlay = document.getElementById('overlay')
var debugOverlay = document.getElementById('debug');
var overlayContext = canvasOverlay.getContext('2d');
var pictureSnap = document.getElementById('snapPic').getContext('2d');
canvasOverlay.style.position = "absolute";
canvasOverlay.style.top = '0px';
canvasOverlay.style.zIndex = '100001';
canvasOverlay.style.display = 'block';
debugOverlay.style.position = "absolute";
debugOverlay.style.top = '0px';
debugOverlay.style.zIndex = '100002';
debugOverlay.style.display = 'none';

// add some custom messaging
statusMessages = {
  "whitebalance": "checking for stability of camera whitebalance",
  "detecting": "Detecting face",
  "hints": "Hmm. Detecting the face is taking a long time",
  "redetecting": "Lost track of face, redetecting",
  "lost": "Lost track of face",
  "found": "Tracking face"
};

supportMessages = {
  "no getUserMedia": "Unfortunately, <a href='http://dev.w3.org/2011/webrtc/editor/getusermedia.html'>getUserMedia</a> is not supported in your browser. Try <a href='http://www.opera.com/browser/'>downloading Opera 12</a> or <a href='http://caniuse.com/stream'>another browser that supports getUserMedia</a>. Now using fallback video for facedetection.",
  "no camera": "No camera found. Using fallback video for facedetection."
};

document.addEventListener("headtrackrStatus", function(event) {
  if (event.status in supportMessages) {
    var messagep = document.getElementById('gUMMessage');
    messagep.innerHTML = supportMessages[event.status];
  } else if (event.status in statusMessages) {
    var messagep = document.getElementById('headtrackerMessage');
    messagep.innerHTML = statusMessages[event.status];
  }
}, true);

// the face tracking setup

var htracker = new headtrackr.Tracker({
  calcAngles: true,
  ui: false,
  headPosition: false,
  debug: debugOverlay
});
htracker.init(videoInput, canvasInput);
htracker.start();

// for each facetracking event received draw rectangle around tracked face on canvas

document.addEventListener("facetrackingEvent", function(event) {
  // clear canvas
  overlayContext.clearRect(0, 0, 320, 240);
  // once we have stable tracking, draw rectangle
  if (event.detection == "CS") {
    overlayContext.translate(event.x, event.y)
    overlayContext.rotate(event.angle - (Math.PI / 2));
    overlayContext.strokeStyle = "#00CC00";
    overlayContext.strokeRect((-(event.width / 2)) >> 0, (-(event.height / 2)) >> 0, event.width, event.height);
    overlayContext.rotate((Math.PI / 2) - event.angle);
    overlayContext.translate(-event.x, -event.y);
    pictureSnap.clearRect(0, 0, 640, 480);
    pictureSnap.drawImage(videoInput, 0, 0, 640, 480);
    // pictureSnap.drawImage(videoInput, event.x, event.y, 240, 320, 0, 0, event.width, event.height);
  }
});
// cut around square
document.getElementById("snap").addEventListener("click", function() {
  // getProbability();
  testProb();
});
// function dataURItoBlob(dataURI) {
//   var byteString = atob(dataURI.split(',')[1]);

//   var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

//   var ab = new ArrayBuffer(byteString.length);
//   var ia = new Uint8Array(ab);
//   for (var i = 0; i < byteString.length; i++)
//   {
//       ia[i] = byteString.charCodeAt(i);
//   }

//   var bb = new Blob([ab], { "type": mimeString });
//   return bb;
// }

// function getProbability() {
//   var canvas = document.getElementById("snapPic");                
//   var dataURL = canvas.toDataURL("image/jpeg");                
//   document.getElementById('hidden_data').value = dataURL;                
//   var fd = new FormData(document.forms["form1"]);  
//   $.ajax({
//       type: "GET",
//       url: "http://localhost:8080",
//       data: fd,
// processData: false,
// contentType: false,
//       traditional: true,
//       cache: false,
//       success: function(response) {
//         console.log(response);
//     }
//   });
// }

function testProb() {                
  var canvas = document.getElementById("snapPic");                
  var dataURL = canvas.toDataURL("image/jpeg");                
  document.getElementById('hidden_data').value = dataURL;                
  var fd = new FormData(document.forms["form1"]);                 
  var xhr = new XMLHttpRequest();                
  xhr.open('POST', 'http://yoda.kean.edu/~rodrjon1/CPS5921/tensor/imageprocess.php', true);                 
  // xhr.upload.onprogress = function(e) {                    
  //   if (e.lengthComputable) {                        
  //     var percentComplete = (e.loaded / e.total) * 100;                        
  //     console.log(percentComplete + '% uploaded');                        
  //     alert('Succesfully uploaded');                     }                 };                 
  xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById("prediction").innerHTML = "";
          var resultArr = JSON.parse(this.responseText);
          for (var i = 0; i <resultArr.length; i++) {
            if (resultArr[i] != "") {
              document.getElementById("prediction").innerHTML += resultArr[i] + "<br>";
            }
          }
          testProb();
       }
    };             
  xhr.send(fd);
}


