const { uniq } = require('lodash');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile_no: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                var pattern=/^\d{10}$/
                return pattern.test(v);
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    address: {
        type: String,
        required: true
    },
    userId:{
        type:String,
        required:true,
        unique:true
    }
})

const projectSchema= new mongoose.Schema({

    userID:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
        unique:true
    },
    type:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    startedAt:{
        type:Date,
        default:Date.now()
    }
})

const productSchema = new mongoose.Schema({

    userID:{
        type:String,
        required:true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    video:{
        type:String
    },
    selling_price:{
        type:Number
    },
    rentPrice_perDay:{
        type:Number
    },
    available:{
        type:Boolean,
        required:true,
        default:true
    }
})

const User=mongoose.model('User',userSchema);

const Product=mongoose.model('Product',productSchema);

const Project=mongoose.model('Project',projectSchema);

module.exports={User,Project,Product};


