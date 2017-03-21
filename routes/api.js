var express = require('express')
var router = express.Router();

let User=require('../utils/model/User.model')
let jwt=require('../utils/jwtAuth.js')


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
          if (error.name) {
             res.send({status:false,message:error.name.message});
          } else if(error.password){
            res.send({status:false,message:error.password.message});
          }else if(error.email){
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


module.exports = router