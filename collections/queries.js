Queries = new Meteor.Collection('queries');

Queries.allow({
  // allow delete if user is owner of doc
  remove: function (userId, doc) {
    return doc.userId === userId;
  },
});

// subscribe
if (Meteor.isClient) {

  Meteor.startup(function() {
    Meteor.subscribe('queries');
  });
}

// publication
if (Meteor.isServer) {

  Meteor.publish('queries', function() {
    var userId = this.userId,
        query = {
          userId: userId
        },
        options = {
          sort: {
            createdAt: -1
          },
          limit: 5
        };

    return Queries.find(query, options);
  });
}