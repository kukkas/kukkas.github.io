var API_KEY = 'AIzaSyB5CicyOj31WzXL0Kuyn0fgQl4zhcMjC1k';
var map;

function initMap() {
  var helsinki = {lat: 60.169856, lng: 24.938379};

  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: helsinki,
    scrollwheel: false,
    streetViewControl: false,
    mapTypeControl: false,
    scrollwheel: false,
    zoom: 14,
    styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
  });

}

function setSalesMarker(event) {
  console.log('set marker', event)
  if (event.location)
    app.$http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.location + '&key=' + API_KEY).then(response => {
      // Create a marker and set its position.
      if (response.body.results && response.body.results.length > 0) {
        var latLng = response.body.results[0].geometry.location;
        console.log('latLng', latLng)
        var marker = new google.maps.Marker({
          map: map,
          position: latLng,
          title: 'Seuraava myynti: ' + response.body.results[0].formatted_address
        });
        map.setCenter(latLng);
      }

    }, response => {
      console.error('Could not resolve geocode', response)
    });
}
