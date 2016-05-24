checkStreams = function(titles){
  let results = []
  for(i=0;i<titles.length;i++){
    $.ajax({
        type: "GET",
        url: "https://api.twitch.tv/kraken/streams/" + titles[i],
        async: false,
        success : function(r) {
          if(r.stream){
            results.push({
              name: r.stream.channel.name,
              viewers : r.stream.viewers
            });
            //console.log(results);
          }
        }
    });
  }
  return results;
};

largestStreams = function(streams, n){
  let results = [];
  for(i=0;i<n;i++){
    let largest = 0;
    for(j=1;j<streams.length;j++){
      if(streams[largest].viewers<streams[j].viewers){
        largest = j;
      }
    }
    results.push(streams[largest].name);
    streams[largest].viewers = -1;
  }
  return results
};

makeUrl = function(title){
  return "http://player.twitch.tv/?channel=" + title;
};

fillStreamWindows = function(){
  let topStreams = largestStreams(checkStreams(streamsList), 4);
  for(i=0; i<topStreams.length;i++){
    $('#stream'+i).attr('src', makeUrl(topStreams[i]));
  }
};


generateSelect = function(){
  let streams = streamsList;
  let select = document.getElementById('edit-stream-select');
  select.innerHTML ='';
  let start = document.createElement('option')
  start.disabled = true;
  start.selected = true;
  start.textContent = "Choose a Stream";
  select.appendChild(start);

  for(i=0;i<streams.length;i++){
    let element = document.createElement('option');
    element.textContent = streams[i];
    element.value = streams[i];
    select.appendChild(element);
  }
  $('select').material_select();
}
