'use strict'

let mongoose=require('mongoose');

let Schema=mongoose.Schema;

let FbSubsSchema=new Schema({
	flightNo:{
		type:String,
	},
	day:{
		type:String
	},
	month:{
		type:String
	},
	year:{
		type:String
	}
});

module.exports = mongoose.model('FbSubs',FbSubsSchema);