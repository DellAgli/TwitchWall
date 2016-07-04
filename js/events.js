clickRefresh = function(){
  if(Options.justStarted){
    $('.welcome-div').toggleClass('hidden', true);
    $('#main-container').toggleClass('hidden', false)
    Options.justStarted = false;
  }

  

  if(Options.randomMode === 1){
    refreshStreams(Options.streamsList, randomStreams);
  }
  else{
    refreshStreams(Options.streamsList, largestStreams);
  }
}

clickAddStream = function(){
  if($('#new-stream').val().substring(0,7) === "import:"){
    let url = "https://api.twitch.tv/kraken/users/" + $('#new-stream').val().split(':')[1] + "/follows/channels"
    importFollows(url)
  }
  else{
    if(Options.streamsList.indexOfObject('name',$('#new-stream').val()) === -1)
        Options.streamsList.unshift({
                name: $('#new-stream').val(),
                priority : 0
              })
           }
  
  $('#new-stream').val('');
  saveStreams();
  generateSelect();
}

clickRemoveStream= function(){
  let string = $('#edit-stream-select').find(':selected').text();
  Options.streamsList.splice(indexOfStream(string), 1);
  saveStreams();
  generateSelect();
}

changeSound = function(){
  if($('#sound0').is(':checked')){
    Options.sound0 = 1;
    Cookie.set('sound0', 1)
    if(Options.players[0])
      Options.players[0].setVolume(1)
  }
  else{
    Options.sound0 = 0;
    Cookie.set('sound0', 0)
    if(Options.players[0])
      Options.players[0].setVolume(0)
  }
}

changeAutoRefresh = function(){
  if($('#auto-refresh').is(':checked')){
    Options.autoRefresh = setInterval(clickRefresh, 300000);
  }
  else{
    window.clearInterval(Options.AutoRefesh);
    Options.AutoRefesh = null
  }
}

changeQuality = function(){
  Options.quality = $('#quality-select option:selected').attr('setting');
  Cookie.set('quality', $('#quality-select option:selected').attr('setting'));
  setQualities(Options.quality)
}

clickClearStreams = function(){
  if(confirm("Are you sure you want to clear all the streams?")){
   Options.streamsList = [];
   saveStreams()
   generateSelect();
 }
}

changeRandomMode = function(){
  if($('#random-mode').is(':checked')){
    Options.randomMode = 1;
    Cookie.set('random', 1)
  }
  else{
    Options.randomMode = 0;
    Cookie.set('random', 0)
  }
}

changePriority = function(){
  if($('#priority-select').is(':checked')){
    setPriority($('#edit-stream-select').find(':selected').text(),1)
  }
  else{
    setPriority($('#edit-stream-select').find(':selected').text(),0)
  }
  saveStreams();
}

loadStreamPriority = function(){
  let value = $('#edit-stream-select').find(':selected').text();
  let index = indexOfStream(value);
  let priority = Options.streamsList[index].priority;
  if(priority === 1){
    $('#priority-select').prop('checked', true)
  }
  else{
    $('#priority-select').prop('checked', false)
  }
}

showMoreInstructions = function(){
  console.log("Of Course you are.")
  $('#more-instructions').toggleClass('hidden', false)
  $('#show-more-button').toggleClass('hidden', true)
}

clickLayout = function(n){
  Cookie.set('layout', n)
  for(i=0;i<LAYOUTS.length;i++){
    if(i==n){
      $('#layout-preview-'+i).toggleClass('active-preview', true);
      Options.layout = LAYOUTS[i];
    }
    else
      $('#layout-preview-'+i).toggleClass('active-preview', false);
  }

  for(i=0;i<LAYOUTS.length;i++){
    if(i===Options.layout.index)
      $('#main-container').toggleClass('layout-'+i, true);
    else
      $('#main-container').toggleClass('layout-'+i, false);
  }
  for(i=0;i<Options.layout.numStreams;i++){
    if(Options.players[i])
      Options.players[i].play();
  }
  for(i=Options.layout.numStreams;i<6;i++){
    if(Options.players[i])
      Options.players[i].pause();
  }


  if(!Options.justStarted)
    fillStreamWindows(Options.playingChannels)
  } 

  clickHideButton = function(){
    if(!Options.justStarted){
      Materialize.toast('Press ESCAPE to show the button', 6000)
      $('#main-button').toggleClass('hidden', true);
      document.addEventListener("keydown", function(event) {
        if(event.which === 27)
          $('#main-button').toggleClass('hidden', false);
      }); 
    }
    else{
      Materialize.toast('Start watching before you hide the button', 6000)

    }

  }