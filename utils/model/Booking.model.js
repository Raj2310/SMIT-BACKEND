'use strict'
let mongoose=require('mongoose');
let Schema=mongoose.Schema;

let BookingSchema= new Schema({

});

module.exports = mongoose.model('Booking',BookingSchema);