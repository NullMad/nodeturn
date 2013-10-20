'use strict';
var FG_SHADER;
var VX_SHADER;
var ENGINE  = (function () {
    var engine = {};
    var gl;
    var main_scene = new Scene();
    var buffer_map = {};
    engine.initGL = function(canvas) {
        try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
            main_scene.addElement("Unit1","pyramid",new Vector(6096,135, 6096),new Vector(25,27,25));
            main_scene.addElement("Unit2","pyramid",new Vector(3096,135, 9096),new Vector(25,27,25));
            main_scene.addElement("table","table",new Vector(0,0,0),new Vector(1,1,1));

        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    };


    var getShader = function (gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            str = FG_SHADER;
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
            str = VX_SHADER;
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    };


    var shaderProgram;

    var initShaders = function () {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    };


    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();

    var mvPushMatrix = function () {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    };

    var mvPopMatrix = function () {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    };


    var setMatrixUniforms = function () {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    };


    var degToRad = function(degrees) {
        return degrees * Math.PI / 180;
    };


    var pyramidVertexPositionBuffer;
    var pyramidVertexColorBuffer;
    var cubeVertexPositionBuffer;
    var cubeVertexColorBuffer;
    var cubeVertexIndexBuffer;

    var initBuffers = function() {
        pyramidVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
        var vertices = PRIMITIVES_DEF.pyramid.vertices;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        pyramidVertexPositionBuffer.itemSize = 3;
        pyramidVertexPositionBuffer.numItems = 12;

        pyramidVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexColorBuffer);
        var colors = PRIMITIVES_DEF.pyramid.colours;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        pyramidVertexColorBuffer.itemSize = 4;
        pyramidVertexColorBuffer.numItems = 12;




        cubeVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        vertices = PRIMITIVES_DEF.table.vertices;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        cubeVertexPositionBuffer.itemSize = 3;
        cubeVertexPositionBuffer.numItems = 10;

        cubeVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
        colors = PRIMITIVES_DEF.table.colours;
        var unpackedColors = [];
        for (var i in colors) {
            var color = colors[i];
            for (var j=0; j < 24; j++) {
                unpackedColors = unpackedColors.concat(color);
            }
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
        cubeVertexColorBuffer.itemSize = 4;
        cubeVertexColorBuffer.numItems = 10;

        cubeVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
        var cubeVertexIndices = PRIMITIVES_DEF.table.indices;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
        cubeVertexIndexBuffer.itemSize = 1;
        cubeVertexIndexBuffer.numItems = 24;


       buffer_map["pyramid"] = new BufferObject(pyramidVertexPositionBuffer,null,pyramidVertexColorBuffer);


       buffer_map["table"] = new BufferObject(cubeVertexPositionBuffer,cubeVertexIndexBuffer,cubeVertexColorBuffer);
    };


    var rPyramid = 0;
    var rCube = 0;
    var selected = [];

    var drawScene_old = function () {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for(var i=0;i<1;i++){

            //gl.viewport(gl.viewportWidth/2*i, 0, gl.viewportWidth/2 * (1+i), gl.viewportHeight);
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

            mat4.perspective(60, 1.33, 0.1, 30000.0, pMatrix);

            mat4.identity(mvMatrix);

            mat4.rotate(mvMatrix, degToRad(10), [1, 0, 0]);
            mat4.translate(mvMatrix, [-6000-6000*i, -1500, -18500.0]);


            gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pyramidVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexColorBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, pyramidVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

            mvPushMatrix();
            //mat4.rotate(mvMatrix, degToRad(rPyramid), [0, 1, 0]);
            mat4.translate(mvMatrix, [6096,135, 6096]);
            mat4.scale(mvMatrix,[25,27,25]);//1219.2

            setMatrixUniforms();
            gl.drawArrays(gl.TRIANGLES, 0, pyramidVertexPositionBuffer.numItems);

            mvPopMatrix();

            mvPushMatrix();
            //mat4.rotate(mvMatrix, degToRad(rPyramid), [0, 1, 0]);
            mat4.translate(mvMatrix, [3096,135, 9096]);
            mat4.scale(mvMatrix,[25,27,25]);//1219.2

            setMatrixUniforms();
            gl.drawArrays(gl.TRIANGLES, 0, pyramidVertexPositionBuffer.numItems);

            mvPopMatrix();


            //mat4.translate(mvMatrix, [0.0, 0.0, 0.0]);

            mvPushMatrix();
            //mat4.rotate(mvMatrix, degToRad(0), [1, 0, 0]);
            //mat4.scale(mvMatrix,[1219.2,1,1219.2]);//1219.2

            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

            mvPopMatrix();
        }
    };


    var drawScene = function () {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

        mat4.perspective(60, 1.33, 0.1, 30000.0, pMatrix);


        mat4.identity(mvMatrix);

        mat4.rotate(mvMatrix, degToRad(10), [1, 0, 0]);
        mat4.translate(mvMatrix, [-6000, -1500, -18500.0]);


        var scene = main_scene.getSceneInTypeOrder();
        for(var type in scene){
            var buffers=buffer_map[type];
            if(buffers.position_buffer){
                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position_buffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffers.position_buffer.itemSize, gl.FLOAT, false, 0, 0);
            }
            if(buffers.color_buffer){
                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color_buffer);
                gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, buffers.color_buffer.itemSize, gl.FLOAT, false, 0, 0);
            }

            if(buffers.index_buffer){
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index_buffer);
            }

            for(var id in scene[type]){
                var element=scene[type][id];

                mvPushMatrix();
                //mat4.rotate(mvMatrix, degToRad(rPyramid), [0, 1, 0]);
                mat4.translate(mvMatrix, element.position.toArray());
                mat4.scale(mvMatrix, element.scale.toArray());//1219.2

                setMatrixUniforms();
                if(buffers.index_buffer){
                    gl.drawElements(gl.TRIANGLES, buffers.index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
                }else{
                    gl.drawArrays(gl.TRIANGLES, 0, buffers.position_buffer.numItems);
                }

                mvPopMatrix();
            }
        }
    };

    var lastTime = 0;

    var animate = function () {
        /*var timeNow = new Date().getTime();
         if (lastTime != 0) {
         var elapsed = timeNow - lastTime;

         rPyramid += (90 * elapsed) / 1000.0;
         rCube -= (75 * elapsed) / 1000.0;
         }
         lastTime = timeNow;*/
    };


    var tick = function () {
        requestAnimFrame(tick);
        drawScene();
        animate();
    }


    engine.webGLStart = function() {
        var div = document.getElementById("main3D");
        var canvas = div.children[0];
        canvas.width  = div.scrollWidth;
        canvas.height  = div.scrollHeight;
        engine.initGL(canvas);
        initShaders()
        initBuffers();

        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        tick();
    };

    engine.webGLResize = function() {
        if(gl && gl.viewportWidth){
            var div = document.getElementById("main3D");
            var canvas = div.children[0];
            canvas.width  = div.scrollWidth;
            canvas.height  = div.scrollHeight;

            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        }

    };
    return engine;
}
)();