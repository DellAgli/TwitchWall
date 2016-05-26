Options = {
	streamsList: [],
	players: [], 
	quality : 'medium',
	sound0 : 1,
	autoRefresh : null,
	randomMode : 0,
	numberStreams: 4,
	showChat: 0,
}


$(document).ready(function(){
    $('.modal-trigger').leanModal();
    let list = Cookie.get('streams');
    if(list)
        Options.streamsList = list.split(",");    
    else
        Options.streamsList = [];
    let quality = Cookie.get('quality');
    if(quality)
    	Options.quality= quality;
	let numberStreams = Cookie.get('numberStreams');
    if(numberStreams)
    	Options.numberStreams= parseInt(numberStreams);

    let sound0 = Cookie.get('sound0');
    if(sound0)
    	Options.sound0 = parseInt(sound0);
    
    if(Options.sound0 === 1){
    	$('#sound0').attr('checked', true);
    }
    let random = Cookie.get('random');
    if(random)
    	Options.randomMode = parseInt(random);
    if(Options.randomMode === 1){
    	$('#random-mode').attr('checked', true);
    }
    let chat = Cookie.get('chat');
    if(chat)
    	Options.showChat = parseInt(chat);
    if(Options.showChat === 1){
    	$('#chat-toggle').attr('checked', true);
    }
     $('.tooltipped').tooltip({delay: 50});
    generateSelect();

 });
