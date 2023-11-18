const mongoose = require("mongoose");

const messagSchema = new mongoose.Schema({
  messag: {
    type: String,
    required: [true, "الرجاء ملئ الرسالة"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "لم يتم تحديد صاحب الرسالة"],
    
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  read:{
    type:Boolean,
    default:false
  }
});
const Messag = mongoose.model("Messag", messagSchema);

module.exports = Messag;
