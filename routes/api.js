var express = require('express')
var router = express.Router();
let mongoose = require('mongoose');
let User=require('../utils/model/User.model');
let Booking=require('../utils/model/Booking.model');
let Flight=require('../utils/model/Flight.model');
let jwt=require('../utils/jwtAuth.js');
let dbService=require('../utils/dbService.js');
let services=require('../utils/services.js');
let webpush=require('../utils/webpush.js');
const wp = require('web-push');
let fbBot=require('../utils/fbBot.js');;



router.post('/test',(req,res)=>{
  dbService.getByFlightNo(req.body.f,req.body.d,req.body.m,req.body.y).then((booking)=>{
    res.send(booking);
  },(error)=>{
    res.send("ss");
  })
});
router.post('/sendMessageToPassengers',function(req,res){
  const f=req.body.flight;
  const message=req.body.message;
  const date=new Date(req.body.date);
  console.log("DAY",date.getDate());
   console.log("MONTH",(date.getMonth())+1);
    console.log("YEAR",date.getFullYear());
  console.log(date);
  Flight.findOne({flightNumber:f},(err,flight)=>{
    if (err) {
      console.log(err);
      res.send({status:false});
    } else {
      const bookingpk=flight._id;
     Booking.find({'flight':mongoose.Types.ObjectId(bookingpk),"date.day":date.getDate(),"date.month":date.getMonth()+1,"date.year":date.getFullYear()},(err,bookings)=>{
        if (err) {
          console.log(err);
          res.send({status:false});
        } else {
          console.log("Results",message);
           fbBot.sendMessage(f,date.getDate(),date.getMonth()+1,date.getFullYear(),message);
           console.log("before sending");
           console.log(bookings[0]);
          bookings.forEach((bookingObject)=>{
            webpush.sendPushNotification(bookingObject.user,message);
            dbService.addMsgToDatabase(bookingObject._id,message);
          });
          res.send({status:true})
        }
      });
    }
  });
});

router.post('/getFlightInfo',(req,res)=>{
  const flightNo=req.body.flightNo;
  const date=req.body.date;
  const flightdate= new Date(date);
  dbService.getByFlightNo(flightNo,flightdate.getDate(),flightdate.getMonth()+1,flightdate.getFullYear()).then((booking)=>{
    res.send(booking)
  },(error)=>{
    res.send({status:false,msg:"No booking found for this flight"});
  }

  )
})
/*
router.post('/sendMessageToPassengers1',function(req,res)=<{
  const f=req.body.flight;
  const message=req.body.message;
  const date=req.body.date;
  const dateObj:services.parseTheDate(date);
  Flight.findOne({flightNumber:f},(err,flight)=>{
    if (err) {
      console.log(err);
      res.send({status:false});
    } else {
      const bookingpk=flight._id;
     Booking.find({'flight':mongoose.Types.ObjectId(bookingpk),dateObj:{day:""}},(err,bookings)=>{
        if (err) {
          console.log(err);
          res.send({status:false});
        } else {
        //console.log(result);
          bookings.forEach((bookingObject)=>{
            webpush.sendPushNotification(bookingObject.user,message);
            dbService.addMsgToDatabase(bookingObject._id,message);
          });
          res.send({status:true})
        }
      });
    }
  });
});
*/
router.get('/findByBid/:bookingId',(req,res)=>{
  const bookingId=mongoose.Types.ObjectId(req.params.bookingId);
 dbService.getByBookingId(bookingId).then((booking)=>{
  if(booking){
    res.send(booking);
  }else{
  res.send({status:false,msg:"Sorry No User found"});
  }
 },(err)=>{
  res.send({status:false,msg:"Sorry No User found"});
 })
});

router.post('/login',(req,res)=>{
  let email=req.body.email;
  let password=req.body.password;
  User.findOne({email:email,password:password},(err,result)=>{
    if (err) {
      console.log(err);
      
    } else {
      if(result){
      let token=jwt.generateToken({name:result.name,email:result.email});
      res.send({status:true,authKey:token,pub_noti_token:webpush.pub_key});
      }
      else{
        res.send({status:false,msg:"User not found"});
      }
      
    }
  });
});

