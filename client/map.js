Meteor.startup(function() {
  GoogleMaps.load();
});

Template.map.helpers({  
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(35.652832, 139.839478),
        zoom: 11
      };
    }
  }  
});

var allMarkers = [];

Template.map.events({
  // search query form
  'submit form': function(e, template) {
    e.preventDefault();
      var query = template.find('input').value,
        map = GoogleMaps.maps.map.instance,
        center = map.getCenter(),
        bounds = map.getBounds(),
        ne = bounds.getNorthEast(),
        lat1 = center.lat(),
        lng1 = center.lng(),
        lat2 = ne.lat(),
        lng2 = ne.lng(),
        //calculations for radius 
        R = 6378137; // Earth’s mean radius in meter
        dLat = (lat2 - lat1) * Math.PI / 180,
        dLong = (lng2 - lng1) * Math.PI / 180,
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLong / 2) * Math.sin(dLong / 2),
        radius = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
      if (query.length > 0) {
        $('.venues-results').fadeIn();
        Meteor.call("checkFoursquare", query, radius, lat1, lng1, function(error, venues) {  
          if (error) {
            console.log(error);
          } else {

            //remove old markers
            for (var i = 0; i < allMarkers.length; i++) {
              allMarkers[i].setMap(null);
            }

            if (venues.length > 0) {
              _.each(venues, function(venue) {
                var marker = new google.maps.Marker({
                  position: {lat:venue.location.lat, lng: venue.location.lng},
                  map: map.instance,
                  title: venue.name
                });
                allMarkers.push(marker);
                marker.setMap(map);
              });
              Session.set('venues', venues);
            } else {
                 $('.venues-results').fadeOut();
                sAlert.error('No results found ', {effect: 'jelly', position: 'top-right'});
            }
          }
        });
      } else {
        sAlert.error('Please, enter your query', {effect: 'jelly', position: 'top-right'});
      }
  }
});
