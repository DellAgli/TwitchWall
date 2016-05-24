clickRefresh = function(){
  fillStreamWindows();
}

clickAddStream = function(){
	if(streamsList.indexOf($('#new-stream').val()) === -1){
		streamsList.push($('#new-stream').val());
    Cookie.set('streams', streamsList);
  	generateSelect();
	}
	$('#new-stream').val('')
 
}

clickRemoveStream= function(){
  let string = $('#edit-stream-select').find(':selected').text();
  streamsList.splice(streamsList.indexOf(string), 1);
  Cookie.set('streams', streamsList);
  generateSelect();
}
