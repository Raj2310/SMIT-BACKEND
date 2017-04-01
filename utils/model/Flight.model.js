'use strict'

let mongoose=require('mongoose');
let Schema=mongoose.Schema;

let FlightSchema= new Schema({
	flightNumber:{
		type:String,
		unique:true
	},
	source:{
		type:Schema.ObjectId,
		ref:'Airport'
	},
	destination:{
		type:Schema.ObjectId,
		ref:'Airport'
	},
	time:{
		type:String
	}

})
module.exports = mongoose.model('Flight',FlightSchema);