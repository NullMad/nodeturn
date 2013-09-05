
/*
 * GET lobby page.
 */

exports.list = function(req, res){
    res.render('lobby',{
        locals : {
            title : 'Lobby'
            ,description: 'Pick a player. Start a game.'
            ,author: 'Alexei Sumila'
        }
    });
};