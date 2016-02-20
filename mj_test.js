/* testing indico functions */



// single example

$('button').click(display);
  
function display(){
  var data = $("in").val();
  $.post(
  'https://apiv2.indico.io/sentiment?key=680e518e7ad121cdecba4a3a56d1bfe7',
  JSON.stringify(data)
).then(function(res) { console.log(res) });
  $('result').html(res);
}
