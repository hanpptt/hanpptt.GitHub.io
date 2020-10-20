"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;
var direction = 1;
var delay = 200;
var points=[];
var colors=[];
var eyes=[
    -0.5,0.5,0,
    -0.15,0.5,0,
    0.15,0.5,0,
    0.5,0.5,0,];

var baseColor = [
    1.0, 0.95, 0.9,
    0.0, 0.0 , 0.0
];

function reset(){
    location.reload();
}

function changeDir(){
	direction *= -1;
}

function initRotSquare(){
	canvas = document.getElementById( "rot-canvas" );
	gl = WebGLUtils.setupWebGL( canvas, "experimental-webgl" );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	var program = initShaders( gl, "rot-v-shader", "rot-f-shader" );
	gl.useProgram( program );

	// var vertices = [
    //      0,  1,  0,
    //      -0.5, 0.3, 0,
	// 	-1,  0,  0,
	// 	 1,  0,  0,
	// 	 0, -1,  0
	// ];

    var  vertices = calCircle(64,0.5);


	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	thetaLoc = gl.getUniformLocation( program, "theta" );

	document.getElementById( "controls" ).onclick = function( event ){
		switch( event.target.index ){
			case 0:
				direction *= -1;
				break;
			case 1:
				delay /= 2.0;
				break;
			case 2:
				delay *= 2.0;
				break;	
		}
	};

	document.getElementById( "speedcon" ).onchange = function( event ){
		delay = 100 - event.target.value;
	}

	renderSquare();
}

function renderSquare(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	// set uniform values
	theta += direction * 0.1;
	if( theta > 2 * Math.PI )
		theta -= (2 * Math.PI);
	else if( theta < -2 * Math.PI )
		theta += ( 2 * Math.PI );

	gl.uniform1f( thetaLoc, theta );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 64);

	// update and render
	setTimeout( function (){ requestAnimFrame( renderSquare ); }, delay );
	//setTimeout() 方法用于在指定的毫秒数后调用函数或计算表达式。
}

function calCircle(n,r){
     // 画n个点
     var vertices = new Float32Array(n*3);
     var angle = 0; // 开始的弧度 
     // var r = 0.7; // 圆的半径
     // θ值
     var stepAngle = 360/n * (Math.PI/180);
     for(var i=0; i<n*3; i+=3){
       // 计算顶点x坐标
       vertices[i] = r * Math.cos(angle)-1;
       // 计算顶点y坐标
       vertices[i+1] = r * Math.sin(angle);
       vertices[i+2] = 0;
       angle += stepAngle;
     }

     
     return vertices;
}

function line(a, b, color) {
    points.push( a[0], a[1], a[2] );//把所有定点的信息都放入points
    for (var k = 0; k < 3; k++) {
        colors.push(baseColor[color * 3 + k]);
    }
    points.push( b[0], b[1], b[2] );
    for (var k = 0; k < 3; k++) {
        colors.push(baseColor[color * 3 + k]);
    }

}