let express = require('express');
let app = express(); //init Express
let bodyParser = require('body-parser');
let router = express.Router();
let connection=require('./utils/dbConn.js');
var request = require('request')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*'/*'http://localhost:3000'*/);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*'/*'X-Requested-With,content-type'*/);

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
function isValidDate(date){
    const flghtDate=new Date(date);
    const currentDate=new Date();
    return currentDate<flghtDate;
}
function varifyMessage(msg){
    const arr=msg.split("on");
    if(arr.length===2){
        const flightNo=arr[0].trim();
        const date=arr[1].trim();
        return ((/\d{6}/.test(flightNo) && isValidDate(date)));
    }else{
        return false;
    }

}
app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            console.log(sender);
            text = event.message.text
            if(varifyMessage(text)){
                sendTextMessage(sender, "Thank you , you will recieve messages for above flight");
            }else{
                sendTextMessage(sender, "OOPS!! You need to insert in correct format : \" flight-number on year,month,day\" "); 
            }
            
        }
    }
    res.sendStatus(200)
})
app.post('/test',(req,res)=>{
 const msg=req.body.msg;
 res.send(varifyMessage(msg));
});

var token = "EAARedKwegwoBAPOFQcZBshYmk1FS60zmyXxtTELhhPvYsTo6UC3dab8BSJ9HAZBH3ERnIZAM7ciVs8XFwr5SO1JaY3dlpZBRgkymLSFsrw0As6YI2X3XmZBMEXSrbStuwFrcUeORVRo1HCpVjrNBYGhpeLddEN2mjEkCd3ERJlwZDZD";
let port = process.env.PORT || 5000;
//init Express Router
connection.connect();
const api=require('./routes/api');
const method=require('./routes/method');
//associate router to url path
app.use('/api', api);
app.use('/method',method);
//start the Express server
app.listen(port);
console.log('Listening on port ' + port);


function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}