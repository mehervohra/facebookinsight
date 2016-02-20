/* testing indico functions */

var data = document.getElementById("in").val();

// single example
$.post(
  'https://apiv2.indico.io/sentiment?key=680e518e7ad121cdecba4a3a56d1bfe7',
  JSON.stringify(data)
).then(function(res) { console.log(res) });

document.getElementById("result").innerHTML(res);
