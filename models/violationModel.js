const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema({
  violation: {
    type: mongoose.Schema.ObjectId,
    ref: "List",
    required: [true, "لم يتم تحديد المخالفة"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "لم يتم تحديد المسؤول عن اعطاء المخالفة"],
  },
  license: {
    type: mongoose.Schema.ObjectId,
    ref: "License",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  Location: {
    region: {
      type: String,
      required: [true, "لم يتم تحديد المنطقة"],
    },
    start: {
      type: String,
      required: [true, "لم يتم تحديد الشارع"],
    },
  },
  plate_number: {
    type: String,
    required: [true, "لم يتم تحديد رقم اللوحة او لاوجود لها في قاعدة البنات"],
  },
  photo: {
    type: String,
    default: "449c96612228d914aedd34dabbf9e2.jpg",
  },
  paid: {
    type: Boolean,
    default: false,
  },
});

const Violation = mongoose.model("Violation", violationSchema);

module.exports = Violation;
