"use strict";

const { vec3 } = glMatrix;

var canvas;
var gl;

var points = [];
var colors = [];

var numTimesToSubdivide=1;

var theta=0;

var transAngle=0;

var vertices = [
    0.0000, 0.0000, -1.0000,
    0.0000, 0.9428, 1,
    -0.8165, -0.4714, 0,
    0.8165, -0.4714, 0
];

var baseColor = [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 0.0
];


function initTriangles(){
	canvas = document.getElementById( "gl-canvas" );

	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
    }
    
    if(document.getElementById("shape").value == 0){
		shapeFirst();
	}
	else if(document.getElementById("shape").value == 1){
		shapeSecond();
	}
	else if(document.getElementById("shape").value == 2){
		shapeThird();
	}

};

function shapeFirst(){
	var u = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
	var v = vec3.fromValues( vertices[6], vertices[7], vertices[8] );
	var w = vec3.fromValues( vertices[9], vertices[10], vertices[11] );

    divideTriangle( u, v, w, numTimesToSubdivide );
    
    webgl();

    renderTriangles();
}

function shapeSecond(){
	var u = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
	var v = vec3.fromValues( vertices[6], vertices[7], vertices[8] );
    var w = vec3.fromValues( vertices[9], vertices[10], vertices[11] );
    
    divideTriangleLine( u, v, w, numTimesToSubdivide );

    webgl();

    renderLine();
    
}


function shapeThird(){//3d的向量
    var t = vec3.fromValues( vertices[0], vertices[1], vertices[2] );
    var u = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
	var v = vec3.fromValues( vertices[6], vertices[7], vertices[8] );
    var w = vec3.fromValues( vertices[9], vertices[10], vertices[11] );
    
    divideTetra(t, u, v, w, numTimesToSubdivide);

    webgl();

    render3D();
}

function webgl(){
    gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	
	// enable hidden-surface removal
	
	gl.enable(gl.DEPTH_TEST);
	
	//  Load shaders and initialize attribute buffers
	
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
	
	// Create a buffer object, initialize it, and associate it with the
	//  associated attribute variable in our vertex shader
	
	var vBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( points ), gl.STATIC_DRAW );
	
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	
	var cBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( colors ), gl.STATIC_DRAW );
	
	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );

}

function triangle( a, color){
    for (var k = 0; k < 3; k++) {
        colors.push(baseColor[color * 3 + k]);
    }

	points.push( rotationX(a[0],a[1]), rotationY(a[0],a[1]), a[2] );//把所有定点的信息都放入points
}

function triangle2D(a, b, c) {
    triangle(a, 0);
    triangle(b, 0);
    triangle(c, 0);
}

function divideTriangle( a, b, c, count ){ //count是层数
	// check for end of recursion
	if( count == 0 ){
		triangle2D( a, b, c);
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
        
	}
}

function triangleLine(a, b, color){
    for (var k = 0; k < 3; k++) {
	    colors.push(baseColor[color * 3 + k]);
	}

    points.push( rotationX(a[0],a[1]), rotationY(a[0],a[1]), a[2] );
	
	for (var k = 0; k < 3; k++) {
	    colors.push(baseColor[color * 3 + k]);
	}

    points.push( rotationX(b[0],b[1]), rotationY(b[0],b[1]), b[2] );
}

function triangleLineDrew(a, b, c){
    triangleLine(a, b, 0);
    triangleLine(b, c, 0);
    triangleLine(c, a, 0);
}

function divideTriangleLine( a, b, c, count ){ //count是层数
	// check for end of recursion
	if( count == 0 ){
		triangleLineDrew( a, b, c);
	}else{
		var ab = vec3.create();
		vec3.lerp( ab, a, b, 0.5 );//ab=a*0.5+b*(1-0.5)
		var bc = vec3.create();
		vec3.lerp( bc, b, c, 0.5 );
		var ca = vec3.create();
		vec3.lerp( ca, c, a, 0.5 );

		--count;

		// three new triangles
		divideTriangleLine( a, ab, ca, count );
		divideTriangleLine( b, bc, ab, count );
        divideTriangleLine( c, ca, bc, count );
        divideTriangleLine( ab, bc, ca, count );
        
	}
}

function renderTriangles(){
	gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length/3 );
    points=[];
    colors=[];
}

function renderLine(){
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, points.length/3 );
    points=[];
    colors=[];
}

function render3D(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//同时清除深度
    gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);
    points=[];
    colors=[];
}

function rotationX(x,y){
    var thetap = theta * Math.PI / 180.0;
    var transAnglep = transAngle * Math.PI / 180.0;
    var cos_theta = Math.cos(thetap);
    var sin_theta = Math.sin(thetap);
    var d = Math.sqrt(x*x+y*y);
    if(transAngle>0){
        cos_theta = Math.cos(transAnglep*d);
        sin_theta = Math.sin(transAnglep*d);
    }
    var ans=x*cos_theta-y *sin_theta;
    return ans;
    //a[0]*cos_theta-a[1]*sin_theta, a[0]*sin_theta+a[1]*cos_theta, a[2]
    // x * Math.cos(d * theta) - y * Math.sin(d * theta);
}

function rotationY(x,y){
    var thetap = theta * Math.PI / 180.0;
    var transAnglep = transAngle * Math.PI / 180.0;
    var cos_theta = Math.cos(thetap);
    var sin_theta = Math.sin(thetap);    
    var d = Math.sqrt(x*x+y*y);
    if(transAngle>0){
        cos_theta = Math.cos(transAnglep * d);
        sin_theta = Math.sin(transAnglep * d);
    }
    var ans=x*sin_theta+y*cos_theta;
    return ans;
}

function triangle3D(a, b, c, color) {
    // add colors and vertices for one triangle
    var baseColor = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 0.0
    ];

    for (var k = 0; k < 3; k++) {
        colors.push(baseColor[color * 3 + k]);
    }

    points.push( rotationX(a[0],a[1]), rotationY(a[0],a[1]), a[2] );

    for (var k = 0; k < 3; k++) {
        colors.push(baseColor[color * 3 + k]);
    }

    points.push( rotationX(b[0],b[1]), rotationY(b[0],b[1]), b[2] );

    for (var k = 0; k < 3; k++) {
        colors.push(baseColor[color * 3 + k]);
    }

    points.push( rotationX(c[0],c[1]), rotationY(c[0],c[1]), c[2] );
}

function tetra(a, b, c, d) {
    triangle3D(a, c, b, 0);
    triangle3D(a, c, d, 1);
    triangle3D(a, b, d, 2);
    triangle3D(b, c, d, 3);
}

function divideTetra(a, b, c, d, count) {
    // check for end of recursion
    if (count == 0) {
        tetra(a, b, c, d);
    } else {
        var ab = vec3.create();
        vec3.lerp(ab, a, b, 0.5);
        var ac = vec3.create();
        vec3.lerp(ac, a, c, 0.5);
        var ad = vec3.create();
        vec3.lerp(ad, a, d, 0.5);
        var bc = vec3.create();
        vec3.lerp(bc, b, c, 0.5);
        var bd = vec3.create();
        vec3.lerp(bd, b, d, 0.5);
        var cd = vec3.create();
        vec3.lerp(cd, c, d, 0.5);

        --count;

        divideTetra(a, ab, ac, ad, count);
        divideTetra(ab, b, bc, bd, count);
        divideTetra(ac, bc, c, cd, count);
        divideTetra(ad, bd, cd, d, count);
    }

}