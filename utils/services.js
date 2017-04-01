(function()
{
	var token = "EAARedKwegwoBAPOFQcZBshYmk1FS60zmyXxtTELhhPvYsTo6UC3dab8BSJ9HAZBH3ERnIZAM7ciVs8XFwr5SO1JaY3dlpZBRgkymLSFsrw0As6YI2X3XmZBMEXSrbStuwFrcUeORVRo1HCpVjrNBYGhpeLddEN2mjEkCd3ERJlwZDZD";

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