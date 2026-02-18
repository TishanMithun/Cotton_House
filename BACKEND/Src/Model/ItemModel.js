const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({

    ItemName: {
        type: String,
        required: true
    },
    ItemPrice: {
        type: Number,
        required: true
    },
    Gender: {
        type: String,
        enum: ['Men', 'Women'],
        required: true
    },
    Material: {
        type: String,
        required: true
    },
    Subcategory: {
        type: String,
        required: true
    },
    Url1:{
        type: String,
        //required: true
    },
    Url2:{
        type: String,
        //required: true
    },
    Url3:{
        type: String,
       // required: true
    },
    Url4:{
        type: String,
        //required: true
    },
    Url5:{
        type: String,
       // required: true
    }

}, {timestamps: true});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;