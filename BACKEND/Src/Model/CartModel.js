const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId:{
        type:String,
        required: true
    },
    Url1:{
        type: String,
        required: true
    },
    Name:{
        type: String,
        required: true
    },
    ItemId:{
        type: String,
        required: true
    },
    ItemPrice:{
        type: Number,
        required: true
    },
    ItemName:{
        type: String,
        required: true
    },

}, {timestamps: true});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;