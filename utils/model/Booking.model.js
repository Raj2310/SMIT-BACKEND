'use strict'
let mongoose=require('mongoose');
let Schema=mongoose.Schema;

let BookingSchema= new Schema({
 bookingId:{
 	type:string,
 	required:true,
 	unique:true
 },
 flight:{
 	type:Schema.types.ObjectId,
 	ref:'Flight',
 	require:true
 },
 user:{
 	type:Schema.types.ObjectId,
 	ref:'User',
 	require:true
 },
 boarding:{
 	id:{
 		type:string,
 		unique:true
 	}
 }
});

BookingSchema.pre('save', function(next) {
    this.BookingId = this.flight+'.'+this.user+'.'+Date.now();
    next();
});

module.exports = mongoose.model('Booking',BookingSchema);