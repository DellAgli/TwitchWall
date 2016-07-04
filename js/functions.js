/**********************\
  Basic Functionality
  \**********************/

  refreshStreams = function(titles, method){
    let results = []
    let calls = titles.length
    for(i=0;i<titles.length;i++){
      let p = titles[i].priority;
      $.ajax({
        type: "GET",
        url: "https://api.twitch.tv/kraken/streams/" + titles[i].name,
        async: true,
        success : function(r) {
          calls--;
          if(r.stream){
            results.push({
              name: r.stream.channel.name,
              viewers : r.stream.viewers,
              priority : p
            });
          }
          if(calls===0){
            if(results.length === 0){
              alert("Nobody is live. Add some more channels!")
            }
            else{
              fillStreamWindows(method(results, 6))
            }
          }
        }
      });
    }
  };

  largestStreams = function(streams, n){
    let lists = splitByPriority(streams);
    let results = [];
    let p = 1;
    for(i=0;i<n;i++){
      let largest = 0;
      if(lists[1].length > 0)
        p = 1;
      else
        p=0;

      if(lists[0].length || lists[1].length){
        for(j=0;j<lists[p].length;j++){
          if(lists[p][j].viewers>lists[p][largest].viewers)
            largest = j;
        }
        results.push(lists[p][largest].name);
        lists[p].splice(largest, 1)
      }
      else{ //if we run out, reuse the current results
        let rIndex = Math.floor(Math.random()*results.length);
        results.push(results[rIndex]);
      }

      
    }
    return results
  };

  randomStreams = function(streams, n){
    let lists = splitByPriority(streams);
    let results = [];
    let p = 1;
    for(i=0;i<n;i++){
      if(lists[1].length >0)
        p=1;
      else
        p=0;
      if(lists[0].length || lists[1].length){
        let rIndex = Math.floor(Math.random()*lists[p].length);
        results.push(lists[p][rIndex].name);
        lists[p].splice(rIndex,1)
      }
      else{ //if we run out, reuse the current results
        let rIndex = Math.floor(Math.random()*results.length);
        results.push(results[rIndex]);
      }
    }
    return results
  };

  fillStreamWindows = function(featuredStreams){
    Options.playingChannels = featuredStreams
    console.log(featuredStreams)
    window.location = '#'+ featuredStreams.slice(0, Options.layout.numStreams).join() + ',layout-' + Options.layout.index
    for(i=0; i<Options.layout.numStreams;i++){
      if(Options.players[i]){
        if(Options.players[i].getChannel().toLowerCase() !== featuredStreams[i].toLowerCase())
            Options.players[i].setChannel(featuredStreams[i])
      }
      else{
        var options = {
          height:'100%',
          width:'100%',
          volume: 0,
          quality:Options.quality,
          channel: featuredStreams[i]    
        }
        var player = new Twitch.Player("stream" + i, options);
        if(Options.sound0&&i===0){
          player.setVolume(1);
        }
        else{
          player.setVolume(0);
        }
        player.play();
        Options.players[i]= player;
      }
      
    }
    if(Options.layout.chat){
      editChat(featuredStreams[0])
    }
    for(i=Options.layout.numStreams; i<6;i++){
      if(Options.players[i]){
        Options.players[i].pause()
      }
    }
  }

/**************************\
  Additional Functionality
  \**************************/

  importFollows = function(url){
    $.ajax({
      type: "GET",
      url: url,
      async: true,
      success : function(r) {
        if(r.follows.length>0){
          for(i=0;i<r.follows.length;i++){
            if(Options.streamsList.indexOfObject('name',r.follows[i].channel.display_name) === -1)
              Options.streamsList.push({
                name: r.follows[i].channel.display_name,
                priority : 0
              })
          }
          if(r._links.next)
            importFollows(r._links.next)
          saveStreams();
          generateSelect();

        }
      }
    });
  }

  startupFill = function(list, layout){
    let n = list.length
    $('.welcome-div').toggleClass('hidden', true);
    $('#main-container').toggleClass('hidden', false)
    Options.justStarted = false;
    if(layout){
      clickLayout(layout)
    }
    else{
      if(Options.layout.numStreams !== n){
       switch(n){
        case 1:
        clickLayout(0)
        break;
        case 2:
        clickLayout(2)
        break;
        case 3:
        clickLayout(5)
        break;
        case 4:
        clickLayout(8)
        break;
        case 5:
        clickLayout(11)
        break;
        case 6:
        clickLayout(13)
        break;
      }
    }

    }
    
    fillStreamWindows(list)
  }

  addBatch = function(list){
    let llist = list
    for(i=0;i<llist.length;i++){
      if(indexOfStream(llist[i] === -1)){
        Options.streamsList.push({
          name: llist[i],
          priority: 0
        })
      }
    }
  }

  setPriority = function(name, value){
    Options.streamsList[indexOfStream(name)].priority = value
  }



/*****************\
  General Helpers
  \*****************/

  capitalizeFirst = function(s){
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
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
      element.textContent = streams[i].name;
      element.value = streams[i].name;
      select.appendChild(element);
    }
    $('#quality-select option[selected]').text("Select Stream Quality: " + capitalizeFirst(Options.quality))
    $('select').material_select();
  }

  editChat = function(channel){
    let url ='http://www.twitch.tv/' + channel + '/chat'
    if(channel && $('#chat-frame').attr('src') !== url){
      $('#chat-frame').attr('src', url);
    }
  }

  pauseAll = function(){
    for(i=0;i<Options.players.length;i++){
      if(Options.players[i])
        Options.players[i].pause();
    }
  }

  destroyPlayers = function(){
    for(i=0;i<Options.players.length;i++){
      if(Options.players[i])
        Options.players[i].destroy(); 
      Options.players[i] = null
    }
  }


  indexOfStream = function(name){
    let index = -1
    for(i=0;i<Options.streamsList.length;i++){
      if(Options.streamsList[i].name === name){
        index = i;
        break
      }
    }
    return index;
  }



  splitByPriority = function(list){
    let p0 = [];
    let p1 = [];
    for(i=0;i<list.length;i++){
      if(list[i].priority === 1)
        p1.push(list[i]);
      else
        p0.push(list[i]);
    }
    return [p0,p1]
  }

  saveStreams = function(){
    let strArray = [];
    for(i=0;i<Options.streamsList.length;i++){
      let str = Options.streamsList[i].priority +
      Options.streamsList[i].name;
      strArray.push(str)
    }
    Cookie.set('streams', strArray)
  }

  loadStreams = function(){
    let strArray = Cookie.get('streams').split(',');
    for(i=0;i<strArray.length;i++){
      Options.streamsList.push({
        name: strArray[i].slice(1),
        priority:parseInt(strArray[i].slice(0,1))
      })
    }
  }

  setQualities = function(level){
    for(i=0;i<Options.players.length;i++){
      if(Options.players[i]){
        console.log(level)
        Options.players[i].setQuality(level)
      }
    }
  }

  Array.prototype.indexOfObject = function arrayObjectIndexOf(property, value) {
    for (var i = 0, len = this.length; i < len; i++) {
      if (this[i][property].toLowerCase() === value.toLowerCase()) return i;
    }
    return -1;
  }
