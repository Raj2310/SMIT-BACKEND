'use strict'

let mongoose=require('mongoose');
let Schema=mongoose.Schema;

let UserSchema = new Schema({
	name:{
		type:String,
		required:[true,'Name is required'],
		select:true
	},
	email:{
		type:String,
		required:[true,'Email id is required'],
		select:true,
		unique:[true,'Email already exists'],
		 validate: {
          validator: (v)=> {
            return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v);
          },
          message: '{VALUE} is not a valid email id!'
        }
	},
	password:{
		type:String,
		required:[true,'Password is required'],
		select:false,
		validate:{
			validator:(v)=>{
				return v.length>=6;
			},
			message:'Password has to be 6 characters or more'
		}
	}
})

module.exports = mongoose.model('User',UserSchema);