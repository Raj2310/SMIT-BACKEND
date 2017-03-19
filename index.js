let express = require('express');
let app = express(); //init Express
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let User=require('./model/User.model')
mongoose.connect('localhost:27017/test');
//init bodyParser to extract properties from POST data
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!");
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let port = process.env.PORT || 3000;
//init Express Router
let router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'App is running!' });
});

router.get('/register/:name/:email/:password',function(req,res){
const name=req.params.name;
const email=req.params.email;
const password=req.params.password;
let obj = new User({ name: name,email:email,password:password });
	obj.save(function (err, user) {
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
      res.send({status:true,message:"Successfuly inserted"});
    }
	});
});

router.get('/allUsers',function(req,res){

	User.find(function (err, users) {
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