var c=document.getElementById('myCanvas');
var ctx=c.getContext('2d');
var image=new Image();
image.onload=drawImageActualSize;
image.src='sprites.png';

function drawImageActualSize() {
	c.width=this.naturalWidth;
	c.height=this.naturalHeight;

	ctx.drawImage(this, 32, 32, 32, 32, 0, 0, 64, 64);
}
