

var x = document.getElementById("location");

var longitude
var latitude
function getLocation() {
  if (navigator.geolocation) {
    console.log("Getting position...")
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  console.log("Showing position...")
  console.log(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`)
  x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude

  longitude = position.coords.longitude
  latitude = position.coords.latitude

  // alert(`Latitude: ${latitude}, Longitude ${longitude}`);
}



window.onload = getLocation();