const { default: mongoose } = require('mongoose');
const mongooose = require('mongoose'); 


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        maxlength: 32,
        trim: true
    }
     
}, {timestamps: true});

module.exports = mongoose.model('Category', categorySchema);