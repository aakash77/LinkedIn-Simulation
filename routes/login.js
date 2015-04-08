var	mysql	= require('./mysql'),
	encryption = require('./encryption');

module.exports = function(req,res){
	
	if(!req.body.email || !req.body.password){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var data = mysql.query("select * from users where email = ?",[req.body.email],function(err,response){
			if(err){
				console.log(err);
				res.status(500).json({status:500,message : "Please try again later"});
			}else{
				if(response.length==0){
					res.status(401).json({status:401,message : "Invalid Credentials"});
				}else{
					var inputPassword = req.body.password,
						email = response[0].email,
						password = response[0].password,
						salt = response[0].salt,
						saltBuf = new Buffer(salt,'base64'),
						userName = response[0].firstName + " " + response[0].lastName,
						lastLogin = response[0].lastLogin;
					
					/**
					 * In order to compare input and db password salt has to be
					 * converted back into binary since hash was created using that
					 * binary only*
					 */
					encryption.encryptPass(inputPassword,saltBuf,function(err,hash){
						/**
						 * Calculated binary hash has to be converted into base64
						 * since the password stored in the vault is in base64
						 * format*
						 */
						if(hash.toString("base64") == password){
							req.session.email = email;
							res.status(200).json({status : 200, email : email,name : userName,lastLogin : lastLogin});
						}else{
							res.status(401).json({status:401,message : "Invalid Credentials"});
						}
					});
				}
			}
		});
	}
}