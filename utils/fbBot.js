var exports = module.exports = {};
var services=require('./services.js');
let bodyParser = require('body-parser');
const senderId="1305427642879751";
exports.handleWebhook=function(req,res){
   messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            console.log(sender);
            text = event.message.text;
            if(services.varifyMessage(text)){
                services.sendTextMessage(sender, "Thank you , you will recieve messages for above flight You are"+sender);
            }else{
                services.sendTextMessage(sender, "OOPS!! You need to insert in correct format : \" flight-number on year,month,day\" "); 
            }     
        }
    }
    res.sendStatus(200)
}
exports.sendMessage=(bookingObject,message)=>{
//var  messege=bookingObject.msg.slice(-1)[0]
   /* if(messege){
        console.log("message Recieved ",message);
         services.sendTextMessage(senderId, messege);
    }*/
   
}
