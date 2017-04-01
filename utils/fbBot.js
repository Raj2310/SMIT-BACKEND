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
            const type=services.varifyMessage(text);
            services.sendTextMessage(sender, services.getMessageType(text));
        }
    }
    res.sendStatus(200)
}
exports.sendMessage=(bookingObject,msg)=>{
/*var  messege=bookingObject.msg.slice(-1)[0];
console.log(message);*/
    if(msg){
         services.sendTextMessage(senderId, msg);
    }
   
}
