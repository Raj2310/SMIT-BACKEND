'use strict'

let mongoose=require('mongoose');
let Schema=mongoose.Schema;

let FlightSchema= new Schema({
	flightNumber:{
		type:string,
		unique:true
	},
	source:{
		type:Schema.types.ObjectId,
		ref:'Airport'
	},
	destination:{
		type:Schema.types.ObjectId,
		ref:'Airport'
	},
	time:{
		type:string
	}

})
module.exports = mongoose.model('Flight',FlightSchema);