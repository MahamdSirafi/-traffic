const mongoose = require("mongoose");
// const validator = require("validator");
const carsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "الرجاء ادخال نوع المركب"],
    trim: true,
  },
  class: {
    type: String,
    required: [true, "الرجاء ادخال فئة المركب"],
    trim: true,
  },
  name: {
    type: String,
    required: [true, "الرجاء ادخال اسم الشركة المصنعة للمركبة"],
    trim: true,
  },
  model: {
    type: String,
    required: [true, "الرجاء ادخال موديل المركبة"],
    trim: true,
  },
  sngine_number: {
    type: Number,
    required: [true, "الرجاء ادخال رقم المحرك للمركبة"],
    unique: true,
  },
  structure_number: {
    type: Number,
    required: [true, "الرجاء ادخال رقم الهيكل للمركبة"],
    unique: true,
  },
  plate_number: {
    type: String,
    required: [true, "الرجاء ادخال رقم اللوحة للمركبة"],
    unique: true,
    trim: true,
  },
  color: {
    type: String,
    required: [true, "الرجاء ادخال لون المركبة"],
    trim: true,
  },
  owner: {
    type: String,
    required: [true, "الرجاء ادخال اسم مالك المركبة"],
    trim: true,
  },
  national_number: {
    type: Number,
    required: [true, "الرجاء ادخال الرقم الوطني لمالك المركبة"],
  },
  fuelType: {
    type: String,
    required: [true, "الرجاء ادخال نوع وقود المركبة"],
    trim: true,
  },
  engineCapacity: {
    type: Number,
    required: [true, "الرجاء ادخال سعة المحرك"],
  },
  tareWeight: {
    type: Number,
    required: [true, "الرجاء ادخال الوزن الفارغ  للمركبة"],
  },
  grossWeight: {
    type: Number,
    required: [true, "الرجاء ادخال الوزن القائم للمركبة"],
  },
  axes: {
    type: Number,
    required: [true, "الرجاء ادخال عدد المحاور"],
  },
  examination: {
    type: Date,
    default: Date.now() + 1000 * 60 * 60 * 24 * 30 * 12 * 2,
  },
  productionDate: {
    type: Date,
    required: [true, "الرجاء ادخال تاريخ الصنع"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  // wanted_in_change: Boolean,
  // in_custody: Boolean,
});
const Car = mongoose.model("Car", carsSchema);

module.exports = Car;
