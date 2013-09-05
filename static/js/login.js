$(function() {
    $( "button" )
        .button()
        .click(function( event ) {
            event.preventDefault();

            var socket = io.connect();
            socket.emit('set nickname','Namez');
            socket.emit('message', 'Message Sent on ' + new Date());


            socket.on('ready', function(data){
                window.location.href = "/lobby";
            });

        });
});
