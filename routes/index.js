
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index',{
        locals : {
            title : 'Login'
            ,description: 'Please enter your username'
            ,author: 'Alexei Sumila'
        }
    });
};