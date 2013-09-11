
/*
 * GET lobby page.
 */

exports.list = function(req, res){
    req.session.name = req.session.name || "error";
    req.session.players = req.session.players || [];
    res.render('lobby',
        {
            title : 'Lobby'
            ,description: 'Pick a player. Start a game.'
            ,author: 'Alexei Sumila'
            ,playername: req.session.name + " v.s. "
            ,others: req.session.players
        }
    );
};