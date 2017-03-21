(function()
{
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
})();