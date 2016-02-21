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
    appId      : '1957057311186486', // unique key for each app
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


  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      getPosts();
//      console.log('Thanks for logging in, ' + response.name + '!'); 
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
    console.log('array len: ' + response.data.length);
    var count = 0;
      
//    while (count < 20) {  
        for (postIdx in response.data) {
          post = response.data[postIdx];
          if (post.message) {
            content += ' ' + post.message.replace(/(\r\n|\n|\r)/gm, ' ');
//            count++;
          }
        }
//        console.log(response.paging.next);
//    }
      
    return content;
  }

    // returns data on sentiment and personality
  function callIndico(content) {
    $.post(
        'https://apiv2.indico.io/apis/multiapi/batch?key=680e518e7ad121cdecba4a3a56d1bfe7&apis=sentimenthq,personality',
      JSON.stringify({
        'data': [
          JSON.stringify(content)
        ]
      })
    ).then(function(res) {
        console.log(res);
      var formatted = formatResults(JSON.parse(res));
//        console.log(sortedResults);
        console.log('Formatted Results: ' + JSON.stringify(formatted));
      // TODO display the sorted results to the webpage!
        
       var sorted =  sortResults(JSON.parse(formatted));
        console.log(JSON.stringify(sorted));
    });
  }

    // returns data in easier to access format
    function formatResults(results) {
        console.log(results);
        sentiment = results.results.sentimenthq.results[0]; // type number
        personality = results.results.personality.results[0]; // type Object

        var formatted = {}

        for (var keyword in results.results) {
            formatted[keyword] = results.results[keyword].results[0];
        }
        return formatted;
    }
    
    // sorts 
    function sortResults(results) {
        var sorted = {};
        
        for (item in results) {
            
        }
        
        
    }
    
    /*// counter starts at 0
  Session.setDefault('counter', 0);*/

  /*Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });*/

  Template.body.events({
    'submit .new-task': function (event) {
      event.preventDefault();
      getPosts(); // TODO automate this!!
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
