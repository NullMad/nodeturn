var engine = ENGINE;
$(document).ready(function(){
    jQuery.get('http://localhost:8081/js/glengine/shaders/vertex.shdr', function(data) {
        VX_SHADER = data;
        jQuery.get('http://localhost:8081/js/glengine/shaders/frag.shdr', function(data) {
            FG_SHADER = data;
            engine.webGLStart();
        });
    });

});
$(window).resize(function() {
    engine.webGLResize();
});
$(function() {
    $( "#selectable" ).selectable();
});
$(function() {
    $( "#accordion" ).accordion({ heightStyle: "auto",collapsible: true });
    $( "#accordion2" ).accordion();
});
var socket = io.connect();
socket.emit("echo");
socket.on("echo",function(stuff){
    console.log("Client Echo!");
});

socket.on("new player",function(val){
    console.log("new player");
    console.log(val);
   var list = document.getElementById('selectable');
    var ul = document.createElement("ul");
    ul.innerHTML = val.nick;
    list.appendChild(ul);
});

console.log(_.functions());


