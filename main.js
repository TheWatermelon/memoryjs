// init canvas
var c=document.getElementById('myCanvas');
c.width=10*64;
c.height=20*64;
var ctx=c.getContext('2d');

// load sprites
var spr=new Image();
var sprReady=false;
spr.onload=function() { sprReady=true; };
spr.src='sprites64.png';

// init cards
var cardFaceDown={x:0, y:0};
var cards=[];
var focusedCard=-1;
var hasCountdown=false;

// Fisher-Yates Shuffle
var shuffle=function(array) {
	var counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		var index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		var temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

var init=function() {
	focusedCard=-1;

	for(var i=0; i<9; i++) {
		cards.push({id:i, show:false});
		cards.push({id:i, show:false});
	}
	shuffle(cards);
}

var reset=function() {}

// match cards based on id
var matchCards=function(index1, index2) {
	if(cards[index1].id !== cards[index2].id) {
		cards[index1].countdown = 50;
		cards[index1].show=false;
		cards[index2].countdown = 50;
		cards[index2].show=false;
		hasCountdown=true;
	}
	focusedCard=-1;
}

// show card clicked
var click=function(event) {
	if(hasCountdown) return;
	var index=Math.floor(event.clientX/64)+Math.floor(event.clientY/64)*6;
	if(index>=cards.length) return;
	//console.log(cards[index]);
	if(!cards[index].show) {
		cards[index].show=true;
		if(focusedCard==-1) focusedCard=index;
		else matchCards(focusedCard, index);
	}
}
c.onclick=click;

// Counter called each interval
var counter=function() {
	cards.forEach(function(item, index, array) {
		if(item.countdown>0) {
			item.countdown--;
			if(item.countdown==0) hasCountdown=false;
		}
	});
}

var update=function(modifier) {}

var render=function() {
	if(sprReady) {
		var offsetX=0;
		var offsetY=0;
		// 
		for(var i=0; i<3; i++) {
			for(var j=0; j<6; j++) {
				var index=i*6+j;
				if(cards[index].show || cards[index].countdown>0) ctx.drawImage(spr, 64, cards[index].id*64, 64, 64, offsetX, offsetY, 64, 64);
				else ctx.drawImage(spr, cardFaceDown.x, cardFaceDown.y, 64, 64, offsetX, offsetY, 64, 64);
			
				offsetX+=64;
			}
			offsetX=0;
			offsetY+=64;
		}
	}
}

// call counter each ms
setInterval(counter, 16);

// The main game loop
var main = function () {
	// run the update function
	update(0.02); // do not change
	// run the render function
	render();
	// Request to do this again ASAP
	requestAnimationFrame(main);
};
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

init();
reset();
main();
