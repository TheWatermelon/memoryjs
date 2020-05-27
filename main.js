// init canvas
var c=document.getElementById('myCanvas');
var ctx=c.getContext('2d');

// load sprites
var spr=new Image();
var sprReady=false;
spr.onload=function() { sprReady=true; };
spr.src='sprites64.png';

// init cards
var cards;
var cardFaceDown={x:0, y:0};
var focusedCard=-1;
var hasCountdown=false;

// misc
var level=1;
var changeLevel=function(lvl) { init(lvl); }
var clicks=0;

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

var init=function(lvl) {
	level=lvl;
	c.width=6*64;
	c.height=level*3*64;

	clicks=0;

	focusedCard=-1;

	cards=[];
	for(var i=0; i<9*level; i++) {
		cards.push({id:i, show:false});
		cards.push({id:i, show:false});
	}
	shuffle(cards);

	// set level chooser
	if(document.getElementById('level')!==null) document.getElementById('level').remove();
	var p=document.createElement("p");
	p.setAttribute('id', 'level');
	document.body.appendChild(p);
	var txt=document.createTextNode("Level ");
	p.appendChild(txt);
	for(var i=1; i<9; i++) {
		if(i==level) {
			var lvl=document.createElement("span");
			var txt=document.createTextNode(i);
			lvl.appendChild(txt);
			lvl.style.fontWeight="bold";
		} else {
			var lvl=document.createElement("a");
			lvl.setAttribute("href", "#");
			var txt=document.createTextNode(i);
			lvl.appendChild(txt);
			const l=i;
			lvl.addEventListener('click', function() { changeLevel(l); });
		}
		p.appendChild(lvl);
		p.appendChild(document.createTextNode(' '));
	}

	// clicks
	if(document.getElementById('clicks')!==null) document.getElementById('clicks').remove();
	var cl = document.createElement("p");
	cl.setAttribute("id", "clicks");
	document.body.appendChild(cl);
	cl.appendChild(document.createTextNode("Clicks: "+clicks));
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

var checkWin=function() {
	cards.forEach(function(item, index, array) {
		if(!item.show) return false;
	});
	return true;
}

// show card clicked
var click=function(event) {
	if(hasCountdown) return;
	var offsetX=(document.body.clientWidth-6*64)/2;
	var index=Math.floor((event.clientX-offsetX)/64)+Math.floor(event.clientY/64)*6;
	if(index>=cards.length) return;
	console.log(document.body.scrollTop);
	if(!cards[index].show) {
		cards[index].show=true;
		if(focusedCard==-1) focusedCard=index;
		else matchCards(focusedCard, index);
	}
	clicks++;
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

var update=function(modifier) {
	checkWin();

	var cl=document.getElementById("clicks");
	cl.removeChild(cl.firstChild);
	cl.appendChild(document.createTextNode("Clicks: "+clicks));
}

var render=function() {
	if(sprReady) {
		var offsetX=0;
		var offsetY=0;
		// 
		for(var i=0; i<3*level; i++) {
			for(var j=0; j<6; j++) {
				var index=i*6+j;
				if(cards[index].show || cards[index].countdown>0) {
					var cardY=cards[index].id%9;
					var cardX=Math.floor(cards[index].id/9);
					ctx.drawImage(spr, 64+64*cardX, 64*cardY, 64, 64, offsetX, offsetY, 64, 64);
				}
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

init(level);
reset();
main();
