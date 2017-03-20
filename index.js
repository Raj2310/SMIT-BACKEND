let express = require('express');
let app = express(); //init Express
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let User=require('./utils/model/User.model')
let jwt=require('./utils/jwtAuth.js')
mongoose.connect('mongodb://admin:1staprilwtf@ds145039.mlab.com:45039/flighting');
//init bodyParser to extract properties from POST data
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
  console.log("we are connected!");
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let port = process.env.PORT || 5000;
//init Express Router
let router = express.Router();

router.get('/', (req, res)=> {
  res.json({ message: 'App is running!' });
});

router.post('/login',(req,res)=>{
  let email=req.body.email;
  let password=req.body.password;
  console.log("Request Body: "+req.body);
  console.log("email: "+email+" password: "+password);
  User.findOne({email:email,password:password},(err,result)=>{
    if (err) {
      console.log(err);
      res.send({status:false});
    } else {
      res.send({status:true,user:result});
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

//associate router to url path
app.use('/api', router)
//start the Express server
app.listen(port);
console.log('Listening on port ' + port);