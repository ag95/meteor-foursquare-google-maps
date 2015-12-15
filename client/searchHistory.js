Template.searchHistory.helpers({
  queries: function() {
    return Queries.find({}, {sort: {createdAt: -1}});
  },

  haveQueries: function() {
    return Queries.find().count();
  }
});

Template.searchHistory.helpers({
  toFixed: function(num, digits) {
    return Number(num).toFixed(digits);
  },

  radiusKm: function() {
    var radius = Number(this.radius) / 1000;
    return radius.toFixed(1);
  }
});

Template.searchHistory.events({
  'click [data-action="remove"]': function(e, template) {
    var query = this.query,
        queryId = this._id;

    if (confirm('Are you sure you want to delete "' + query + '" ?')) {
      Queries.remove(queryId);
    }
  },

  'click [data-action="remove-all"]': function(e, template) {
    if (confirm('Are you sure you want to delete all queries ?')) {
      Meteor.call('removeAllQueries');
    }
  }
});