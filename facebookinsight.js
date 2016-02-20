if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  function myFunction() {
      document.getElementById("frm1").submit();
  }

    Template.hello.events({
    'new-task': function () {
      // increment the counter when button is clicked
      // batch example
      $.post(
        'https://apiv2.indico.io/texttags/batch?key=39df039014643b8d9d6ccbbb73e5810c',
        JSON.stringify({
          'data': [
            "raw input"
          ]
        })
      ).then(function(res) {window.alert(res) });
      }
        })
    }


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
