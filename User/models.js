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
    address:{
        type: { type: String, default: 'Point',required:true },
        coordinates: { type:[Number] , required:true}
    },
    userId:{
        type:String,
        required:true,
        unique:true
    },

})

const projectSchema= new mongoose.Schema({

    userID:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    ideal_description:{
        type:String
    },
    startedAt:{
        type:Date,
        default:Date.now()
    },
    keywords:{
        type:[String],
        default:[]
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
    },
    pickup_location:{
        type: { type: String, default: 'Point',required:true },
        coordinates: { type:[Number] , required:true}
    },
    booked:{
        type:Boolean,
        default:false
    },
    booking_date:{
        type:Date,
        default:Date.now()
    },
    booking_users:{
        type:String //stores the firebase user id of logged in user on booking
    }
})

const orderSchema= new mongoose.Schema({
    userID:{
        type:String,
        required:true
    },
    sellerID:{
        type:String,
        required:true
    },
    productID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required:true 
    },
    price:{
        type:Number,
        required:true
    },
    type: { 
        type: String,
        enum: ['buy', 'rent']
    },
    paymentId:{
        type:String,
        default:null
    },
    orderId:{
        type:String,
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    returnDate:{
        type:Date,
        default:null
    },
    rentDurationDays:{
        type:Number,
        default:null
    },
    returned:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:['pending','completed'],
        default:'pending'
    }
})

const Order=mongoose.model('Order',orderSchema);

productSchema.index({ pickup_location: '2dsphere' });
userSchema.index({ address: '2dsphere' });

const User=mongoose.model('User',userSchema);

const Product=mongoose.model('Product',productSchema);

const Project=mongoose.model('Project',projectSchema);

module.exports={User,Project,Product,Order};


