const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String,requried:true},
    price:{type:Number, required:true},
    productImage:{type:String,required:true}//type String as we will show only url pointing to the image in DB.
})

module.exports = mongoose.model('Product',productSchema); 