"use strict";

var gl,gl2;
var points;

window.onload = function init(){
	// 获取canvas元素
    var canvas = document.getElementById( "triangle-canvas" );
    var canvas2 = document.getElementById("square-canvas");
    gl = WebGLUtils.setupWebGL( canvas );
    gl2 = WebGLUtils.setupWebGL( canvas2 );
	if( !gl ){
		alert( "WebGL isn't available" );
    }
    if( !gl2 ){
		alert( "WebGL isn't available" );
	}

	// Three Vertices
	var vertices = [
		-1.0, -1.0, 
		 0.0,  1.0, 
		 1.0, -1.0, 
    ];
    
    var vertices2 = [
        -1.0, -1.0, 
		-1.0,  1.0, 
         1.0,  1.0, 
         1.0, -1.0,
    ];

	// Configure WebGL
	gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );//指定清空canvas的颜色
    
    gl2.viewport( 0, 0, canvas2.width, canvas2.height );
	gl2.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// Load shaders and initialize attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    var program2 = initShaders( gl2, "vertex-shader", "fragment-shader" );
    gl2.useProgram( program2 );

	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

    var bufferId2 = gl2.createBuffer();
	gl2.bindBuffer( gl2.ARRAY_BUFFER, bufferId2 );
	gl2.bufferData( gl2.ARRAY_BUFFER, new Float32Array( vertices2 ), gl2.STATIC_DRAW );

	// Associate external shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    var vPosition2 = gl2.getAttribLocation( program2, "vPosition" );
	gl2.vertexAttribPointer( vPosition2, 2, gl2.FLOAT, false, 0, 0 );
	gl2.enableVertexAttribArray( vPosition2 );

	render();
}

function render(){
    gl.clear( gl.COLOR_BUFFER_BIT );//颜色缓冲；清空canvas绘图区域
    gl2.clear( gl2.COLOR_BUFFER_BIT );//颜色缓冲；清空canvas绘图区域
	gl2.drawArrays( gl2.TRIANGLE_FAN, 0, 4 );
	gl.drawArrays( gl.TRIANGLES, 0, 3 );//绘制三角形
	//gl.drawArrays( gl.TRIANGLE_FANS, 3, 6 );
}