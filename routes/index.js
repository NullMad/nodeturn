
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('login',{
            title : 'Login'
            ,description: 'Please enter your username'
            ,author: 'Alexei Sumila'
        }
    );
};