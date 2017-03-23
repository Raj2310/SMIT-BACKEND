let mongoose = require('mongoose');

module.exports.connect = ()=>{
	const mlab_url="mongodb://admin:1staprilwtf@ds145039.mlab.com:45039/flighting";
	const local_url="localhost:27017/test";
	mongoose.connect(mlab_url);
	//init bodyParser to extract properties from POST data
	let db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', ()=> {
	  console.log("we are connected!");
	});
}