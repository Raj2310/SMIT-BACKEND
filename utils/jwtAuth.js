(function()
{
  let jwt = require('jsonwebtoken');
  var exports = module.exports = {};
  exports.generateToken = (obj)=>{
	let token = jwt.sign(obj, 'shhhhh');
	return token;
  }
  exports.varifyToken = (token)=>{
  	try {
 	 var decoded = jwt.verify(token, 'shhhhh');
 	 return {status:true,object:decoded};
	} catch(err) {
  		return {status:false}
	}
  }


})();