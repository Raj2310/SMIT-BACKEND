var express = require('express')
var router = express.Router();
let mongoose = require('mongoose');
let User=require('../utils/model/User.model');
let Booking=require('../utils/model/Booking.model');
let Flight=require('../utils/model/Flight.model');
let jwt=require('../utils/jwtAuth.js');



router.get('/', (req, res)=> {
  res.json({ message: 'App is running!' });
});

router.post('/login',(req,res)=>{
  let email=req.body.email;
  let password=req.body.password;
  User.findOne({email:email,password:password},(err,result)=>{
    if (err) {
      console.log(err);
      res.send({status:false});
    } else {
      let token=jwt.generateToken({name:result.name,email:result.email});
      res.send({status:true,authKey:token});
    }
  });
});


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
          res.send({status:true,authKey:token});
        }
      });
  }else{
       res.send({status:false,message:"Authentication Failed"})
  }
});

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
            const bookingObj= new Booking({user:user._id,flight:flight._id});
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