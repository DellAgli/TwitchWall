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
    if(streams.length!==1) //if only one left, dont' remove
      streams.splice(rIndex, 1)
  }
  return results
};

makeUrl = function(title){
  return "http://player.twitch.tv/?channel=" + title;
};

fillStreamWindows = function(random){
  let featuredStreams = []
  let currentLive = checkStreams(Options.streamsList);
  if(currentLive.length === 0){
    alert("Nobody is live. Add some more channels!")
  }
  else{
    if(random == 0){
      featuredStreams = largestStreams(currentLive, Options.numberStreams);
    }
    else{
      featuredStreams = randomStreams(currentLive, Options.numberStreams);
    }

    if(Options.players[0]){
      for(i=0; i<featuredStreams.length;i++){
        Options.players[i].setChannel(featuredStreams[i]);
      }
    }
    else{
      for(i=0; i<featuredStreams.length;i++){
        var options = {
          height:'100%',
          width:'100%',
          volume: 0,
          quality:Options.quality,
          channel: featuredStreams[i]    
        };
        var player = new Twitch.Player("stream" + Options.numberStreams + i, options);
        if(Options.sound0&&i===0){
          player.setVolume(1);
        }
        Options.players[i]= player;
      }
    }

    if(Options.showChat){
      editChat(featuredStreams[0])
    }
  }
  
};

capitalizeFirst = function(s){
  return s.charAt(0).toUpperCase() + s.slice(1)
}//function for quality select

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
  $('#quality-select option[selected]').text("Select Stream Quality: " + capitalizeFirst(Options.quality))
  $('select').material_select();
}

importFollows = function(url){
  $.ajax({
    type: "GET",
    url: url,
    async: true,
    success : function(r) {
      if(r.follows.length>0){
        for(i=0;i<r.follows.length;i++){
          if(Options.streamsList.indexOf(r.follows[i].channel.display_name) === -1)
            Options.streamsList.push(r.follows[i].channel.display_name);
        }
        if(r._links.next)
          importFollows(r._links.next)
      }
    }
  });

  Cookie.set('streams', Options.streamsList);
  generateSelect();
}

editChat = function(channel){
  if(channel){
    $('#chat-frame').attr('src', 'http://www.twitch.tv/' + channel + '/chat');
    $('#chat-div').toggleClass('hidden', false);
    $('#streams-div').toggleClass('s9', true);
    $('#streams-div').toggleClass('s12',false);
    $('.fixed-action-btn').css('bottom', '145px')
  }
  else{
    $('#chat-div').toggleClass('hidden', true);
    $('#streams-div').toggleClass('s9', false);
    $('#streams-div').toggleClass('s12',true );
    $('.fixed-action-btn').css('bottom', '45px')

  }
}
