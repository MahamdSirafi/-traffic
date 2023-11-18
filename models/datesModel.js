const mongoose = require("mongoose");
const datesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "لم يتم تحديد صاحب الموعد"],
  },
  service: {
    type: mongoose.Schema.ObjectId,
    ref: "Service",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
const Dates = mongoose.model("Dates", datesSchema);
module.exports = Dates;

// reviewSchema.pre(/^find/, function (next) {
//     this.populate({
//       path: "user",
//       select: "name national_number photo",
//     }).populate({
//       path: "service",
//       select: "service",
//     });
//     next();
//   });