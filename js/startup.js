Options = {
	streamsList: [],
	players: [], 
	quality : 'medium',
	sound0 : 1,
	autoRefresh : null,
	randomMode : 0,
	numberStreams: 4,
	showChat: 0,
    justStarted: true,
    currentNumberStreams : 0
}


$(document).ready(function(){
    $('.modal-trigger').leanModal();
    let list = Cookie.get('streams');
    if(list)
        loadStreams();   
    else
        Options.streamsList = [];
    let quality = Cookie.get('quality');
    if(quality)
    	Options.quality= quality;
	let numberStreams = Cookie.get('numStreams');
    if(numberStreams)
    	Options.numberStreams= parseInt(numberStreams);
    if(Options.numberStreams === 1){
        $('#number-streams').attr('checked', true);
    }
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
    

    if(document.location.hash){
        let list = document.location.hash.slice(1).split(',');
        startupFill(list.length, list);
    }

    generateSelect();
 });

TestStreams = [
    {
    name: "",
    priority : 0
    },
    {
    name: "",
    priority : 0
    },
    {
    name: "",
    priority : 0
    },
    {
    name: "",
    priority : 0
    },
    {
    name: "",
    priority : 0
    },
    {
    name: "",
    priority : 0
    },
    {
    name: "",
    priority : 0
    },
]