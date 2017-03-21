'use strict'
let mongoose=require('mongoose');
let Schema=mongoose.Schema;

let BookingSchema= new Schema({
 flight:{
 	type:Schema.ObjectId,
 	ref:'Flight',
 	require:true
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
 		required:false
 	}
 }
});

BookingSchema.pre('save', function(next) {
    this.BookingId = this.flight+'.'+this.user+'.'+Date.now();
    next();
});

module.exports = mongoose.model('Booking',BookingSchema);