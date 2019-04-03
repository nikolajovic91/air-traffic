
$(document).ready(function () {
  showModal();

});


function getData(latitude, longitude) {

  $.ajaxSetup({
    scriptCharset: "utf-8", // or "ISO-8859-1"
    contentType: "application/json; charset=utf-8"
  });

  $.getJSON('http://whateverorigin.org/get?url=' +
    encodeURIComponent('https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat=' + latitude + '&lng=' + longitude + '&fDstL=0&fDstU=90') + '&callback=?',
    function (data) {
      console.log("> ", data);
      var response = "";

      if (typeof (data) == 'undefined')
        return;

      if (data != null && data.contents != null && data.contents.acList != null) {
        var sortedData = sortData(data.contents.acList);
        var row = "";
        $("#bodyData").html("");
        $.each(sortedData, function (k, it) {

          var image = "";
          // utvrdjivanje u kom pravcu ide avion
          if (it.Trak > 0 && it.Trak < 6)
            image = "css/img/Icons-Land-Transporter-Airplane-Right-Red.ico";
          else
            image = "css/img/Icons-Land-Transporter-Airplane-Left-Red.ico";

          row += "<div class='row'><div class='col-sm-4' id='icons'><img height='50' width='100' src=" + image + "></div>" +
            "<div class='col-sm-4' id='altitude'>" + it.Alt + "</div>" +
            "<div class='col-sm-4' id='flightCode'>" + it.CNum + "</div></div>";
        });

        $("#bodyData").append(row);
      }
    });

}

function sortData(unsortedData) {
  if (unsortedData == null || typeof (unsortedData) == 'undefined')
    return;
  var sorted = unsortedData.sort(function (a, b) {
    return ((a.Alt > b.Alt) ? -1 : ((a.Alt < b.Alt) ? 1 : 0));
  });

  return sorted;
}

function showModal() {
  swal({
    title: "Do you allow the app to use your current location?",
    text: "Your current location is necessary for data about aircraft! Thank you!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
    .then((ok) => {
      if (ok) {
        getLocation();
      } else {
        swal("Sorry data about aircraft didn't show because location is necessary!");
      }
    });
}

// osvezavanje podataka na jedan minut
setInterval(function () {
  getLocation();
}, 60 * 1000);


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    swal("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  var dataCord = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;
  if (position != null && position.coords != null)
    getData(position.coords.latitude, position.coords.longitude)
  else
    swal("Something went wrong! Latitude and longitude is empty!");
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      swal("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      swal("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      swal("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      swal("An unknown error occurred.");
      break;
  }
}