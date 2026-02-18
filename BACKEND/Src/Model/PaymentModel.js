const e = require('express');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true, 
    },
    ItemId: {
        type: String,
        required: true, 
    },
    Price: {
        type: Number,
        required: true,
    },
    Material: {
        type: String,
        required: true,
    },
    Quantity: {
        type: String,
        required: true
    },
    Size: {
        type: String,
        required: true,
        enum: ['S', 'M', 'L', 'XL', 'XXL'] 
    }
},{timestamps:true});

const Payment = mongoose.model('Payment', userSchema);
module.exports = Payment;