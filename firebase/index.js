var express = require('express');
var app = express(); //init Express
var bodyParser = require('body-parser');
var router = express.Router();
var registrationToken;
var path=require('path');
let mongoose = require('mongoose');
let Flights=require('./model/Flight.model')
let Booking=require('./model/Booking.model')
mongoose.connect('mongodb://admin:1staprilwtf@ds145039.mlab.com:45039/flighting');
//init bodyParser to extract properties from POST data
let db1 = mongoose.connection;
db1.on('error', console.error.bind(console, 'connection error:'));
db1.once('open', ()=> {
  console.log("we are connected!");
});
var k=0,bid=[],tokens=[];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/static', express.static('public'))
var port = process.env.PORT || 5000;

var admin = require("firebase-admin");



var serviceAccount = require('./service.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flighting-c903f.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("client/messages");

router.get('/home', function(req, res){
	res.sendFile(path.join(__dirname, '/admin.html'));
});

router.post("/noti",function(req,res){
	var f=req.body.flight;
	var m=req.body.message;
var payload = {
  notification: {
    "title": f,
    "body": m
  }
};

Flights.findOne({flightNumber:f},(err,result)=>{
		if (err) {
      console.log(err);
      res.send({status:false});
    } else {
      var n=result._id;
	  //console.log(n);
	  //res.send({status:true,timeD:result.time});
    getbid(n);
    }
	});
    
   function getbid(n){  
     var no = n;
	 Booking.find({'flight':mongoose.Types.ObjectId(n)},(err,result)=>{
		if (err) {
      console.log(err);
      res.send({status:false});
    } else {
    //console.log(result);
      for(i=0;i<result.length;i++){
          bid[i]=result[i].BookingId;
      }
        
	      console.log(bid); 
        getBID();
    }
	}); 
}




//querying data
function getBID(){

for(j=0;j<bid.length;j++)
{
ref.orderByChild("BookingId").equalTo(bid[j]).on("child_added", function(snapshot) {
  sendNoti(snapshot.val().token);
  //console.log("token is "+tokens[j]);
});
}



/*admin.messaging().sendToDevice(tokens, payload)
  .then(function(response) {
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });*/
}

function sendNoti(regitoken)
{
  admin.messaging().sendToDevice(regitoken, payload)
  .then(function(response) {
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });
}
res.send({status:'Sent',token:payload});
});


//associate router to url path
app.use('/api', router)


//start the server
app.listen(port);
console.log("listening on port: "+port);