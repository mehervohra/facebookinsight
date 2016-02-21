function displayResults(data){
  var sentV = data.sentimenthq;
  var sortedPers = data.personality;
  var count = 0;
  var text = "Your sentiment on Facebook is " + (data.sentiment*100) + "% positive. How interesting!"
  
  for traits in sortedPers{
    text+=" Your #" + (count+1) + " highest personality trait is " + traits + " which is " + (data[traits] * 100) "%.";
  }
  
  $("#results").html(text);
  $("section").animate({"width": 500px}, 400);
  console.log(text);
  
}
