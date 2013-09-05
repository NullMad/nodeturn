attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vColor;
varying float pos;



void main(void) {
    vec4 worldPos = uMVMatrix * vec4(aVertexPosition, 1.0);

    gl_Position = uPMatrix * worldPos;
    pos = worldPos.x;
    /*if(aVertexPosition.x<1.0){
     pos = 1.0;
     }*/

    vColor = aVertexColor;

}