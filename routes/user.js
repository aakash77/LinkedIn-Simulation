var mysql = require('./mysql'), encryption = require('./encryption');

var user = require('express').Router();


/**********************User**********************/
/**
 * Get All users
 */
user.get('/', function(req, res) {
	mysql.query("SELECT CONCAT_WS(' ',firstName,lastName) as name,email from users",
			function(err, response) {
		if (err) {
			console.log("Error while fetching list of all the users !!!");
			res.status(500).json({
				status : 500,
				message : "Please try again later"
			});
		} else {
			res.status(200).json({
				status : 200,
				data : response
			});
		}
	});
});

/**
 * Get user details
 */
user.get('/:email',function(req,res){

	if(!req.params.email){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var email = req.params.email;
		mysql.query("SELECT ??,??,??,??,?? FROM ?? WHERE ?? = ?",['firstName','lastName','gender','dob','summary','users','email',email],function(err,response){
			if(err){
				console.log("Error while retrieving user details !!!");
				res.status(500).json({
					status : 500,
					message : "Error while retrieving user details"
				});
			}else{
				res.status(200).json({
					status : 200,
					data : response
				});
			}
		});
	}
});

/**
 * Add user
 */
user.post('/',function(req, res) {
	if(!req.body.email || !req.body.firstName || !req.body.lastName ||!req.body.password){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}
	else{
		encryption.encryptPass(req.body.password,function(err, salt, hash) {
			if (err) {
				console.log("Error while encryption");
				res.status(500).json({
					status : 500,
					message : "Please try again later"
				});
			} else {
				/**
				 * Converting hash and salt to
				 * base64 in order to keep them in
				 * DB*
				 */
				var email = req.body.email, 
				userName = req.body.firstName + " " + req.body.lastName,
				lastLogin = new Date();
				lastLogin = lastLogin.toDateString() + " " + lastLogin.toLocaleTimeString();
				var queryParam = {
						email : email,
						firstName : req.body.firstName,
						lastName : req.body.lastName,
						password : hash
						.toString("base64"),
						salt : salt.toString('base64'),
						lastLogin : lastLogin
				};

				/**
				 * First check whether user already
				 * exist*
				 */
				mysql.query("SELECT * FROM users where email = ?",[ email ],function(err,response) {
					if (err) {
						console.log("Error while perfoming query !!!");
						res.status(500).json({
							status : 500,
							message : "Please try again later"
						});
					} else if (response.length > 0) {
						res.status(400).json({
							status : 400,
							message : "User already exist"
						});
					} else {
						/**
						 * No user found with the email id, create new user
						 */
						mysql.query("INSERT INTO users SET ?",queryParam,function(err,response) {
							if (err) {
								console.log("Error while perfoming query !!!");
								res.status(500).json({
									status : 500,
									message : "Please try again later"
								});
							} else {
								req.session.email = email;
								res.status(200).json({
									status : 200,
									email : email,
									name : userName,
									lastLogin : lastLogin
								});
							}
						});
					}
				});
			}
		});
	}
});


/**
 * Update User
 */
user.put('/',function(req,res){

	if(!req.body.email || !req.body.lastName || !req.body.gender || !req.body.dob || !req.body.summary){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var email = req.body.email;

		var queryParams = {
				firstName : req.body.firstName,
				lastName : req.body.lastName,
				gender : req.body.gender,
				dob : req.body.dob,
				summary : req.body.summary
		};

		mysql.query("UPDATE ?? SET ? WHERE ?? = ?",['users',queryParams,'email',email],function(err,response){
			if (err) {
				res.status(500).json({
					status : 500,
					message : "Error while updating user profile"
				});
			} else {
				res.status(200).json({
					status : 200,
					message : "Successfull"
				});
			}
		});
	}
});

/**********************User**********************/
/**********************Experience**********************/
/**
 * Get user experience
 */
user.get('/experience/:email', function(req, res) {

	if(!req.params.email){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var queryParam = {
				emailId : req.params.email
		}
		mysql.query("SELECT * from employment where ?", queryParam, function(err,
				response) {
			if (err) {
				res.status(500).json({
					status : 500,
					message : "Error while retrieving data"
				});
			} else {
				res.status(200).json({
					status : 200,
					data : response
				});
			}
		});
	}
});

/**
 * Add user experience
 */
user.post('/experience', function(req, res) {
	
	if(!req.body.email || !req.body.from || !req.body.to || !req.body.company || !req.body.designation){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var queryParam = {
				emailId : req.body.emailId,
				from : req.body.from,
				to : req.body.to,
				company : req.body.company,
				designation : req.body.designation
		}

		mysql.query("INSERT INTO employment SET ?", queryParam, function(err,
				response) {
			if (err) {
				console.log("Error while perfoming query !!!");
				res.status(500).json({
					status : 500,
					message : "Please try again later"
				});
			} else {
				res.status(200).json({
					status : 200,
					message : "Experience has been added Succesfully"
				});
			}
		});
	}
});

