Meteor.methods({
	checkFoursquare: function (query, radius, lat, lng) {
	    if (!Meteor.settings.FOURSQUARE_SECRET || !Meteor.settings.FOURSQUARE_ID) {
	      throw new Meteor.Error('Foursqaure not configured');
	    }

	    if (!this.userId) {
      		throw new Meteor.Error('Permission denied');
    	    }

	    var url = "https://api.foursquare.com/v2/venues/search?ll=" + lat + "," + lng + 
	    "&radius=" + radius + 
	    "&limit=50&query=" + query + 
	    "&client_secret="+ Meteor.settings.FOURSQUARE_SECRET + "&client_id=" + Meteor.settings.FOURSQUARE_ID + "&v=20151214";

	    try { 
	    	result = Meteor.http.call("GET", url);
	    } catch(error) {
	    	throw new Meteor.Error('Foursquare api call failed');
	    }

	    // save query in db
	    Queries.insert({
	      userId: this.userId,
	      query: query,
	      radius: radius,
	      lat: lat,
	      lng: lng,	
	      createdAt : new Date().toString()     
	    });

	    return result.data.response.venues;
	},

	removeAllQueries: function() {
        return Queries.remove({});
    }
});
