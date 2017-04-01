var exports = module.exports = {};
var services=require('./services.js');
let bodyParser = require('body-parser');

exports.handleWebhook=function(req,res){
   messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            console.log(sender);
            text = event.message.text;
            services.sendTextMessage(sender, "Thank you , you will recieve messages for above flight");
            /*if(services.varifyMessage(text)){
                services.sendTextMessage(sender, "Thank you , you will recieve messages for above flight");
            }else{
                services.sendTextMessage(sender, "OOPS!! You need to insert in correct format : \" flight-number on year,month,day\" "); 
            }  */   
        }
    }
    res.sendStatus(200)
}