/**
 * Update user experience
 */
user.put('/experience', function(req, res) {
	if(!req.body.old || !req.body.update){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var old = req.body.old, update = req.body.update;

		var newParam ={
				from : update.from,
				to : update.to,
				company : update.company,
				designation : update.designation
		};
		mysql.query("UPDATE employment SET ? WHERE ?? = ? and ?? = ? and ?? = ? and ?? = ? and ?? = ?", [newParam,'emailId',old.emailId,'from',old.from,'to',old.to,'company',old.company,'designation',old.designation], function(err,
				response) {
			if (err) {
				console.log("Error while perfoming query !!!");
				console.log(err);
				res.status(500).json({
					status : 500,
					message : "Please try again later"
				});
			} else {
				res.status(200).json({
					status : 200,
					message : "Experience has been updated Succesfully"
				});
			}
		});
	}
});

/**
 * Delete Experience
 */
user.delete('/experience/:email/:company/:from/:to/:designation',function(req,res){
	
	if(!req.params.email || !req.params.company || !req.params.from || !req.params.to || !req.params.designation){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var email = req.params.email,
		company = req.params.company,
		from = req.params.from,
		to = req.params.to,
		designation = req.params.designation

		mysql.query('DELETE FROM ?? WHERE ?? = ? AND ??=? AND ?? = ? AND ?? = ? AND ?? = ?',['employment','emailId',email,'company',company,'from',from,'to',to,'designation',designation],function(err,response){
			if (err) {
				console.log("Error while deleting employment !!!");
				console.log(err);
				res.status(500).json({
					status : 500,
					message : "Error while deleting employment !!!"
				});
			} else {
				res.status(200).json({
					status : 200,
					message : "Employment has been deleted Succesfully"
				});
			}
		});
	}
});
/**********************Experience**********************/
/**********************Education**********************/
/**
 * Get user education
 */
user.get('/education/:email', function(req, res) {
	
	if(!req.params.email){
		res.status(400).json({
			status : 400,
			message : "Bad Request"
		});
	}else{
		var queryParam = {
				emailId : req.params.email
		}
		mysql.query("SELECT * from education where ?", queryParam, function(err,
				response) {
			if (err) {
				res.status(500).json({
					status : 500,
					message : "Error while retrieving data"
				});
			} else {
				res.status(200).json({
					status : 200,
					data : response
				});
			}
		});
	}
});

/**
 * Add user education
 */
user.post('/education', function(req, res) {

	var queryParam = {
			emailId : req.body.emailId,
			from : req.body.from,
			to : req.body.to,
			institution : req.body.institution,
			degree : req.body.degree
	}

	mysql.query("INSERT INTO education SET ?", queryParam, function(err,
			response) {
		if (err) {
			console.log("Error while perfoming query !!!");
			res.status(500).json({
				status : 500,
				message : "Please try again later"
			});
		} else {
			res.status(200).json({
				status : 200,
				message : "Education has been added Succesfully"
			});
		}
	});
});


/**
 * Update user education
 */
user.put('/education', function(req, res) {

	var old = req.body.old, update = req.body.update;

	var newParam ={
			from : update.from,
			to : update.to,
			institution : update.institution,
			degree : update.degree
	};
	mysql.query("UPDATE education SET ? WHERE ?? = ? and ?? = ? and ?? = ? and ?? = ? and ?? = ?", [newParam,'emailId',old.emailId,'from',old.from,'to',old.to,'institution',old.institution,'degree',old.degree], function(err,
			response) {
		if (err) {
			console.log("Error while perfoming query !!!");
			console.log(err);
			res.status(500).json({
				status : 500,
				message : "Please try again later"
			});
		} else {
			res.status(200).json({
				status : 200,
				message : "Education has been updated Succesfully"
			});
		}
	});
});

/**
 * Delete Education
 */
user.delete('/education/:email/:institution/:from/:to/:degree',function(req,res){

	var email = req.params.email,
	instt = req.params.institution,
	from = req.params.from,
	to = req.params.to,
	degree = req.params.degree

	mysql.query('DELETE FROM ?? WHERE ?? = ? AND ??=? AND ?? = ? AND ?? = ? AND ?? = ?',['education','emailId',email,'institution',instt,'from',from,'to',to,'degree',degree],function(err,response){
		if (err) {
			console.log("Error while deleting education !!!");
			console.log(err);
			res.status(500).json({
				status : 500,
				message : "Error while deleting education !!!"
			});
		} else {
			res.status(200).json({
				status : 200,
				message : "Education has been deleted Succesfully"
			});
		}
	});
});

/**********************Education**********************/
/**********************Skills**********************/
/**
 * Get user skills
 */
user.get('/skills/:email', function(req, res) {

	var queryParam = {
			emailId : req.params.email
	}
	mysql.query("SELECT * from skills where ?", queryParam, function(err,
			response) {
		if (err) {
			res.status(500).json({
				status : 500,
				message : "Error while retrieving data"
			});
		} else {
			res.status(200).json({
				status : 200,
				data : response
			});
		}
	});

});