router.get('/addUser/:key',function(req,res){
  const authkey=req.params.key;
})


router.get('/register/:authKey/:name/:email/:password',function(req,res){
const name=req.params.name;
const email=req.params.email;
const password=req.params.password;
const authKey=req.params.authKey;
  if(authKey==="1staprilwtf"){
    let obj = new User({ name: name,email:email,password:password });
      obj.save( (err, user)=> {
        if (err) {
          const error=err.errors;
          console.error(error);
          if (error && error.name) {
             res.send({status:false,message:error.name.message});
          } else if(error && error.password){
            res.send({status:false,message:error.password.message});
          }else if(error && error.email){
            res.send({status:false,message:error.email.message});
          }else{
            res.send({status:false,message:"there was some error"})
          }
        }
        else{
          console.log(user);
          let token=jwt.generateToken({name:user.name,email:user.email});
          res.send({status:true,authKey:token,pub_noti_token:webpush.pub_key});
        }
      });
  }else{
       res.send({status:false,message:"Authentication Failed"})
  }
});

router.get('/userFlightsInfo1/:Key',(req,res)=>{
   let responseObj={
    bookings:[]
  };
  const authkey=req.params.Key;
  dbService.varifyAuthkey(authkey).then((userObject)=> {
    responseObj.user=userObject.object;
    return  dbService.getUserByEmail(userObject.object.email);
  },(err)=> {
    console.log(err); // Error: "It broke"
    res.send("Some error occured");
  }).then((user)=>{
      const userid=user._id;
      console.log(userid);
      return dbService.getBookingForUser1(userid);
  },(errorUserSchema)=>{
      console.log(errorUserSchema);
       res.send("Some error occured in User Schema");
  }).then((arrbooking)=>{
    responseObj.bookings=arrbooking;
    res.send({responseObj});
  },(errbooking)=>{
    console.log(errbooking);
    res.send("Some error occured in User Schema");
  });


router.get('/userFlightsInfo/:Key',(req,res)=>{
   let responseObj={
    bookings:[]
  };
  const authkey=req.params.Key;
  dbService.varifyAuthkey(authkey).then((userObject)=> {
    responseObj.user=userObject.object;
    return  dbService.getUserByEmail(userObject.object.email);
  },(err)=> {
    console.log(err); // Error: "It broke"
    res.send("Some error occured");
  }).then((user)=>{
      const userid=user._id;
      console.log(userid);
      return dbService.getBookingForUser(userid);
  },(errorUserSchema)=>{
      console.log(errorUserSchema);
       res.send("Some error occured in User Schema");
  }).then((arrbooking)=>{
    responseObj.bookings=arrbooking;
    res.send(responseObj);
  },(errbooking)=>{
    console.log(errbooking);
    res.send("Some error occured in User Schema");
  });
});
  /*
dbService.getUserByEmail(userObject.object.email).then((user)=>{
      const userid=user._id;
      console.log(userid);
      dbService.getBookingForUser(userid).then((arrbooking)=>{
        responseObj.bookings=arrbooking;
        res.send(responseObj);
      },(errbooking)=>{
        console.log(errbooking);
        res.send("Some error occured in User Schema");
      })
      
    },(errorUserSchema)=>{
      console.log(errorUserSchema);
       res.send("Some error occured in User Schema");
    });
  */
 /* let responseObj={
    bookings:[]
  };
  //obtain user email
  const authkey=req.params.key;
  const user=jwt.varifyToken(authkey);
  //obtain userId from Email
  responseObj.email=user.email;
  responseObj.name=user.name;
  User.findOne({email:"dey7.kol@gmail.com"},(err,userret)=>{
    if (err) {
      console.log(err);
      res.send({status:false,msg:"Error occured User not found"});
    } else {
      if(userret){
        const user_id=userret._id;
        responseObj.user=userret;
        Booking.find({user:user_id},(errBooking,bookingsret)=>{
            console.log(responseObj.bookings);
            bookingsret.forEach((booking)=>{
              console.log(booking);
              const flight_id=booking.flight;
              const bookingObj={};
              bookingObj.seatNo=booking.boarding.seatNo;
              bookingObj.messeges=booking.msg;
              booking.bookingNo=booking.BookingId;
              //Retrieve flight Info
              Flight.findOne({_id:flight_id},(errFlight,flight)=>{
                bookingObj.flightInfo=flight;
                responseObj.bookings.push(bookingObj);
                  res.send(responseObj);
              });
              
            });
        });
      }else{
          res.send({status:false,msg:"User not found"});
      }
    }
  })*/

})
router.get('/getUser/:key',(req,res)=>{
    let authkey=req.params.key;
    let user=jwt.varifyToken(authkey);
    res.send(user.object);
})

