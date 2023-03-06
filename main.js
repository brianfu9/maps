document.addEventListener("DOMContentLoaded", function(event)
{

	if (window.DeviceOrientationEvent) {
  document.getElementById("notice").innerHTML = "Genial! La API deviceOrientationEvent es compatible!.";
  window.addEventListener('deviceorientation', function(eventData) {
  	// gamma: Tilting the device from left to right. Tilting the device to the right will result in a positive value.
    var tiltLR = eventData.gamma;

    // beta: Tilting the device from the front to the back. Tilting the device to the front will result in a positive value.
    var tiltFB = eventData.beta;

    // alpha: The direction the compass of the device aims to in degrees.
    var dir = eventData.alpha

    // Call the function to use the data on the page.
    deviceOrientationHandler(tiltLR, tiltFB, dir);
  }, false);
} else {
  document.getElementById("notice").innerHTML = "Helaas. De DeviceOrientationEvent API word niet door dit toestel ondersteund."
};

  function deviceOrientationHandler(tiltLR, tiltFB, dir) 
  {
      document.getElementById("tiltLR").innerHTML = Math.ceil(tiltLR);
      document.getElementById("tiltFB").innerHTML = Math.ceil(tiltFB);
      
      // Rotate the disc of the compass.
      var compassDisc = document.getElementById("compassDiscImg");
    
      var offset = 135;
     var totalDir = -(dir + offset);
    
    
      document.getElementById("direction").innerHTML = "dir: " + Math.ceil(dir)  + " + offset("+offset+") = " + Math.ceil(totalDir);
    
      compassDisc.style.left =  totalDir +"px";
    
    }

});