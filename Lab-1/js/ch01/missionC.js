"use strict";

var gl;
var points;

window.onload = function init(){
	// 获取canvas元素
	var canvas = document.getElementById( "triangle-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	// Three Vertices
	var vertices = [
        -1.0, -1.0,
        -0.5,  0.5,
         0.0, -1.0,//三角形
         0.0, -1.0,
         1.0, -1.0,
         1.0,  1.0,
         0.0,  1.0,//四边形
		 /*0.0, -1.0,
		 1.0, -1.0,
		 1.0,  1.0,
		 0.0, -1.0,
		 1.0,  1.0,
		 0.0,  1.0*/
		 /*-0.5, -0.5,
		 0.0, 0.5,
		 0.5, -0.5*/
	];

	// Configure WebGL
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );//指定清空canvas的颜色

	// Load shaders and initialize attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	// Associate external shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 6, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	render();
}

function render(){
	gl.clear( gl.COLOR_BUFFER_BIT );//颜色缓冲；清空canvas绘图区域
	//gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
	gl.drawArrays( gl.TRIANGLES, 0, 3 );//绘制三角形
	gl.drawArrays( gl.TRIANGLE_FANS, 4, 7 );//绘制四边形
}