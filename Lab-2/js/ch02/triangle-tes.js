"use strict";

const { vec3 } = glMatrix;

var canvas;
var gl;

var points = [];

var numTimesToSubdivide = 4;

var theta = 60;

theta = theta * Math.PI / 180.0;

var cos_theta = Math.cos(theta);
var sin_theta = Math.sin(theta);


window.onload = function initTriangles(){
	canvas = document.getElementById( "gl-canvas" );

	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	// initialise data for Sierpinski gasket

	// first, initialise the corners of the gasket with three points.
	var vertices = [
		-1, -1,  0,
		 0,  1,  0,
		 1, -1,  0
	];

	// var u = vec3.create();
	// vec3.set( u, -1, -1, 0 );
	var u = vec3.fromValues( vertices[0], vertices[1], vertices[2] );
	// var v = vec3.create();
	// vec3.set( v, 0, 1, 0 );
	var v = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
	// var w = vec3.create();
	// vec3.set( w, 1, -1, 0 );
	var w = vec3.fromValues( vertices[6], vertices[7], vertices[8] );

	divideTriangle( u, v, w, numTimesToSubdivide );

	// configure webgl
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// load shaders and initialise attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// load data into gpu
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( points ), gl.STATIC_DRAW );

	// associate out shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	renderTriangles();
};

function triangle( a, b, c ){
	points.push( xAngle(a[0],a[1],theta), yAngle(a[0],a[1],theta), a[2] );//把所有定点的信息都放入points
	points.push( xAngle(b[0],b[1],theta), yAngle(b[0],b[1],theta), b[2] );
    
    points.push( xAngle(b[0],b[1],theta), yAngle(b[0],b[1],theta), b[2] );
    points.push( xAngle(c[0],c[1],theta), yAngle(c[0],c[1],theta), c[2] );

    points.push( xAngle(c[0],c[1],theta), yAngle(c[0],c[1],theta), c[2] );
    points.push( xAngle(a[0],a[1],theta), yAngle(a[0],a[1],theta), a[2] );
}

function divideTriangle( a, b, c, count ){ //count是层数
	// check for end of recursion
	if( count == 0 ){
		triangle( a, b, c );
	}else{
		var ab = vec3.create();
		vec3.lerp( ab, a, b, 0.5 );//ab=a*0.5+b*(1-0.5)
		var bc = vec3.create();
		vec3.lerp( bc, b, c, 0.5 );
		var ca = vec3.create();
		vec3.lerp( ca, c, a, 0.5 );

		--count;

		// three new triangles
		divideTriangle( a, ab, ca, count );
		divideTriangle( b, bc, ab, count );
        divideTriangle( c, ca, bc, count );
        divideTriangle( ab, bc, ca, count);
	}
}

function renderTriangles(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.LINES, 0, points.length/3 );
}

function xAngle(x,y,theta){
    var d = Math.sqrt(x*x+y*y);
    var ans = x * Math.cos(d * theta) - y * Math.sin(d * theta);
    return ans;
}

function yAngle(x,y,theta){
    var d = Math.sqrt(x*x+y*y);
    var ans = x * Math.sin(d * theta) + y * Math.cos(d * theta);
    return ans;
}