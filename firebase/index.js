var express = require('express');
var app = express(); //init Express
var bodyParser = require('body-parser');
var router = express.Router();
var registrationToken;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 5000;

var admin = require("firebase-admin");



var serviceAccount = require('./service.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flighting-c903f.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("client/messages");

app.post("/",function(req,res){
	var f=req.body.flight;
	var m=req.body.message;
var payload = {
  notification: {
    "title": f,
    "body": m
  }
};


// Attach an asynchronous callback to read the data at our posts reference
ref.on("child_added", function(snapshot, prevChildKey) {
  var newPost = snapshot.val();
  console.log("Author: " + newPost.name);
  console.log("Title: " + newPost.favHero);
  registrationToken=newPost.token;
  console.log(registrationToken);
  console.log("Previous Post ID: " + prevChildKey);

  admin.messaging().sendToDevice(registrationToken, payload)
  .then(function(response) {
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });
});
res.send({status:'Sent',token:'payload'});
});


//start the server
app.listen(port);
console.log("listening on port: "+port);