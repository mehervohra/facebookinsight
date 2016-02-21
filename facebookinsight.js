if (Meteor.isClient) {
  var fbAccessToken = undefined;

  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
      fbAccessToken = response.authResponse.accessToken;
      testAPI();
    } else if (response.status === 'not_authorized') {
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1648899562040592',
    cookie     : true,  // enable cookies to allow the server to access
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.5' // use graph api version 2.5
  });

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the Facebook SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }

  function getPosts() {
    FB.api('/me/posts', function(response) {
      var messageContent = parseMessages(response);
      console.log('Message Content: ' + messageContent);
      callIndico(messageContent);
    });
  }

  function parseMessages(response) {
    var content = '';
    for (postIdx in response.data) {
      post = response.data[postIdx];
      if (post.message) {
        content += ' ' + post.message;
      }
    }
    return content;
  }

  function callIndico(content) {
    $.post(
      'https://apiv2.indico.io/texttags/batch?key=39df039014643b8d9d6ccbbb73e5810c',
      JSON.stringify({
        'data': [
          JSON.stringify(content)
        ]
      })
    ).then(function(res) {
      var sortedResults = sortResults(JSON.parse(res));
      console.log('Sorted Results: ' + JSON.stringify(sortedResults));
      // TODO display the sorted results to the webpage!
    });
  }

  function sortResults(results) {
    var actualResults = results.results[0];
    var sortable = [];

    for (var keyword in actualResults) {
      sortable.push([keyword, actualResults[keyword]]);
    }

    return sortable.sort(function(a, b) {
      return b[1] - a[1]
    });
  }

  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.body.events({
    'submit .new-task': function (event) {
      event.preventDefault();
      getPosts();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
