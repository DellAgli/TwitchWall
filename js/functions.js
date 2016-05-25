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

randomStreams = function(streams, n){
  let results = [];
  for(i=0;i<n;i++){
    let rIndex = Math.floor(Math.random()*streams.length);
    results.push(streams[rIndex].name);
    streams.splice(rIndex, 1)
  }
  console.log(results)
  return results
};

makeUrl = function(title){
  return "http://player.twitch.tv/?channel=" + title;
};

fillStreamWindows = function(random){
  let featuredStreams = []
  if(random == 0){
    featuredStreams = largestStreams(checkStreams(Options.streamsList), Options.numberStreams);
  }
  else{
    featuredStreams = randomStreams(checkStreams(Options.streamsList), Options.numberStreams);
  }
  for(i=0; i<featuredStreams.length;i++){
    var options = {
        height:'100%',
        width:'100%',
        quality:Options.quality,
        channel: featuredStreams[i]    
        };

      var player = new Twitch.Player("stream"+i, options);
      if(i == 0 & Options.sound0 == 1){
        player.setVolume(1);
      }
      Options.players[i]= player;
    }
};


generateSelect = function(){
  let streams = Options.streamsList;
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

importFollows = function(channel){
  $.ajax({
        type: "GET",
        url: "https://api.twitch.tv/kraken/users/" + channel + "/follows/channels",
        async: true,
        success : function(r) {
          if(r.follows){
            for(i=0;i<r.follows.length;i++){
              if(Options.streamsList.indexOf(r.follows[i].channel.display_name) === -1)
                Options.streamsList.push(r.follows[i].channel.display_name);
            }
            Cookie.set('streams', Options.streamsList);
            generateSelect();
            };
          }
    });
}
