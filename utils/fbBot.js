var exports = module.exports = {};
var services=require('./services.js');
var dbService=require('./dbService.js');
let bodyParser = require('body-parser');
const senderId="1305427642879751";
let FbSubs=require('./model/FbSubs');
const userAuthKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib29raW5ncyI6W10sImlhdCI6MTQ5MTA1MTQ2M30.P0p5A72FRJFlfqUQGED-k1srj3bmaWFWizmTdy3Ug5U";
exports.handleWebhook=function(req,res){
   messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            console.log(sender);
            text = event.message.text;
            const type=services.varifyMessage(text);
            services.sendTextMessage(sender, services.getMessageType(text));
        }
    }
    res.sendStatus(200)
}
exports.unsubscribe=(f,d,m,y)=>{
     FbSubs.remove({flightNo:f,day:d,month:m,year:y},(err,result)=>{
        if(err){
        }else if(result){
            
        }
        else{
        }
    });
}
exports.sendTopFiveNotification=()=>{
    FbSubs.find({}).limit(5).exec(function(err, flights) {
        flights.forEach((flight)=>{
                dbService.getByFlightNo(flight.flightNo,flight.day,flight.month,flight.year).then((booking)=>{
                console.log("Booking object from Inside",booking.msg);
                  var messages=booking.msg;
                if(messages && messages.length>0){
                    services.sendTextMessage(senderId, "Flight Number: "+flight.flightNo+"\n"+messages[messages.length-1]);
                }
            });
        })
        
    });
}
exports.sendFirstMessage=(f,d,m,y)=>{
    dbService.getByFlightNo(f,d,m,y).then((booking)=>{
        console.log("Booking object from Inside",booking.msg);
          var messages=booking.msg;
        if(messages && messages.length>0){
            services.sendTextMessage(senderId, "Flight Number: "+f+"\n"+messages[messages.length-1]);
        }
    },(err)=>{
        console.log("Booking object from error",booking);
    })
}
exports.sendMessage=(f,d,m,y,msg)=>{
    FbSubs.findOne({flightNo:f,day:d,month:m,year:y},(err,result)=>{
        if(err){
        }else if(result){
            services.sendTextMessage(senderId, "Flight Number: "+f+"\n"+msg);
        }
        else{
        }
    });
}
