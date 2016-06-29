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
    

    //if(document.location.hash){
     //   let list = document.location.hash.slice(1).split(',');
      //  startupFill(list.length, list);
    //}

    generateSelect();

    for(i=0;i<LAYOUTS.length;i++){
        let div = document.createElement('div');
        let a = document.createElement('a');
        let div2 = document.createElement('div');
        div2.setAttribute('class', 'layout-preview layout layout-'+i );
        div2.setAttribute('id', "layout-preview-" + i)
        let s1 = document.createElement('div')
        s1.setAttribute('class', "stream-player major")
        s1.innerHTML = '1'
        let s2 = document.createElement('div')
        s2.setAttribute('class', "stream-player minor")
        s2.innerHTML = '2'
        let s3 = document.createElement('div')
        s3.setAttribute('class', "stream-player minor")
        s3.innerHTML = '3'
        let s4 = document.createElement('div')
        s4.setAttribute('class', "stream-player minor")
        s4.innerHTML = '4'
        let s5 = document.createElement('div')
        s5.setAttribute('class', "stream-player minor")
        s5.innerHTML = '5'
        let s6 = document.createElement('div')
        s6.setAttribute('class', "stream-player minor")
        s6.innerHTML = '6'
        let c1 = document.createElement('div')
        c1.innerHTML = 'C'
        c1.setAttribute('class', "chat-box");
        div2.appendChild(s1);
        div2.appendChild(s2);
        div2.appendChild(s3);
        div2.appendChild(s4);
        div2.appendChild(s5);
        div2.appendChild(s6);
        div2.appendChild(c1);
        a.appendChild(div2);
        a.setAttribute('onClick','clickLayout('+i+')');
        div.appendChild(a);
        document.getElementById('layout-selection').appendChild(div)
    }

    $("#layout-selection").owlCarousel({
        items:4,
        responsiveBaseWidth: $('#setup-modal')

    });

 });
