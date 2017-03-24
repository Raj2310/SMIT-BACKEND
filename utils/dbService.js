(function()
{
	let jwt=require('./jwtAuth.js');
	let User=require('./model/User.model');
	let Booking=require('./model/Booking.model');
  var exports = module.exports = {};
  exports.varifyAuthkey = (authkey)=>{
	 return new Promise((resolve,reject)=>{
	 	const user=jwt.varifyToken(authkey);
	 	if(user){
	 		resolve(user);
	 	}else{
	 		reject("Error");
	 	}
	 })
  }
  exports.getUserByEmail=(email)=>{
  	console.log(email);

  	return new Promise((resolve,reject)=>{
  			 	 User.findOne({email:email},(err,user)=>{
		    if (err) {
		      console.log(err);
		      reject({status:false,msg:"Error occured User not found"});
		    } else {
		      if(user){
		      	resolve(user);
		      }
		      else{
		      	reject({status:false,msg:"Error occured User not found"});
		      }
		    }
	 	})
  	})
  }
  exports.getBookingForUser=(userid)=>{
  	return new Promise((resolve,reject)=>{
  			 	 Booking.find({user:userid},(err,arrbooking)=>{
		    if (err) {
		      console.log(err);
		      reject({status:false,msg:"Error occured User not found"});
		    } else {
		    	console.log(arrbooking);
		      resolve(arrbooking);
		    }
	 	})
  	})
  }
})();