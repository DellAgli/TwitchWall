clickRefresh = function(){
  if(Options.justStarted){
    $('.stream-div').empty();
    Options.justStarted = false;
  }
  let oldNumberStreams = Options.currentNumberStreams; 
  if(Options.numberStreams === 1){
    $('#single').toggleClass('hidden', false)
    $('#multiple').toggleClass('hidden', true)
    Options.currentNumberStreams = 1;
  }
  else{
    $('#single').toggleClass('hidden', true)
    $('#multiple').toggleClass('hidden', false)
    Options.currentNumberStreams = 4;
  }

  if(Options.currentNumberStreams !== oldNumberStreams){
    destroyPlayers();
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
    if(indexOfStream($('#new-stream').val()) === -1){
      Options.streamsList.push({
        name: $('#new-stream').val(),
        priority: 0
      });

    }
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

changeChat = function(){
  if($('#chat-toggle').is(':checked')){
    Options.showChat = 1;
    Cookie.set('chat', 1)
    if(Options.players[0].getChannel())
      editChat(Options.players[0].getChannel())
  }
  else{
    Options.showChat = 0;
    Cookie.set('chat', 0)
    editChat(null);
  }
}

changeNumStreams = function(){
  if($('#number-streams').is(':checked')){
    Options.numberStreams = 1;
    Cookie.set('numStreams', 1)
  }
  else{
    Options.numberStreams = 4;
    Cookie.set('numStreams', 4)
  }
  for(i-0;i<Options.players.length;i++){
    Options.players[i].pause()
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

clickLayout= function(n){
  for(i=0;i<LAYOUTS.length;i++){
    if(i==n){
      $('#layout'+i).toggleClass('layout-active', true);
      Options.layout = LAYOUTS[i];
    }
    else
      $('#layout'+i).toggleClass('layout-active', false);
  }
}

