clickRefresh = function(){
  fillStreamWindows();
}

clickAddStream = function(){
  if($('#new-stream').val().substring(0,7) === "import:"){
    importFollows($('#new-stream').val().split(':')[1])
  }
  else{
    if(Options.streamsList.indexOf($('#new-stream').val()) === -1){
      Options.streamsList.push($('#new-stream').val());
      Cookie.set('streams', Options.streamsList);
      generateSelect();
   }
  }
	
	$('#new-stream').val('')
 
}

clickRemoveStream= function(){
  let string = $('#edit-stream-select').find(':selected').text();
  Options.streamsList.splice(Options.streamsList.indexOf(string), 1);
  Cookie.set('streams', Options.streamsList);
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
    Options.autoRefresh = setInterval(fillStreamWindows, 300000);
  }
  else{
    window.clearInterval(Options.AutoRefesh);
    Options.AutoRefesh = null
 
  }
}

changeQuality = function(){
  console.log($('#quality-select option:selected').attr('setting'))
  Options.quality = $('#quality-select option:selected').attr('setting');
  Cookie.set('quality', $('#quality-select option:selected').attr('setting'))
 }

 clickClearStreams = function(){
  if(confirm("Are you sure you want to clear all the streams?")){
     Options.streamsList = [];
      Cookie.streams = [];
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

 changeNumberStreams = function(){
  Options.numberStreams = $('#quality-select option:selected').attr('setting');
  Cookie.set('numberStreams', $('#quality-select option:selected').attr('setting'))
 }

changeChat = function(){
   if($('#chat-toggle').is(':checked')){
    Options.showChat = 1;
    Cookie.set('chat', 1)
  }
  else{
    Options.showChat = 0;
    Cookie.set('chat', 0)
  }
}