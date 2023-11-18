const mongoose = require("mongoose");
const licenseSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, "الرجاء ادخال رقم الاجازة"],
    unique: true,
  },
  class: {
    type: String,
    required: [true, "الرجاء إدخال فئة الاجازة"],
    trim: true,
  },
  issuedFrom: {
    type: String,
    trim: true,
    default: "حلب",
  },
  name: {
    type: String,
    required: [true, "الرجاء إدخال الإسم الثلاثي لصاحب الاجازة "],
    trim: true,
  },
  birthDate: {
    type: Date,
    required: [true, "الرجاء إدخال التولد"],
  },
  root: {
    type: String,
    required: [true, "الرجاء تحديد القيد المدني"],
  },
  nationality: {
    type: String,
    required: [true, "الرجاء تحديد الجنسية "],
  },
  bloodType: {
    type: String,
    required: [true, "الرجاء تحديد زمرة الدم"],
  },
  national_number: {
    type: Number,
    required: [true, "الرجاء إدخال الرقم الوطني لمالك الشهادة"],
  },
  expiryDate: {
    type: Date,
    default: Date.now() + 1000 * 60 * 60 * 24 * 30 * 12 * 8,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  points: {
    type: Number,
    default: 0,
  },
});
// licenseSchema.index({ _id:1 });
const License = mongoose.model("License", licenseSchema);

module.exports = License;
