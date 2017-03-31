(function()
{
	let fs = require('fs');
	const webpush = require('web-push');
	let mongoose = require('mongoose');
	let User=require('../utils/model/User.model');
    var exports = module.exports = {};
	const pub_key="BNASTKuZMTWIM7lkZ30f_R4swIttSInEwIKdIAO8rmUoz8sAg51mR4a-Qn4Jm9Fs4_qmvDbKrSPHMWKXdmdXNfs";
	const priv_key="4OZnNldJbw-fmHFvFGgqYV7hSHFihLnj1ehP9cmDygQ";
	exports.sendPushNotification=function(userId,msg){
		 /*User.findOne({'_id':mongoose.Types.ObjectId(userId)},(err,result)=>{
		    if (err) {
		      console.log(err);
		      res.send({status:false});
		    } else {
		    	const subsKey=result.subscriptionKey;
		    	const options = {
				    vapidDetails: {
				      subject: 'https://github.com/Raj2310/flightingPwa',
				      publicKey:  pub_key,
				      privateKey:  priv_key
				    },
				    TTL: 60 * 60
				  };

				  webpush.sendNotification(
				    JSON.parse(subsKey),
				    msg,
				    options
				  )
				  .then(() => {
				    console.log("success");
				  })
				  .catch((err) => {
				    if (err.statusCode) {
				      console.log("error",err.statusCode);
				    } else {
				      console.log("error",err.message);
				    }
				  });
			}       
		});*/
		const options = {
            vapidDetails: {
              subject: 'https://github.com/Raj2310/flightingPwa',
              publicKey:  pub_key,
              privateKey:  priv_key
            },
            TTL: 60 * 60
          };

          webpush.sendNotification(
            JSON.parse("{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/cQjTc6o8ynA:APA91bELv3UDxMTvapOmofAYqZdhF8TRPGEFDRf094yZVUAO8oowqluYgLEMxkEMGtQg4RIdadyIlqwmE8erWggIuvEnTpac66anrmzMRTfJDX_PXIABBbPPRFGLnDMBQXQcLDwesuVR\",\"keys\":{\"p256dh\":\"BLCYJaK14baJ9lUSAro_VdeMQCXLeVKeu6DdkFUHQf-vvkFwTHoVwF-gjOzzqOrTICVHjygIPlkN0wfgtTqk0ps=\",\"auth\":\"MVodFJSip5nz12i7D5UoIg==\"}}"),
            "test 1",  
            options
          )
          .then(() => {
             console.log("success");
          })
          .catch((err) => {
           if (err.statusCode) {
				      console.log("error",err.statusCode);
				    } else {
				      console.log("error",err.message);
				    }
          });
	}
})();