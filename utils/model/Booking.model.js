'use strict'
let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let shortid = require('shortid');

let BookingSchema= new Schema({
 BookingId:String,
 flight:{
 	type:Schema.ObjectId,
 	ref:'Flight',
 	require:true
 },
 date:{
 	day:{
 		type:String,
 		default:new Date().getDate()
 	},
 	month:{
 		type:String,
 		default:new Date().getMonth()
 	},
 	year:{
 		type:String,
 		default:new Date().getFullYear()
 	}
 },
 user:{
 	type:Schema.ObjectId,
 	ref:'User',
 	require:true
 },
 boarding:{
 	id:{
 		type:String,
 		unique:true,
 		required:false,
 		default:shortid.generate
 	},
 	seatNo:{
 		type:String,
 		default:"4A"
 	}
 },
 msg:{
 	type:Array
 }
});

BookingSchema.pre('save', function(next) {
    this.BookingId = this.flight+'.'+this.user+'.'+Date.now();
    next();
});

module.exports = mongoose.model('Booking',BookingSchema);