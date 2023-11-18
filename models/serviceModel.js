const mongoose = require("mongoose");
const servicesSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, "الرجاء ادخال رقم الخدمة"],
    unique: true,
  },
  service: {
    type: String,
    required: [true, "الرجاء ملئ نوع الخدمة"],
  },
  max: {
    type: Number,
    required: [true, "الرجاء تحديد الحد الاقصى للخدمة"],
  },
});
const Service = mongoose.model("Service", servicesSchema);
module.exports = Service;
