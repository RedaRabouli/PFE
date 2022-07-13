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
        maxlength:250000

    },
    price: {
        type: Number,
        require: true
    },
  
    photo: [
        {
            data: Buffer,
            contentType: String
        }
    ],
    category: {
        type: ObjectId,
        ref: 'Category',
        require: true
    },
   Surface: {
    type: String,
    require: true
   },
   sellorrent:{
    type: Boolean,
    require: true
   },
   city: {
    type: String,
    require: true,
    maxlength: 50,
    trim: true

   }
   

     
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);