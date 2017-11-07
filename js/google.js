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
    styles: [{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"weight":1}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"weight":0.8}]},{"featureType":"landscape","stylers":[{"color":"#ffffff"}]},{"featureType":"water","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"elementType":"labels","stylers":[{"visibility":"off"}]},{"elementType":"labels.text","stylers":[{"visibility":"on"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#000000"}]},{"elementType":"labels.icon","stylers":[{"visibility":"on"}]}]
  });

}

function setSalesMarker(event) {
  if (event.location)
    app.$http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.location + '&key=' + API_KEY).then(function(response) {
      // Create a marker and set its position.
      if (response.body.results && response.body.results.length > 0) {
        var latLng = response.body.results[0].geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: latLng,
          title: 'Seuraava myynti: ' + response.body.results[0].formatted_address,
          icon: './assets/map_needle.svg'
        });
        map.setCenter(latLng);
      }

    }, function(response) {
      console.error('Could not resolve geocode', response)
    });
}