/**
 * Add user skills
 */
user.post('/skills', function(req, res) {

	var queryParam = {
			emailId : req.body.emailId,
			name : req.body.name
	}

	mysql.query("INSERT INTO skills SET ?", queryParam,
			function(err, response) {
		if (err) {
			console.log("Error while perfoming query !!!");
			res.status(500).json({
				status : 500,
				message : "Please try again later"
			});
		} else {
			res.status(200).json({
				status : 200,
				message : "Skills has been added Succesfully"
			});
		}
	});
});
/**********************Skills**********************/

/**********************Connection**********************/

/**
 * Get User Connections
 */
user.get('/connection/:email',function(req,res){

	var email = req.params.email;

	mysql.query("SELECT * FROM ?? WHERE ?? = ? AND ?? = ? OR ?? = ?",['connections','status','active','firstUser',email,'secondUser',email],function(err,response){

		if(err){
			console.log("Error while retrieving user connections !!!");
			res.status(500).json({
				status : 500,
				message : "Error while retrieving user connections"
			});
		}else{
			if(response.length!==0){
				var array = [];
				response.forEach(function(connection){
					if(connection.firstUser===email){
						array.push(connection.secondUser);
					}else{
						array.push(connection.firstUser);
					}
				});

				mysql.query("SELECT CONCAT_WS(' ',firstName,lastName) as name,email FROM ?? WHERE ?? IN (?)",['users','email',array],function(err,rows){
					if(err){
						console.log("Error while retrieving user connections !!!");
						res.status(500).json({
							status : 500,
							message : "Error while retrieving user connections"
						});
					}else{
						res.status(200).json({
							status : 200,
							data : rows
						});
					}
				});
			}else{
				res.status(200).json({
					status : 200,
					message : "No Connections"
				});
			}
		}
	});
});


/**
 * Add user connection
 */
user.post('/connection',function(req,res){

	var queryParam = {
			firstUser : req.body.firstUser,
			secondUser : req.body.secondUser,
			status : "pending"
	};

	mysql.query("INSERT INTO ?? SET ?",['connections',queryParam],function(err,response){
		if(err){
			console.log("error while adding new connection");
			console.log(err);
			res.status(500).json({
				status : 500,
				message : "Please try again later"
			});
		}else{
			res.status(200).json({status : 200,message : "Successfull"});
		}
	});
});

/**
 * Get Connection Requests
 */
user.get('/connection/requests/:email',function(req,res){

	mysql.query("SELECT * FROM ?? WHERE ?? = ? AND ?? = ?",['connections','secondUser',req.params.email,'status','pending'],function(err,response){
		if(err){
			console.log("Error while fetching list of pending connection request");
			console.log(err);
			res.status(500).json({status : 500,message:"Error while retrieving the list"});
		}else{
			var array = new Array();
			response.forEach(function(row){
				array.push(row.firstUser);
			});
			if(array.length==0){
				res.status(200).json({status : 200,data : []});
			}else{
				mysql.query("SELECT CONCAT_WS(' ',firstName,lastName) as name,email FROM ?? WHERE ?? IN (?)",['users','email',array],function(err,rows){
					if(err){
						console.log("Error while fetching list of pending connection request");
						console.log(err);
						res.status(500).json({status : 500,message:"Error while retrieving the list"});
					}else{
						res.status(200).json({status : 200,data : rows});
					}
				});
			}
		}
	});
});


/**
 * Accept Connection Request
 */
user.post('/connection/accept',function(req,res){

	mysql.query("UPDATE ?? SET ?? = ? WHERE ?? = ? AND ?? = ?",['connections','status','active','firstUser',req.body.firstUser,'secondUser',req.body.secondUser],function(err,response){
		if(err){
			console.log("Error while accepting connection request");
			console.log(err);
			res.status(500).json({status : 500,message:"Error while accepting connection request"});
		}else{
			res.status(200).json({status : 200,message : "Successfull"});
		}
	});
});


/**
 * Reject Connection Request
 */
user.post('/connection/reject',function(req,res){

	mysql.query("UPDATE ?? SET ?? = ? WHERE ?? = ? AND ?? = ?",['connections','status','inactive','firstUser',req.body.firstUser,'secondUser',req.body.secondUser],function(err,response){
		if(err){
			console.log("Error while rejecting connection request");
			console.log(err);
			res.status(500).json({status : 500,message:"Error while rejecting connection request"});
		}else{
			res.status(200).json({status : 200,message : "Successfull"});
		}
	});
});

/**********************Connection**********************/

/**
 * Check validity of user
 */
user.post('/valid', function(req, res) {
	if (req.session.email) {
		res.status(200).json({
			status : 200,
			message : "user valid"
		});
	} else {
		res.status(401).json({
			status : 401,
			message : "invalid user"
		});
	}
});

module.exports = (function() {
	return user;
})();