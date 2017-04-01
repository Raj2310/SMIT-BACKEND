(function(){
  //facebook token
	var token = "EAARedKwegwoBAPOFQcZBshYmk1FS60zmyXxtTELhhPvYsTo6UC3dab8BSJ9HAZBH3ERnIZAM7ciVs8XFwr5SO1JaY3dlpZBRgkymLSFsrw0As6YI2X3XmZBMEXSrbStuwFrcUeORVRo1HCpVjrNBYGhpeLddEN2mjEkCd3ERJlwZDZD";
	var request = require('request')
	let fs = require('fs');
  var exports = module.exports = {};
  exports.readFile = (filename)=>{
	 return new Promise((resolve,reject)=>{
	 	fs.readFile(filename, 'utf8', function(err, data) {
		  if (err){
		  	reject(Error(err));
		  }
		  else{
		  	resolve(data)
		  }
		});
	 })
  }
  exports.getRandomArbitrary=(min, max)=> {
  return Math.random() * (max - min) + min;
	}
  const isValidDate=(date)=>{
    const flghtDate=new Date(date);
    const currentDate=new Date();
    return currentDate<flghtDate;
}
	exports.parseTheDate=(datestring)=>{
		const flghtDate=new Date(date);
    	return {day:flghtDate.getDate(),month:flightDate.getMonth(),year:flightDate.getFullYear()};
	}
  exports.getMessageType=(msg)=>{
  const declineArr=[" Oops! I didn't catch you" ,
   "I don't quite understand" ,
    "Beg your your pardon! I don't understand what you said"];
 let message=msg.toLowerCase();
    if ((/hi/.test(message) || /hello/.test(message) || /hey/.test(message)  || /hya/.test(message)) && /flybot/.test(message)) {
        return `Hey there, I am here to help you manage your flights over a cup of coffee..!
                 Here is how I can help
                1. Subscribe me to <filght id> on <date>
                2. Mute <flight id> on <yyyy,mm,dd>`;
    } else if(/subscribe/.test(message)){
        const subscriptionmsg=(message.split("to"))[1];
        const restflightmsg=(message.split("to"))[0];
        if (subscriptionmsg) {
          const flightNo=((subscriptionmsg.split("on"))[0]);
          const date=((message.split("on"))[1]);
          if(flightNo && date && isValidDate(date)){
              return "Flight No "+flightNo.trim()+" date"+date;
          }else{
               return "Sorry the type \"Subscribe to <flightNo> on <yyyy,mm,dd>\"";
          }
        }
        else{
            return "Sorry the type \"Subscribe to <flightNo> on <yyyy,mm,dd>\"";
        }
    }else if(/noti/.test(message) && /past/.test(message)){
      return `1.<Notification #1>
                      2.<Notification #2>
                      3.<Notification #3>
                      4.<Notification #4>
                      5.<Notification #5>`;
    }else if(/mute/.test(message)){
        const subscriptionmsg=(message.split("to"))[1];
        if (subscriptionmsg) {
          const flightNo=((message.split("on"))[0]).trim();
          const date=((message.split("on"))[1]).trim();
          if(flightNo && date  && isValidDate(date)){
              return "Sure! I am just a call away";
          }else{
              return declineArr[Math.round(Math.random() * declineArr.length -1)];
          }
        }
        else{
        }
    }else{
       return declineArr[Math.round(Math.random() *declineArr.length  - 1)];
    }
  }

  exports.varifyMessage=(msg)=>{
    const arr=msg.split("on");
    if(arr.length===2){
        const flightNo=arr[0].trim();
        const date=arr[1].trim();
        return ((/\d{6}/.test(flightNo) && isValidDate(date)));
    }else{
        return false;
    }
  }
  exports.sendTextMessage=(sender, text)=> {
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
})();