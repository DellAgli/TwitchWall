$(document).ready(function(){
  //MaterializeCSS initialize
    $('.modal-trigger').leanModal();

    let list = Cookie.get('streams');
    if(list)
        streamsList = list.split(",");    
    else
        streamsList = [];

    
    generateSelect();


    
    players = [null,null,null,null];
 });
