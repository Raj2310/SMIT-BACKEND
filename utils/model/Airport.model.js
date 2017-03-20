'use strict'

let mongoose=require('mongoose');

let Schema=mongoose.Schema;

let AirportSchema=new Schema({
	code:{
		type:String
	},
	address:{
		type:String
	}
});

module.exports = mongoose.model('Airport',AirportSchema);