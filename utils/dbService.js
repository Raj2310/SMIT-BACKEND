(function()
{
	let jwt=require('./jwtAuth.js');
	let User=require('./model/User.model');
	let Booking=require('./model/Booking.model');
	let Flight=require('./model/Flight.model');
	let Airport=require('./model/Airport.model');
	let mongoose = require('mongoose');
  var exports = module.exports = {};
  exports.getByBookingId=(bookingId)=>{
  	return new Promise((resolve,reject)=>{
  		Booking.findOne({_id:bookingId},(err,booking)=>{
  			if(err){
  				reject("Some Error occured");
  			}else{
  				if(booking){
  					console.log("booking",booking);
  					return(getFlightInfoForBooking(booking));
  				}else{

  					reject("No booking found");
  				}
  			}
  		},(error)=>{
  			console.log("vjinvfsv");
  			reject("No booking found");
  		}
  		).then((bookingObj)=>{
  			console.log(bookingObj);
  				resolve(booking);
  		});
  	});
  } 
  exports.getByFlightNo=(flightNo,day,month,year)=>{
  	return new Promise((resolve,reject)=>{
  		Flight.findOne({flightNumber:flightNo},(err,retFlight)=>{
    		if (err) {
      			console.log(err);
      			res.send({status:false,msg:"An error occured"});
    		} else if(retFlight){
      			Booking.findOne({flight:retFlight._id,"date.day":day,"date.month":month,"date.year":year},(errorBooking,booking)=>{
      				if(errorBooking){
      					console.log(errorBooking);
      					reject("Some error occured");
      				}else{
      					if(booking){
      						resolve(booking);
      					}else{
      						reject("No booking found");
      					}
      				}
      			});
    		}else{
       			reject({status:false,msg:"Flight not found"});
    		}
  		});
  	})
  };

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
  getFlightInfoForBooking=(bookingObj)=>{
  	return new Promise((resolve,reject)=>{
  		console.log("booking recieved",bookingObj.flight);
  		Flight.findOne({_id:bookingObj.flight},(errFlight,flight)=>{
                if (errFlight) {
                	reject({status:false,msg:"Error occured Flight not found"});
                } else {

                	var obj=bookingObj.toObject();
                	console.log("FLight Info",flight);
                	obj.flightNo=flight.flightNumber;
                	obj.source=flight.source;
                	obj.destination=flight.destination;
                	obj.time=flight.time;
                	Airport.findOne({_id:obj.source},(errSourceAirport,sourceAirport)=>{
			                if (errSourceAirport) {
			                	reject({status:false,msg:"Error occured errSourceAirport not found"});
			                } else {
			                	obj.sourceAddress=sourceAirport.address;
			                	obj.sourceCity=sourceAirport.city;
			                	obj.sourceName=sourceAirport.name;
			                	Airport.findOne({_id:obj.destination},(errDestinationAirport,destinationAirport)=>{
						                if (errSourceAirport) {
						                	reject({status:false,msg:"Error occured errSourceAirport not found"});
						                } else {
						                	obj.destinationAddress=destinationAirport.address;
						                	obj.destinationCity=destinationAirport.city;
						                	obj.destinationName=destinationAirport.name;
						                	resolve(obj);
						                }
						        });
			                }
			        });
                }
        });
    });
  };
  getSourceInfoForBooking=(bookingObj)=>{
  	return new Promise((resolve,reject)=>{
  		console.log("Source airport",bookingObj.source);
  		Airport.findOne({_id:bookingObj.source},(errFlight,airport)=>{
                if (errFlight) {
                	reject({status:false,msg:"Error occured Flight not found"});
                } else {
                	let obj=bookingObj;
                	obj.sourceAddress=airport.address;
                	obj.sourceCity=airport.city;
                	obj.sourceName=airport.name;
                	resolve(obj);
                }
        });
    });
  };
  exports.addMsgToDatabase=(bookingId,message)=>{
  		Booking.findOneAndUpdate({_id: mongoose.Types.ObjectId(bookingId)}, {$push: {msg: message}},(err,result)=>{
  			if(err){
    			console.log(err);
  			}
  			else{
    			//console.log(result);
  			}
		});
  };
  exports.getBookingForUser=(userid)=>{
  	return new Promise((resolve,reject)=>{
  			 	 Booking.find({user:userid},(err,arrbooking)=>{
		    if (err) {
		      console.log(err);
		      reject({status:false,msg:"Error occured User not found"});
		    } else {
		    	//console.log(arrbooking);
		    	var promises = [];
				arrbooking.forEach((bookingobj)=> {
    				promises.push(getFlightInfoForBooking(bookingobj));
				});
				Promise.all(promises).then(function(result) {
					resolve(result);				
				}, function(err1) {
					console.log(err1);
    				reject({status:false,msg:"Error occured User not found"});
				});
		      
		    }
	 	})
  	})
  }
})();