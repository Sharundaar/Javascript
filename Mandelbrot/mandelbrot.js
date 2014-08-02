function Grid(minX, maxX, minY, maxY) {
	this.minX = minX;
	this.maxX = maxX;
	this.minY = minY;
	this.maxY = maxY;
}

function Imaginary(a, b) {
	this.a = a;
	this.b = b;
}

function add(z1, z2) {
	return new Imaginary(z1.a + z2.a, z1.b + z2.b);
}

function multiply(z1, z2) {
	return new Imaginary(z1.a*z2.a - z1.b*z2.b, z1.a*z2.b+z2.a*z1.b);
}

function module(z) {
	return Math.sqrt( z.a*z.a + z.b*z.b );
}

function pixToGridX(x, width, grid) {
	return (x / width * (grid.maxX - grid.minX) + grid.minX);
}

function pixToGridY(y, height, grid) {
	return (y / height * (grid.maxY - grid.minY) + grid.minY);
}

function gridToPixX(x, width, grid) {
	return (x - grid.minX) / (grid.maxX - grid.minX) * width;
}

function gridToPixY(y, height, grid) {
	return (y - grid.minY) / (grid.maxY - grid.minY) * height;
}

function stepX(width, grid) {
	return (grid.maxX - grid.minX) / width;
}

function stepY(height, grid) {
	return  (grid.maxY - grid.minY) / height;
}


var mandelbrotStop = 0;

function computeMandelbrot(z, c) {
	/*
	var m = module(add(multiply(z, z), c), c);
	if(m < 2)
		return 0
	else {
		mandelbrotStop += 1;
		if(mandelbrotStop > 20)
			return 0;
			
		return 1 + computeMandelbrot(add(multiply(z, z), c), c);
	}*/
	
	var max_iteration = 1000;
	var iteration = 0;
	
	while(module(z) < 2 && iteration < max_iteration) {
		var xtemp = z.a*z.a - z.b*z.b + c.a;
		z.b = 2*z.a*z.b + c.b;
		z.a = xtemp;
		iteration++;
	}
	
	return iteration;
}

var grid;

function drawMandelbrot() {
	var width = canvas.width;
	var height = canvas.height;
	
	var dx = stepX(width, grid);
	var dy = stepY(height, grid);
	
	for(var i = 0 ; i<width ; i++) {
		for(var j = 0 ; j<height ; j++) {
			var x = pixToGridX(i, width, grid);
			var y = pixToGridY(j, height, grid);
			var z = new Imaginary(x, y);
			
			mandelbrotStop = 0;
			
			var m = computeMandelbrot(new Imaginary(0, 0), z);
			
			ctx.fillStyle = (m==100 ? "#FFFFFF" : "#0000"+/*(parseInt(m*2.55)).toString(16)+(parseInt(m*2.55)).toString(16)+*/(m*2).toString(16));
			ctx.fillRect(i, j, 1, 1);
		}
	}
}


var canvas;
var ctx;

function mouseMoveHandle(event) {
	
}

var zoomMinX;
var zoomMinY;
var zoomMaxX;
var zoomMaxY;

function mouseUpHandle(event) {
	zoomMaxX = pixToGridX(event.clientX, canvas.width, grid);
	zoomMaxY = pixToGridY(event.clientY, canvas.height, grid);
	
	grid.minX = zoomMinX;
	grid.minY = zoomMinY;
	grid.maxX = zoomMaxX;
	grid.maxY = zoomMaxY;
	
	drawMandelbrot();
}

function mouseDownHandle(event) {
	zoomMinX = pixToGridX(event.clientX, canvas.width, grid);
	zoomMinY = pixToGridY(event.clientY, canvas.height, grid);
}

function mouseClickHandle(event) {
	var x = pixToGridX(event.clientX, canvas.width, grid);
	var y = pixToGridY(event.clientY, canvas.height, grid);
	
	alert("Coordinate : "+x+" "+y);
}

function resetHandle() {
	grid.minX = -2;
	grid.maxX = 1;
	grid.minY = -1;
	grid.maxY = 1;
	
	drawMandelbrot();
}

window.onload = function() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	canvas.width = 800;
	canvas.height = 600;
	grid = new Grid(-2, 1, -1, 1);
	
	drawMandelbrot();
	
	ctx.fillStyle = 'black';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

