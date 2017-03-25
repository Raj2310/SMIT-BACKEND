// Import Admin SDK
var admin = require("firebase-admin");

var serviceAccount = require('./service.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flighting-c903f.firebaseio.com"
});


// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("client/messages");

// Attach an asynchronous callback to read the data at our posts reference
ref.on("value", function(snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});