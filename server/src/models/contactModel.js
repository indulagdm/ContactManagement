const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    contactName:{
        type:String
    },
    contactNumber:{
        type:Number,
        required:[true],
        unique:true
    }

},{timestamps:true});

const contact = mongoose.model("contacts",contactSchema);
module.exports = contact