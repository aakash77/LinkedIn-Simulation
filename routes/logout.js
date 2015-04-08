var mysql = require('./mysql');

module.exports = function(req,res){
	
	var email = req.body.email;
	var date = new Date();
	date = date.toDateString() + " " + date.toLocaleTimeString();
	var queryParam = {
			lastLogin : date
	}
	mysql.query('UPDATE users SET ? WHERE ?? = ?',[queryParam,'email',email],function(err,response){
		if(err){
			console.log("Error while upadting last login in db");
			res.status(500).json({status : 500,message : "Please try again"});
		}else{
			req.session.destroy();
			res.status(200).json({status : 200,message : "Session deleted"});
		}
	});
}