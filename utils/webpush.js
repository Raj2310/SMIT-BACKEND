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
		 User.findOne({'_id':mongoose.Types.ObjectId(userId)},(err,result)=>{
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
				    res.status(200).send({success: true});
				  })
				  .catch((err) => {
				    if (err.statusCode) {
				      res.status(err.statusCode).send(err.body);
				    } else {
				      res.status(400).send(err.message);
				    }
				  });
			}       
		});
		/*const options = {
            vapidDetails: {
              subject: 'https://github.com/Raj2310/flightingPwa',
              publicKey:  pub_key,
              privateKey:  priv_key
            },
            TTL: 60 * 60
          };

          webpush.sendNotification(
            JSON.parse("{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/c48UeDnEKmU:APA91bEEZaM6djN2gG7Ki75J0FM95owHGKjH2PsaBVuZ_LrOdUqNdWgQZpNc1CjK66vk_WqKH6x3Hw8QjSx0Y6Qy5HXFXCZ4p9vI8kdPahN0QotVanlJahWQhM6xdaHDG9Eq-OvGm1Hx\",\"keys\":{\"p256dh\":\"BDaUpHNpbycurQX_I-u9MzRmwkC8Zj-KgyzAoPGopYAW_wy0c1y7A5UbcxKubyfxNCgTIi5hksZ6Gu3wKnSvJqY=\",\"auth\":\"cgmE-XWMaRVH0hC1p70c6A==\"}}"),
            "test 1",  
            options
          )
          .then(() => {
            res.status(200).send({success: true});
          })
          .catch((err) => {
            if (err.statusCode) {
              res.status(err.statusCode).send(err.body);
            } else {
              res.status(400).send(err.message);
            }
          });*/
	}
})();