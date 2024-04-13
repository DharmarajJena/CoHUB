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

const User=mongoose.model('User',userSchema);

const Project=mongoose.model('Project',projectSchema);

module.exports={User,Project};



// const productSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     }
// })