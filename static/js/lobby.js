$(document).ready(function(){
    jQuery.get('http://localhost:8081/js/glengine/shaders/vertex.shdr', function(data) {
        VX_SHADER = data;
        jQuery.get('http://localhost:8081/js/glengine/shaders/frag.shdr', function(data) {
            FG_SHADER = data;
            webGLStart();
        });
    });

});
$(window).resize(function() {
    webGLResize();
});
$(function() {
    $( "#selectable" ).selectable();
});
$(function() {
    $( "#accordion" ).accordion({ heightStyle: "auto",collapsible: true });
    $( "#accordion2" ).accordion();
});
var socket = io.connect();
socket.emit('ping clients','some text');

var FG_SHADER;
var VX_SHADER;

