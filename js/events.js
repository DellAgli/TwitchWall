clickRefresh = function(){
  fillStreamWindows();
}

clickAddStream = function(){
  STREAMS.push($('#new-stream').val());
  generateSelect();
}

clickRemoveStream= function(){
  let string = $('#edit-stream-select').find(':selected').text();
  STREAMS.splice(STREAMS.indexOf(string), 1);
  generateSelect();
}