router.get('/allUsers',(req,res)=>{

    User.find( (err, users)=> {
        if (err) return console.error(err);
        console.log(users);
        res.send(users);
    })
})

router.post('/generateBoardingPass',(req,res)=>{
  const bookingId=req.body.b_id;
  const seat_no=req.body.seatNo;
  Booking.findById(bookingId, function (err, booking) {
    if (err) {
      console.log(err);
      res.send({status:false,msg:"An error occured"});
    }
    else{
      booking.boarding.seatNo = seat_no;
      tank.save(function (err1, updatedBooking) {
        if (err1) {
          console.log(err1);
          res.send({status:false,msg:"An error occured"});
        }
        else{
            res.send({status:true,obj:updatedBooking});  
        }
     });
    }
  });
});

router.post('/push-subscribe',(req,res)=>{
const authkey=req.body.authKey;
const subscription=req.body.subs;
dbService.varifyAuthkey(authkey).then((userObject)=> {
  console.log(userObject);
  const userEmail=userObject.object.email;
  User.findOneAndUpdate({email: userEmail}, {$set: {subscriptionKey: subscription}},(err,result)=>{
  if(err){
    console.log(err);
    res.send(error);
  }
  else{
    console.log("User subscribed");
    res.send(result);
  }
  });
  //const userEmail=userObje  ct.object.email;
}).catch(function(error){
 res.send({status:false,msg:"User not found"});
});
});


router.post('/msgFrmServer',(req,res)=>{
Booking.findOneAndUpdate({BookingId: req.body.b_id}, {$push: {msg: req.body.msg}},(err,result)=>{
  if(err){
    console.log(err);
    res.send(error);
  }
  else{
    res.send(result);
  }
});
});

router.get('/booking/:bookingId',(req,res)=>{
  const b_id=req.params.bookingId;
  Booking.find({BookingId:b_id},(err,bookings)=>{
    res.send(bookings);
  });
})

router.get('/bookTicket/:flight/:user',(req,res)=>{
   const flight=req.params.flight;
   const user=req.params.user;
   Flight.findOne({_id:mongoose.Types.ObjectId(flight)},(err,flight)=>{
    if (err) {
      console.log(err);
      res.send({status:false,msg:"An error occured"});
    } else if(flight){
      User.findOne({_id:mongoose.Types.ObjectId(user)},(err1,user)=>{
        if(err1){
          console.log(err1);
           res.send({status:false,msg:"An error occured"});
        }else if(user){
           const today=new Date();
           const dateObj={
            day:Number(today.getDate())+Math.ceil(services.getRandomArbitrary(1,10)),
            month:today.getMonth(),
            year:today.getFullYear()
           };
            const bookingObj= new Booking({user:user._id,flight:flight._id,date:dateObj});
            bookingObj.save((err2,booking)=>{
              if(err2){
                console.log(err2);
                res.send({status:false,msg:"An error occured"});
              }else{
                res.send({status:true,obj:booking});
              }
            })
        }else{
           res.send({status:false,msg:"User Not Found"});
        }
      });
    }else{
       res.send({status:false,msg:"Flight not found"});
    }
  });
})

module.exports = router