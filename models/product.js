const { default: mongoose } = require('mongoose');
const mongooose = require('mongoose'); 
const {ObjectId} = mongooose.Schema


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        maxlength:150,
        trim: true
    },
    description: {
        type: String,
        require: true,
        maxlength:2500

    },
    price: {
        type: Number,
        require: true
    },
    quantity: { 
        type: Number

    },
    photo: {
        data: Buffer,
        contentType: String
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        require: true
    }
     
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);